while true
do
  node xicidaili.js | python ../parser/xicidaili_parser.py &
  node spys.js| python ../parser/spys_parser.py &
  sleep 3
  node blogspot.js | python ../parser/blogspot_parser.py &
  node proxynova.js | python ../parser/proxynova_parser.py &
  sleep 3 
	node proxylists.js | python ../parser/proxylists.py &
  sleep 180
done
