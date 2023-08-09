# Participants:
- Chongmin Bai
- Gary Xie
- Ivan Shao
- Mengqi Zhao
- Jesse Zhang
- Tyler Reichert
- SuTong Kong

# Release Goal
- The release goal is to finish up the remaining user stories needed to round up the project and fix all errors/bugs. Main topics include adding delete options, adding features, improving the display, and making the app mobile-compatible as PWA. 

# User stories
## Frontend
- Create Media Page Issue (Meng) (20) NODE-159
- Edit Account Page issue (Meng) (20) NODE-157
- Checkout Cart and Payment frontend (Ivan) (20) NODE-164
- Add a checkbox in the Edit User Account page to indicate if user is a service provider (Frank) (5) NODE-177
- Make Service page display images properly (Frank) (5) NODE-187
- Make Product page display images properly (Frank) (5) NODE-188
- Add tabs in User Account page for deleting services, deleting socials, and edit account (Jonathan) (20) NODE-165
- Connect API: for post number of likes (Jonathan) (5) NODE-173
- Make app phone-compatible as a PWA (Gary) (20) NODE-182

## Backend
- Add backend field to Users table to indicate if user is a provider (Gary) (5) NODE-175
- Insert images into DB in the migrate script (Jesse) (20) NODE-176
- Add backend for finding services for a particular user (the logged in user) (Jesse) (3) NODE-166
- Add backend for finding media pages for a particular user (the logged in user) (Jesse) (3) NODE-167
- Add delete for media given the mediaId (Tyler) (5) NODE-190
- Edit media to add likes (Tyler) (5) NODE-189

## Bugs
- Fix bug where going to cart page after inserting product/service into cart will crash the page (Gary) (1) NODE-174
- Display ”no items can be found” when no items can be found (Frank) (5) NODE-178
- Create Service image processing and post request (Ivan) (8) NODE-163
- 404 Redirect Page (Ivan) (5) NODE-118
- Ensure all price ranges are positive (Ivan) (3) NODE-168
- Update logout interface and CreateService page redirection (Ivan) (5) NODE-185
- Fixed Signup page email field bug and optimized the whole Signup page (Meng) (3) NODE-200
- CreateService page optimized by upload image button omitted and added a cancel button (Meng) (5) NODE-201
- MediaPage now displays images intances, not urls (Meng) (5) NODE-196
- Fixed MediaPage image bug (Meng) (1) NODE-203

# Spike
- Before sprint 4, we were using urls for the mock images but we soon realized that this was not viable if a user wanted to upload actual images. Because normally users are expected to upload picture instances rather than picture urls. As a result, we started looking into images with form-data and spent quite a while taking care of image handling.

