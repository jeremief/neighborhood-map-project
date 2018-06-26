# NEIGHBORHOOD MAP PROPJECT

SCREENSHOT
![Screenshot of a web app in desktop and mobile version](/static/images/screenshot.png?raw=true "The completed app")


## Table of Contents

* [Description](#description)
* [How to install](#how-to-install)
* [How to get started](#how-to-get-started)
* [More information](#more-information)
* [About](#about)


## Description
This project forms part of Udacity's Front End Web Developer nanodegree.

It aims to bring together most concepts covered in the nanodegree: responsiveness, use of apis, the MVC pattern, use of organisation libraries...

The app contains a list of locations and maps them on Google Maps. You should be able to filter this list and clicking on one of the items should retrieve an image asychronously and display it in the marker's info window. All this functionality should be available in a mobile browser as well.

To this end it uses the following tools: 
- Custom css
- Custom JavaScript
- Use of Fetch api
- Use of unsplash.com api
- Frameworks: Bootstrap and Knockout JS



## How to install
To obtain the files in this directory, you can either fork the repository in your own directory or download a zip file to your own machine and extract it. Either way, you should have the unzipped folder on your machine to be able to run it.

You will find the following files:
* README.md: this file
* index.html: the html page for the webapp
* Static folder

The static folder contains the following:
* additional-js directory: app.js, the JavaScript code handling the actual applicatioon
* additional-css directory: main.css, custom css for the webpage
* images directory: icon used for the project and screenshot.png: a screenshot used for github.
* bootstrap directory: the bootstrap framework leveraged by the app
* knockout directory: the knockout framework used by the application

Note that even though they come preloaded here, you could download a more recent version of [Bootstrap](https://getbootstrap.com/) and [Knockout JS](http://knockoutjs.com/downloads/index.html) if you wanted to.

Once this is done, you can open index.html in your browser.


## How to get started

Opening the app, you will see the markers load onto the map.

Clicking onto one of them will animate it and display an image that has been retrieved asynchronously from [unsplash.com](https://unsplash.com/) using the fetch api. Similarly, clicking on on one of the menu items on the left hand side will activate the related marker.

Then, you could use filter to narrow down your selection by category.

Finally, all this will be available if you open your browser in responsive mode: clicking on the newly appearing hamburger icon will toggle the left sidenav on and off.


## More information
A lot of research went into this project. Here are the resources that I used to come up with solutions to my various problems:
* How to use the Fetch api: [Udacity course](https://classroom.udacity.com/nanodegrees/nd001/parts/91561162-9864-4caf-b2aa-e6504385e4e2/modules/3cc28649-e29e-4095-8dc9-d7943de84d87/lessons/7cd5017a-cdce-463f-ba13-e53603fa83eb/concepts/89f51a91-768e-4790-b077-8ef68637874b) and [this article](https://davidwalsh.name/fetch).
* Inspiration on how to create markers: [Udacity Github project](https://github.com/udacity/ud864)
* How to animate markers: [Google documentation](https://developers.google.com/maps/documentation/javascript/examples/marker-animations)
* How to simulate clicking a marker from the side menu [Stackoverflow thread](https://stackoverflow.com/questions/2730929/how-to-trigger-the-onclick-event-of-a-marker-on-a-google-maps-v3/2731781#2731781)
* How to recenter the map on a marker when you click on it: [Stackoverflow thread](https://stackoverflow.com/questions/10917648/google-maps-api-v3-recenter-the-map-to-a-marker)
* Inspiration on how to create a mobile side nav: [Udacity course](https://classroom.udacity.com/nanodegrees/nd001/parts/d4012321-b4fa-4628-9121-2baf37385560/modules/afa5ca8b-f8dc-4160-83ff-3e5ccc2e1972/lessons/3561069759/concepts/35307193050923)
* Knockout JS framework: [documentation](http://knockoutjs.com/documentation/introduction.html)
* Bootstrap framework: [documentation](https://getbootstrap.com/docs/4.1/getting-started/introduction/)




## About
Made by Jeremie Faye using starter code provided by Udacity.


