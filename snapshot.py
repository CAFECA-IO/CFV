from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
import os
import openpyxl
import urllib.parse

# read data from ./snapshot/ground3_result2.xlsx
wb = openpyxl.load_workbook("./snapshot/ground3_result.xlsx", data_only=True)
s1 = wb["T1"]

def get_values(sheet):
    arr = []
    for row in sheet:
        arr2 = []
        for column in row:
            arr2.append(column.value)
        arr.append(arr2)
    return arr

data = get_values(s1)
driver = webdriver.Chrome(ChromeDriverManager().install())
driver.set_window_size(1000, 660)
for i in range(len(data)):
    file_name = "./snapshot/TN%s.png" % format(i, '05d')
    if i <= 0 or i >= 5000:
        continue
    if os.path.exists(file_name):
        continue
    baseurl = "https://www.google.com/maps/dir/"
    address1 = urllib.parse.quote(data[i][3])
    address2 = urllib.parse.quote(data[i][4])
    url = "%s%s/%s" % (baseurl, address1, address2)
    file_name = "./snapshot/TN%s.png" % format(i, '05d')
    print(file_name)
    print(url)
    driver.get(url)
    driver.get_screenshot_as_file(file_name)
driver.close()
