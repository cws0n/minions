# minions etc.

minion etc proxy is a self made proxy, it is still
being made, (at school) trying my best to have
good dockerfiles, server setup etc. the point 
of minion is to go agaisnt school/work inter-
net censorship and im still in beta on another
repo (private) but public soon

How to setup
paste into terminal 

build the image
docker build -t minion-proxy .

run the container
docker run -p 3000:3000 -d minion-proxy
