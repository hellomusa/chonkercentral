import requests
from bs4 import BeautifulSoup
import json
import time

def extract_text_after_strong(div):
	if not div:
		return None
	strong = div.find('strong')
	if not strong:
		return None
	# Get text after the strong tag
	text = div.get_text().replace(strong.get_text(), '').strip()
	return text

def extract_amenities(div):
	if not div:
		return None
	amenities_divs = div.find_all('div')
	# Skip the first div as it contains the header
	amenities = [div.get_text().strip() for div in amenities_divs[1:] if div.get_text().strip()]
	return ', '.join(amenities) if amenities else None

def extract_image_url(div):
	if not div:
		return None
	img = div.find('img')
	if not img or not img.get('src'):
		return None
	return 'https://library.carleton.ca' + img.get('src')

def extract_spot_info(url):
	try:
		response = requests.get(url)
		response.raise_for_status()
		soup = BeautifulSoup(response.text, 'html.parser')

		# Find all divs that contain the information
		divs = soup.find_all('div', recursive=True)
		
		# Initialize data dictionary
		spot_data = {
			"building": None,
			"location": None,
			"accessible": False,
			"amenities": None,
			"deskSize": None,
			"capacity": None,
			"comments": None,
			"image": None,
			"link": url,
			"lat": 45.3847,  # Default coordinates
			"lng": -75.6972
		}
		
		for div in divs:
			strong = div.find('strong')
			if not strong:
				continue
				
			label = strong.get_text().strip().lower()
			
			if 'building or area' in label:
				spot_data['building'] = extract_text_after_strong(div)
			elif 'location in building' in label:
				spot_data['location'] = extract_text_after_strong(div)
			elif 'accessible?' in label:
				spot_data['accessible'] = extract_text_after_strong(div).lower() == 'yes'
			elif 'amenities on site' in label:
				spot_data['amenities'] = extract_amenities(div)
			elif 'desk size' in label:
				spot_data['deskSize'] = extract_text_after_strong(div)
			elif 'capacity' in label:
				spot_data['capacity'] = extract_text_after_strong(div)
			elif 'comments' in label:
				spot_data['comments'] = extract_text_after_strong(div)
			# Find first image tag regardless of label
			img = div.find('img')
			if img and img.get('src'):
				spot_data['image'] = 'https://library.carleton.ca' + img.get('src')
		
		return spot_data
		
	except Exception as e:
		print(f"Error processing URL {url}: {str(e)}")
		return None

def main():
	# Load links from file
	with open('study_spot_links.json', 'r') as f:
		data = json.load(f)
		links = data.get('links', [])
	
	study_spots = []
	
	for link in links:
		print(f"Processing: {link}")
		spot_info = extract_spot_info(link)
		if spot_info:
			study_spots.append(spot_info)
		time.sleep(1)  # Be nice to the server
	
	# Save to file
	output = {"studySpots": study_spots}
	with open('study-spots.json', 'w', encoding='utf-8') as f:
		json.dump(output, f, indent=2)
	
	print(f"Scraped {len(study_spots)} study spots successfully!")

if __name__ == "__main__":
	main()