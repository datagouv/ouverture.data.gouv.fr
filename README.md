# ouverture.data.gouv.fr

The website [ouverture.data.gouv.fr](https://ouverture.data.gouv.fr/) has been developed as a tool to allow users to easily track the opening of data, source codes and public APIs.

The website provides an inventory that uses the Airtable API to show data from an Airtable base.

This repo is based on [abulte/dokku-simple-python-vue-spa](https://github.com/abulte/dokku-simple-python-vue-spa) and [etalab/economiecirculaire](https://github.com/etalab/economiecirculaire/).

## Tracking the opening of data, APIs and source code

During the fifth interministerial committee on public transformation held in Mont-de-Marsan on 5 February, the French Prime Minister committed the Government to an ambitious open data policy, with the aim of better exploiting, opening up, sharing and exploiting public data.

In [a circular dated 27 April 2021](https://www.legifrance.gouv.fr/circulaire/id/45162?dateSignature=&init=true&page=1&query=*&searchField=ALL&tab_selection=circ), which is based on [the recommendations of the report by MP Éric Bothorel](https://www.mission-open-data.fr/uploads/decidim/attachment/file/36/Mission_Bothorel_Rapport.pdf), which was submitted to him on 23 December last year, the Prime Minister asked the Government to make data policy one of its priorities in its relations with all its partners, in particular local authorities, private actors and civil society. He charged the Minister for the Transformation and the Civil Service with monitoring the implementation of this data policy.

The table available on [ouverture.data.gouv.fr](https://ouverture.data.gouv.fr/) tracks and reports on the opening of 63 new datasets, source codes and public APIs, for all ministries, included in their roadmaps, in application of commitment no. 6 of the interministerial committee on public transformation of 5 February 2021.

The data that feeds the table on [ouverture.data.gouv.fr](https://ouverture.data.gouv.fr/) is available in an open format on [data.gouv.fr](https://www.data.gouv.fr/fr/datasets/tableau-de-suivi-des-ouvertures-de-donnees-codes-sources-et-api-publics/).

## Development env

### Website

```
cd front
npm i
npm run docs:dev
```

### API

ouverture.data.gouv.fr uses pip to install its dependencies. You can create a
[virtualenv](https://realpython.com/blog/python/python-virtual-environments-a-primer/),
activate it and install the requirements with the following commands.

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Then, you can run the project :

`NOTION_BASE` is the id in the base URL before the `?`: https://www.notion.so/conciergerie/[YOUR BASE]?v=ac8f34f3b3874ee2aae5a77219ac3f2f&pvs=4.

```
cd backend
FLASK_DEBUG=1 FLASK_APP=app NOTION_BASE=[YOUR BASE] NOTION_API_KEY=[YOUR KEY] flask run
```

## Build

Vitepress has a build mode that generate files in `frontend/dist` to be deployed.

```
cd frontend
npm run docs:build
```

This is the step where you can add your env variable.

```
VUE_APP_API_URL="https://..." npm run docs:build
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
