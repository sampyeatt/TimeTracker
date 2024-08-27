import time
import math
import string

class client:
	def __init__(self,id,curtime,running,total,inputKey,name):
		self.id = id
		self.curtime = curtime
		self.running = running
		self.total = total
		self.inputKey = inputKey
		self.name = name

def startTimer(x):
	# start new timer
	print('CurrentTotal',x.total)
	x.curtime = time.time()
	x.running = True
	return x

def stopTimer(x):
	# find the currently running timer and record time and stop it
	print('StopTime', x.id)
	x.total += round((time.time()-x.curtime), 2)
	print('total', x.total)
	x.running = False
	x.curtime = 0
	return x

def endTimer(timechart):
	for x in timechart:
		# find the currently running timer and record time and stop it
		if x.running is True:
			print('StopTime', x.id)
			x.total += round((time.time()-x.curtime), 2)
			print('total', x.total)
			x.running = False
			x.curtime = 0
	return timechart

def printResults(timechart):
	for x in timechart:
		minutes, seconds = divmod(x.total, 60)
		hours, minutes = divmod(minutes, 60)
		total = hours + (math.ceil((minutes/60)*2) / 2)
		print('Name: ', x.name)
		print('Total: ', round(x.total, 2))
		print('%d:%02d' % (hours, minutes))
		print('Time to Enter:', total)
		print('*'*25)

def printHelp():
	print('Enter `list` to view current clients.')
	print('Enter `h` or `help` to view help information.')
	print('Enter `view` to view current time values for clients.')
	print('Enter `q` to finish the day and summarize the times.')

def createClients(timechart, value, keys):
	name = input('Enter Cleint Name: ')
	key = input('Enter inputKey for this cleint: ')

	if key in keys:
		print('#'*20)
		print('Client with that key already exists. Please eneter a new key. \nType `list` to view all current clients.')
	else:
		timechart.append(client(len(timechart) +1,0,False,0,key,name))
		print('New Cleint added')
	return timechart

def removeClient(timechart, value, keys):
	key = input('Enter Client Key of client you would like to remove: ')
	for x in timechart:
		if x.inputKey == key:
			timechart.remove(x)
	return timechart

def printCleints(timechart):
	for x in timechart:
		print('Client', x.name)
		print('\tid', x.id)
		print('\tkey', x.inputKey)

def getKeysList(timechart):
	keyList = []
	for x in timechart:
		keyList.append(x.inputKey)
	return keyList

def main():
	print('Hello There. \nWelcome to the Time Tracker. \nThe Goal is to better track your billing hours. \nTo see more information input h.')
	value = ''
	timechart = []
	timechart.append(client(1,0,False,0,'1','Admin'))
	keys = []

	while value.lower() != 'q':
		value = input()
		keys = getKeysList(timechart)
		print('keys', keys)

		for x in timechart:
			if x.running is True and x.inputKey in keys:
				x = stopTimer(x)
			if x.inputKey is value:
				x = startTimer(x)

		if value == 'h' or value == 'help':
			printHelp()

		if value.lower() == 'new':
			timechart = createClients(timechart, value, keys)

		if value.lower() == 'del':
			timechart = removeClient(timechart, value, keys)

		if value.lower() == 'list':
			printCleints(timechart)

		if value.lower() == 'view':
			printResults(timechart)

	timechart = endTimer(timechart)
	printResults(timechart)

main()
