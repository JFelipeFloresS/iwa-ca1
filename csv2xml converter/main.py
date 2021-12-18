import csv
import xml.etree.cElementTree as et
from xml.dom import minidom

with open('albums.csv', newline='') as csv_file:
    csv_reader = csv.DictReader(csv_file)

    root = et.Element('Collection')

    for row in csv_reader:
        album = et.SubElement(root, 'Album')
        et.SubElement(album, 'Number').text = row['Number'].strip()
        et.SubElement(album, 'Year').text = row['Year'].strip()
        et.SubElement(album, 'Title').text = row['Album'].strip().replace('&amp;', '&').replace('&quot;', '"')
        et.SubElement(album, 'Artist').text = row['Artist'].strip().replace('�', '').replace('&amp;', '&').replace('&quot;', '"')

        #genres = et.SubElement(album, 'Genres')
        #for genre in row['Genre'].split(','):
        #    et.SubElement(genres, 'Genre').text = genre.strip().replace('�', '').replace('&amp;', '&').replace('&quot;', '"')

        #subgenres = et.SubElement(album, 'Subgenres')
        #for sub in row['Subgenre'].split(','):
        #   et.SubElement(subgenres, 'Subgenre').text = sub.strip().replace('�', '').replace('&amp;', '&').replace('&quot;', '"')

    tree = et.ElementTree(root)
    xml_pretty = minidom.parseString(et.tostring(root)).toprettyxml(indent='    ')
    with open('albums.xml', 'w') as xml:
        xml.write(xml_pretty)
