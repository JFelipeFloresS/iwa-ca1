import csv
import xml.etree.cElementTree as et
from xml.dom import minidom

# Opens the CSV file retrieved from the internet and stored locally.
with open('albums.csv', newline='') as csv_file:

    # Creates a dictionary based on the csv file.
    csv_reader = csv.DictReader(csv_file)

    # Initiates the Element Tree.
    root = et.Element('Collection')

    # For each row in the dictionary, add subelements to the Element Tree root with the necessary information.
    for row in csv_reader:
        album = et.SubElement(root, 'Album')
        et.SubElement(album, 'Number').text = row['Number'].strip()
        et.SubElement(album, 'Year').text = row['Year'].strip()
        et.SubElement(album, 'Title').text = row['Album'].strip().replace('&amp;', '&').replace('&quot;', '"')
        et.SubElement(album, 'Artist').text = row['Artist'].strip().replace('�', '').replace('&amp;', '&').replace('&quot;', '"')

    # Parses the Tree, transforming it into a pretty-read XML
    tree = et.ElementTree(root)
    xml_pretty = minidom.parseString(et.tostring(root)).toprettyxml(indent='    ') 

    # Saves the results into the albums.xml file
    with open('albums.xml', 'w') as xml:
        xml.write(xml_pretty)
