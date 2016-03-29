# superheroes
Marvel's Superheroes demo on Caché DocDM

AngularJS demo using REST to Caché Document Data Model.
Copy these files to your local machine.
- Use the static files as-is :
-- you will have to configure your webserver to accept CORS
-- for IIS, create a file web.config in you inetpub/wwwroot folder with following content:
<?xml version="1.0" encoding="utf-8"?>
<configuration>
 <system.webServer>
   <httpProtocol>
     <customHeaders>
       <add name="Access-Control-Allow-Origin" value="*" />
     </customHeaders>
   </httpProtocol>
 </system.webServer>
</configuration>
-- use URL http://localhost/.../superheroes

- or Use the Caché built-in web server :
-- copy the files to a c:\intersystems\cache\CSP\USER\ directory (or any other namespace)
-- use URL http://localhost:cache-ip-port/csp/user/index.html

Inital data is loaded from Marvel's Superheroes, a REST API is available from the http://developer.marvel.com website.
- You need to create a developer account
- get a private and public key, and paste it in the code (Import Tab)
- set the Offset(Page) : 1 gives the first page of superhero characters
- set the Limit : 100 will import the first 100 superhero characters
- click on the import button : this will use REST to GET the data from Marvel, and PUT the data into Caché DocDM

Use the Characters Tab to view, edit or delete Superhero characters on your local DocDM.
