# economie-circulaire

The website [economiecirculaire.etalab.studio](https://economiecirculaire.etalab.studio/) has been developed as a tool to allow users to easily access open data related to circular economy.

The website provides an inventory section, `inventaire`, that uses the Airtable API to show data from an Airtable base.

There also is a form, `demande`, that is linked to another Airtable base.

This repo is based on https://github.com/abulte/dokku-simple-python-vue-spa.

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
