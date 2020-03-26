# Basic Node API - v1

Autor: João Luís Amaral

## Dependencies:
    
    Node:       v12.16.1,
    Npm:        v6.13.4,
    express:    v4.17.1,
    intl:       v1.2.5,
    lodash:     v4.17.15,
    morgan:     v1.10.0,
    mysql:      v2.18.1,
    nodemon:    v2.0.2 (dev dependencies)

### Installation:
*  Windows:
   *  [Instalation guide](https://phoenixnap.com/kb/install-node-js-npm-on-windows)
*  Linux:
   *  [Instalation guide](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04/)

After the installion go to the api root folder in the terminal and type "npm install". In case of using any linux distro maybe will be necessary to use sudo. 

## Configurations:

In the root of the folder there is a file called config.json. 
In that file there are fields to add the database information, by default the API is reading the information under "Development".

The default por is 4000.

## EndPoints:
* /api/v1/data
  * / 
```json
Method: POST
Information: Insert data from JSON object to the database.
URL: 127.0.0.1:4000/api/v1/data/
Request body example:
{
   "Client_id":"FF:FF:FF:FF:FF:FF",
    "Client_name":"main",
    "Time":56,
    "udp_sendTime": 56,
    "Flush":[300, 250 , 200, 150, 100, 50, 0],
    "Refill":[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300]
} 
--
Response sucess:
Status Code: 200
{
    "success": "success"
}
--
Response failure (if the micro provessor is not present in the database):
Status Code: 404
{
    "success": "failure",
    "message": "Micro processor not found"
}
```
* /api/v1/tanks
  * /
```json
Method: GET
Information: Get the information about all the tanks.
URL: 127.0.0.1:4000/api/v1/tanks
--
Status Code: 200
Response sucess:
{
    "status": "sucess",
    "results": 2,
    "data": [
        {
            "id": 8,
            "model": "xpto",
            "country": "PT",
            "sf_volume_target": null,
            "ff_volume_target": null
        },
        {
            "id": 9,
            "model": "Oli-76",
            "country": "POR",
            "sf_volume_target": 4,
            "ff_volume_target": 6
        }
    ]
}
--
Response failure:
Status Code: 404
{
    "success": "failure",
    "message": "Tank not found"
}
```
  * /tank/:model/:country
```json
Method: GET
Information: Get the information from a individual tank.
URL: 127.0.0.1:4000/api/v1/tanks/tank/Oli-76/POR/
--
Status Code: 200
Response sucess:
{
    "status": "sucess",
    "results": 1,
    "data": {
        "id": 9,
        "model": "Oli-76",
        "country": "POR",
        "sf_volume_target": 4,
        "ff_volume_target": 6
    }
}
--
Response failure:
Status Code: 404
{
    "status": "failure",
    "message": "Tank not found"
}
```
```json
Method: DELETE
Information: Deletion of a existing tank.
URL: 127.0.0.1:4000/api/v1/tanks/tank/Oli-78/POR/
--
Status Code: 202
Response sucess:
{
    "status": "sucess"
}
--
Response failure:
Status Code: 404
{
    "status": "failure",
    "message": "Data not found"
}

```
  * /newtank
```json
Method: POST
Information: Insert a new tank.
URL: 127.0.0.1:4000/api/v1/newtank
Request body example:
{
	"model": "Oli-78",
	"country": "POR",
	"sf_target": 4,
	"ff_target": 6
}
--
Status Code: 201
Response sucess: 
{
    "status": "sucess"
}
--
Response failure:
If model ou country field are missing:
Status Code: 500
{
    "status": "failure",
    "message": "Data missing"
}
-
If already exist:
Status Code: 204
```
  * /tankMap/new'
    
```json
Method: POST
Information: Insert map data from a tank.
URL: 127.0.0.1:4000/api/v1/tanks/tankMap/new
{
	"model": "xpto",
	"country": "PT",
	"data": {
		"0.5":2800,
		"1":2600,
		"1.5":2400,
		"2":2100,
		"2.5":1900,
		"3":1600,
		"3.5":1400,
		"4":1100,
		"4.5":800,
		"5":600,
		"5.5":300,
		"6":31,
		"6.5":0
	}
}
--
Status Code: 201
Response sucess:
{
    "status": "sucess"
}
--
Response failure:
Status Code: 500
{
    "status": "failure",
    "message": "Tanks not found"
}
--
Response failure:
Status Code: 404
{
    "status": "failure",
    "message": "Data missing"
}
```
  * /tankMap/:model/:country
```json
Method: GET
Information: Getting the tank mapping.
URL: 127.0.0.1:4000/api/v1/tanks/tankMap/Oli-76/POR/
--
Status Code: 200
Response sucess:
{
    "status": "sucess",
    "results": 13,
    "data": [
        {
            "id": 171,
            "volume": 6.5,
            "waterlevel": 2886,
            "ref_id_model_tank": 9
        },
        {
            "id": 172,
            "volume": 6,
            "waterlevel": 2647,
            "ref_id_model_tank": 9
        },
        ...
    ]
}

--
Response failure:
Status Code: 404
{
    "status": "failure",
    "message": "This model for this country doesnt have data"
}
```

```json
Method: DELETE
Information: Delete all the data related with a specific tank.
URL: 127.0.0.1:4000/api/v1/tanks/tankMap/xpto/PT
--
Status Code: 200
Response sucess:
{
    "status": "sucess"
}
--
Response failure:
Status Code: 404
{
    "status": "failure",
    "message": "Data not found"
}
```

