#!/bin/sh
pip install -r requirements.txt --user --upgrade
./vendor/bin/flask run --host=0.0.0.0