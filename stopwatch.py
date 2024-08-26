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

def startTimer(timechart):
	for x in timechart:
		# start new timer
		if x.inputKey is value:
			print("CurrentTotal",x.total)
			x.curtime = time.time()
			x.running = True
	return timechart

def stopTimer(timechart):
	for x in timechart:
		# find the currently running timer and record time and stop it
		if x.running is True:
			print("StopTime", x.id)
			x.total += round((time.time()-x.curtime), 2)
			print("total", x.total)
			x.running = False
			x.curtime = 0
	return timechart

def printResults(timechart):
	for x in timechart:
		minutes, seconds = divmod(x.total, 60)
		hours, minutes = divmod(minutes, 60)
		total = hours + (math.ceil((minutes/60)*2) / 2)
		print("Name: ", x.name)
		print("Total: ", x.total)
		print("%d:%02d" % (hours, minutes))
		print("Time to Enter:", total)
		print("*"*25)

def printHelp():
	print("Enter 'list' to view current clients.")
	print("Enter 'h' or 'help' to view help information.")
	print("Enter 'view' to view current time values for clients.")
	print("Enter 'q' to finish the day and summarize the times.")

def createClients(timechart, value):
	name = input("Enter Cleint Name: ")
	key = input("Enter inputKey for this cleint: ")

	timechart.append(client(len(timechart) +1,0,False,0,key,value))
	return timechart



	# timechart.append(client(2,0,False,0,"2","FLT"))
	# timechart.append(client(3,0,False,0,"3","CLGX"))
	# timechart.append(client(4,0,False,0,"4","SOSP"))
	# timechart.append(client(5,0,False,0,"5","LOTF"))

def printCleints(timechart):
	for x in timechart:
		print("Client", x.name)
		print("\tid", x.id)

def main():
	print('Hello There. \nWelcome to the Time Tracker. \nThe Goal is to better track your billing hours. \nTo see more information input h.')
	value = ""
	timechart = []
	timechart.append(client(1,0,False,0,"1","Admin"))

	while value.lower() != "q":
		value = input()
		if any(obj['inputKey'] == value.lower() for obj in timechart):
			timechart = stopTimer(timechart)
			timechart = startTimer(timechart)
		
		if value == "h" or value == 'help':
			printHelp()

		if value.lower() == 'new':
			timechart = createClients(timechart, value)
			print('New Cleint added')

		if value.lower() == 'list':
			printCleints(timechart)

		if value.lower() == 'view':
			printResults(timechart)

	stopTimer(timechart)
	printResults(timechart)

	
main()