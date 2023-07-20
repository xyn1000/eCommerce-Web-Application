# COMP5347 Web App Development Team 18

## Members
- Huaicheng Liu
- Yusi Lan
- Yuanning Xiong
- Yujia Pu

## Notice
1. Index is now created manually for users.email for both search performance and unique property. This should be repeated for separate deployments.

2. The provided dataset (userlist.json) did not follow the proper snake_naming_convention nor
  camelCase for its `firstname` and `lastname` fields. 
  This caused some confusions in development. For consistency, we decided to force rename them to camelCase (`firstName` & `lastName`). 
  You will need to do this in the DB/dataset before firing up the app.

3. Listings' `disabled` field must be set to false before using. Listing with empty `disabled` field well be defaulted as disabled.

4. The DEMO dataset did not provide valid listing picture URLs. They have to be replaced with the default ones we put under `public/static`.

For item 2, 3 and 4, you can simply run `npm run cleanup` before you start the system. I have written a script to automate them! - H.L.
