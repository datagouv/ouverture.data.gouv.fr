# ouverture.data.gouv.fr

The website [ouverture.data.gouv.fr](https://ouverture.data.gouv.fr/) has been developed as a tool to allow users to easily track the opening of data, source codes and public APIs.

The website provides an inventory sthat uses the Airtable API to show data from an Airtable base.

This repo is based on https://github.com/abulte/dokku-simple-python-vue-spa and https://github.com/etalab/economiecirculaire/.

## Development env

### Website

```
cd front
yarn dev
```

### API

```
cd backend
FLASK_DEBUG=1 FLASK_APP=app AIRTABLE_API_KEY=[YOUR KEY] flask run
```


## Deploy

Continuous deployement ✌️

```
git push
```

Manual deployement

```
git push dokku master
```

## Licence
Distributed under the MIT License. See LICENSE for more information.
