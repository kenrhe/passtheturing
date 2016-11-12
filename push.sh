#!/bin/bash
git add --all
echo "Please enter a comment:"
read COMMENT
git commit -m "$COMMENT"
git push origin dev