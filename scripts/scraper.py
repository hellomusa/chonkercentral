import requests
from bs4 import BeautifulSoup
import json
import time

def has_power(soup):
	power_icon = soup.find('i', class_='fa-plug')
	return power_icon is not None

def extract_room_info(eid):
	url = f"https://carletonu.libcal.com/space/{eid}"
	
	try:
		response = requests.get(url)
		response.raise_for_status()
		soup = BeautifulSoup(response.text, 'html.parser')
		# Find main content area
		main_content = soup.find('h1', id='s-lc-public-header-title')
		if not main_content:
			return None
		# Extract room number
		room = main_content.get_text().strip().split("\n")[0].strip()
	
		# Extract capacity
		capacity = int(main_content.findAll('small')[-1].get_text().split()[1])
		
		# Extract directions
		directions_div = soup.find('div', class_='s-lc-section-directions')
		directions = directions_div.find('p').get_text().strip() if directions_div else ""
		
		return {
			"eid": eid,
			"room": room,
			"capacity": capacity,
			"hasPower": 1,
			"directions": directions,
			"link": url,
			"lat": 45.3819,  # Default coordinates for MacOdrum Library
			"lng": -75.6996
		}
	except Exception as e:
		print(f"Error processing EID {eid}: {str(e)}")
		return None

def main():
	library_spots = []

	eids = ["26867","26868","26869","26870","26889","26890","26891","26892","26893","26894","26895","26896","26897","26898","26899","26900","26901","26902","26975","26976","26977","26978","26883","26884","26885","26886","26887","26888","26871","26872","26873","26874","26875","26876","26877","26878","26879","26880","26881","26882"]
	
	# Range of EIDs to scrape (26867 to 26902)
	# for eid in range(26867, 26903):
	for eid in eids:
		print(f"Processing EID: {eid}")
		room_info = extract_room_info(eid)
		
		if room_info:
			library_spots.append(room_info)
		
		# Be nice to the server
		time.sleep(1)
	
	# Create final JSON structure
	output = {"librarySpots": library_spots}
	
	# Save to file
	with open('library-spots.json', 'w', encoding='utf-8') as f:
		json.dump(output, f, indent=2)
		
	print(f"Scraped {len(library_spots)} study spots successfully!")

if __name__ == "__main__":
	main()