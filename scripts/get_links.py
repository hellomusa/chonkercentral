import requests
from bs4 import BeautifulSoup
import json

def get_study_spot_links():
    url = "https://library.carleton.ca/building/study-space/study-spaces-across-campus"
    base_url = "https://library.carleton.ca"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find all table rows
        rows = soup.find_all('tr')
        links = []
        
        for row in rows:
            # Find the link in the first column
            link_element = row.find('a')
            if link_element and link_element.get('href'):
                # Get relative link and make it absolute
                relative_link = link_element.get('href')
                full_link = base_url + relative_link
                links.append(full_link)
        
        # Save links to a file
        with open('study_spot_links.json', 'w') as f:
            json.dump({"links": links}, f, indent=2)
            
        print(f"Found {len(links)} study spot links")
        return links
        
    except Exception as e:
        print(f"Error fetching study spot links: {str(e)}")
        return []

if __name__ == "__main__":
    get_study_spot_links()