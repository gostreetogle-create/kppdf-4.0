# Neto Alvaro Camillo - Angular Design Patterns and Best Practices - 2024

> **Источник:** Neto Alvaro Camillo - Angular Design Patterns and Best Practices - 2024
> **Дата извлечения:** 2026-06-03
> **Концепции:** signals, standalone, control-flow, di, routing, http, rxjs, pipes, components, templates, testing, i18n, animations, performance, modules
> **Размер текста:** 385893 символов

---

## Create scalable and adaptable applications that grow to meet

evolving user needs
Alvaro Camillo Neto
-- 2 of 270 --
Angular Design Patterns and Best Practices
Copyright © 2024 Packt Publishing
All rights reserved. No part of this book may be reproduced, stored in a retrieval system, or transmitted
in any form or by any means, without the prior written permission of the publisher, except in the case
of brief quotations embedded in critical articles or reviews.
Every effort has been made in the preparation of this book to ensure the accuracy of the information
presented. However, the information contained in this book is sold without warranty, either express
or implied. Neither the author, nor Packt Publishing or its dealers and distributors, will be held liable
for any damages caused or alleged to have been caused directly or indirectly by this book.
Packt Publishing has endeavored to provide trademark information about all of the companies and
products mentioned in this book by the appropriate use of capitals. However, Packt Publishing cannot
guarantee the accuracy of this information.
Group Product Manager: Rohit Rajkumar
Publishing Product Manager: Kushal Dave
Book Project Manager: Shagun Saini
Senior Editor: Rakhi Patel
Technical Editor: K Bimala Singha
Copy Editor: Safis Editing
Proofreader: Safis Editing
Indexer: Tejal Daruwale Soni
Production Designer: Ponraj Dhandapani
DevRel Marketing Coordinators: Namita Velgekar and Nivedita Pandey
First published: February 2024
Production reference: 2120124
Published by Packt Publishing Ltd.
Grosvenor House
11 St Paul’s Square

---

## Birmingham

B3 1RB, UK
ISBN 978-1-83763-197-1
www.packtpub.com
-- 3 of 270 --
To my wife, Luciana Gonçalo Balardini Camillo, for being my wonderful beloved partner who did the
most important work of taking care of our beloved children, Mario and Gabriel, while I worked on the
book. I love you so much my Linda.
– Alvaro Camillo Neto
-- 4 of 270 --

---

## Foreword

In the ever-evolving landscape of the web, Angular continues to emerge as a beacon of innovation and
efficiency, in a continual era of renaissance, and I am thrilled to introduce you to a comprehensive
guide authored by a true enthusiast and expert, Alvaro.
This book is a testament to Alvaro’s tireless efforts to share his knowledge in the most exciting and
up-to-date manner possible. Whether you are a seasoned developer seeking to sharpen your skills or a
newcomer eager to dive into the world of Angular, this guide promises to be your trusted companion.
So, embark on this adventure with this book as your guide. May the knowledge within these pages
inspire you and empower your journey into the universe of web development, with batteries included for
this awesome JavaScript framework, which will always have a module and patterns for what you need.
Happy coding!
William Grasel (https://www.linkedin.com/in/willgm/?originalSubdomain=br)
Principal Software Engineer, Stone Inc
-- 5 of 270 --
With great excitement and admiration, I write this foreword for my dear friend Alvaro’s book, Angular
Design Patterns and Best Practices. For anyone familiar with the Angular framework and seeking to
elevate their skills and projects, this book is an invaluable resource.
Alvaro, a Google Developer Expert in Angular and a friend, has poured his wealth of knowledge
and practical experience into this comprehensive guide. In Part 1, Reinforcing the Foundations, he
skilfully navigates essential topics, starting by reinforcing the foundations of Angular development by
delving into project setup, application organization, TypeScript patterns, and service implementation,
including the Singleton pattern.
Then, Part 2, Leveraging Angular’s Capabilities equips you with advanced techniques to handle user
input through forms, enhance backend integration through the Interceptor pattern, and master
reactivity with RxJS. This section empowers developers to create dynamic and interactive experiences
for their users.
In the final stretch, that is, Part 3, Architecture and Deployment, Alvaro delves into designing
applications for testability, exploring the possibilities of micro-frontends with Angular elements,
and sharing best practices for deployment. This part lays the groundwork for robust, scalable, and
maintainable applications.
Finally, the Angular Renaissance chapter paints a vibrant picture of the future of modern Angular
applications, highlighting the latest advancements and trends shaping the framework. This glimpse
into the future inspires and motivates developers to stay ahead of the curve and continually improve
their craft.
Alvaro’s writing style is clear, concise, and engaging. He seamlessly blends theoretical concepts with
practical examples, making even the most complex topics easily understandable. Additionally, his
passion for Angular shines through every page, further igniting your desire to delve deeper into the
framework’s capabilities.
So, buckle up, fellow An

---

## About the author

Alvaro Camillo Neto is a software engineer, speaker, and instructor in Brazil. He has worked in the
technology industry for over 10 years and is dedicated to the development of business solutions at a large
company. Alvaro is a technology enthusiast, and he sees knowledge sharing as an opportunity to help
the community that helped him so much and the best way of learning. He believes in technology as a
tool to empower people. He has performed at small meetups and large events, focusing on the themes
of developing web solutions. He also shares knowledge on his blog (https://alvarocamillont.
dev/) and participates in the organization of AngularSP.
-- 7 of 270 --

---

## About the reviewer

Anu Nagan G has worked at various corporate organizations, starting at a SaaS startup (GenDeep)
and moving on to midsize (GAVS) and Fortune 500 companies (DXC). There, he had various roles,
such as technical product manager, full stack product lead (in Angular, Java, Python, and AWS), and
delivery lead, respectively, in his 10.3 years of tenure. Currently, he is with Bounteous as a technical
manager, leading global delivery projects such as migrating legacy WordPress apps to Adobe AEM.
Prior to that, he led parallel projects, such as the advanced AI and analytics product CortexAI, clinical
mobile app development, and Salesforce automation into B2B business. He previously contributed
to various AIOps products, such as ZIF and Gcare. He is an avid reader and cinephile, loves to play
guitar, and makes short films with his friends.
I would like to thank my wife and daughter, A Chekhov H, who celebrated her first birthday on 21
December, 2023.
-- 8 of 270 --
-- 9 of 270 --

---

## Preface 	xv

Part 1: Reinforcing the Foundations
1
Starting Projects the Right Way 	3
Technical requirements 	3
Why choose Angular? 	4
Batteries included 	4
Google support 	4
Community 	4
Tooling 	5

---

## Standardizing the extensions and settings in

the project 	10
Angular DevTools 	11
Starting an Angular project 	12
Project structure 	15
Using the Angular CLI for your
productivity 	16
ng add 	16
ng update 	17
ng serve 	17
ng build 	18
ng deploy 	18
ng generate 	18
Summary 	19
Table of Contents
-- 10 of 270 --
Table of Contents	viii
2
Organizing Your Application 	21
Technical requirements 	21

---

## Organizing the application with

Angular modules 	22
declarations 	22
providers 	23
imports 	23
exports 	23
The first module – AppModule 	24
What is the difference between Angular and
JavaScript modules? 	24
Modules type 	25
Avoiding anti-pattern – single
module app 	29

---

## Optimizing the usage of common

modules – the SharedModule pattern 	30
Improving the size of your app – lazy
loading 	32
Summary 	36
3
TypeScript Patterns for Angular 	37
Technical requirements 	37
Creating classes and types 	38
Primitive and basic types 	38
Classes 	40
Interfaces 	43
Type aliases 	45
When to use classes, interfaces, or types 	46
Creating methods and functions 	47
Working with null values 	48
Decreasing verbosity – type inference 	49
Validating types – type guards 	50
Using a better alternative to the any type 	52
Summary 	54
4
Components and Pages 	55
Technical requirements 	55
Creating components 	56

---

## Propagating events from nested

components 	70
Summary 	74
-- 11 of 270 --
Table of Contents 	ix
5
Angular Services and the Singleton Pattern 	75
Technical requirements 	75
Creating services 	76

---

## Communication between

components using services 	80
REST API consumption 	83
Summary 	87
Part 2: Leveraging Angular’s Capabilities
6
Handling User Inputs: Forms 	91
Technical requirements 	91
Template-driven forms 	92
Reactive forms 	97
Data validation 	101
Custom validations 	104
Typed reactive forms 	107
Summary 	108
7
Routes and Routers 	109
Technical requirements 	109
Routes and navigation 	110
Defining an error page and title 	113
Dynamic routes – wildcards and
parameters 	116
Securing routes – guards 	122
Optimizing the experience – Resolve 	129
Summary 	131
8
Improving Backend Integrations: the Interceptor Pattern 	133
Technical requirements 	134 	Attaching the token to the request
with an interceptor 	134
-- 12 of 270 --
Table of Contents	x
Changing the request route 	139
Creating a loader 	141
Notifying success 	144

---

## Measuring the performance of a

request 	146
Summary 	148
9
Exploring Reactivity with RxJS 	149
Technical requirements 	149
Observables and operators 	150
Handling data – transformation
operators 	151
Another way to subscribe –
the async pipe 	153

---

## Optimizing data consumption

– filter operators 	157
How to choose the correct operator 	159
Summary 	161
Part 3: Architecture and Deployment
10
Design for Tests: Best Practices 	165
Technical requirements 	165
What to test 	166
Service tests 	169

---

## Fixing the tests and understanding

TestBed 	173
Component testing 	177
E2E tests with Cypress 	179
Summary 	184
11
Micro Frontend with Angular Elements 	185
Technical requirements 	185
Micro frontend – concepts and
application 	186
When to use a micro frontend 	186
When not to use a micro frontend project 	186

---

## Preparing a page to be loaded by the

base application 	193
Dynamically loading micro frontends 196
Summary 	200
12
Packaging Everything – Best Practices for Deployment 	201
Technical requirements 	201
Deploying the backend 	202
Differentiating environments 	207
Preparing the production bundle 	210
Mounting a Docker image with Nginx 	213
Deploying a page to Azure Static
Web Apps 	215
Summary 	219
13
The Angular Renaissance 	221
Technical requirements 	221

---

## Simplifying application states

– Angular Signals 	232
Summary 	237
Index 	239
Other Books You May Enjoy 	246
-- 14 of 270 --
-- 15 of 270 --

---

## Preface

The Angular framework has been helping development teams since 2009, with a robust structure and
practically everything a web application needs. Angular, with its “batteries included” philosophy, has
mechanisms for state management, route administration, and the injection of dependencies among
other tools for you to create the most incredible experiences for your users.
This book aims to help you navigate this incredible list of features and learn how to orchestrate it for
you and your team to get the most out of Angular and its entire ecosystem.
We will discover what types of patterns exist in the framework and what lessons we can learn from
these patterns to apply to our applications.
We will also explore Angular development and architecture best practices based on its documentation,
and community advice around the Angular ecosystem.
Angular is widely used by companies of different sizes and sectors. The company that sponsors this
open source framework, Google, has thousands of internal applications that use Angular, guaranteeing
great stability, which is one of the biggest reasons for using it.
There is a huge demand for developers who have mastered Angular and architects who can organize
and get the best out of Angular, and the framework is currently in its best form, dubbed by the
community as the Angular Renaissance.

---

## Who this book is for

This book is for frontend developers and architects with experience in Angular or any other web
framework who want to delve into the best that Angular can offer.
The main personas that this book is aimed toward are the following:
• 	Developers who already work with Angular and want to be more productive in delivering
their tasks
• 	Technical leaders who want to bring best practices to their teams to increase the quality and
productivity of their deliveries
• 	Software architects who want to explore the possibilities that Angular can offer applications
and thus design resilient and secure systems
-- 16 of 270 --

---

## To get the most out of this book

You will need to have a basic understanding of HTML, CSS, and JavaScript and how a web
application works.
Software/hardware covered in the book 	Operating system requirements
Angular 16 and 17 	Windows, macOS, or Linux
TypeScript 5.2
RxJS 7

---

## Conventions used

There are a number of text conventions used throughout this book.
Code in text: Indicates code words in text, database table names, folder names, filenames, file
extensions, pathnames, dummy URLs, user input, and Twitter handles. Here is an example: “In this
test case, we don't need to worry about the login because the beforeEach function performs this
function and we work directly on the form.”
A block of code is set as follows:
describe('My First Test', () => {
it('Visits the initial project page', () => {
cy.visit('/')
cy.contains('app is running!')
})
})
-- 18 of 270 --

---

## Preface	xvi

When we wish to draw your attention to a particular part of a code block, the relevant lines or items
are set in bold:
<button
type="submit"
class="w-full rounded bg-blue-500 px-4 py-2 text-white"
[disabled]="loginForm.invalid"
[class.opacity-50]="loginForm.invalid"
data-cy="submit"
>

---

## Login

</button>
Any command-line input or output is written as follows:
ng test
Bold: Indicates a new term, an important word, or words that you see onscreen. For instance, words
in menus or dialog boxes appear in bold. Here is an example: “Select the desired browser and click
on Start E2E Testing and we will have the test execution interface.”

---

## Get in touch

Feedback from our readers is always welcome.
General feedback: If you have questions about any aspect of this book, email us at customercare@
packtpub.com and mention the book title in the subject of your message.
Errata: Although we have taken every care to ensure the accuracy of our content, mistakes do happen.
If you have found a mistake in this book, we would be grateful if you would report this to us. Please
visit www.packtpub.com/support/errata and fill in the form.
Piracy: If you come across any illegal copies of our works in any form on the internet, we would
be grateful if you would provide us with the location address or website name. Please contact us at
copyright@packt.com with a link to the material.
If you are interested in becoming an author: If there is a topic that you have expertise in and you are
interested in either writing or contributing to a book, please visit authors.packtpub.com.
-- 19 of 270 --
xvii
Share Your Thoughts
Once you’ve read From PHP to Ruby on Rails, we’d love to hear your thoughts! Please click here to go
straight to the Amazon review page for this book and share your feedback.
Your review is important to us and the tech community and will help us make sure we’re delivering
excellent quality content.
-- 20 of 270 --
xviii
Download a free PDF copy of this book
Thanks for purchasing this book!
Do you like to read on the go but are unable to carry your print books everywhere?
Is your eBook purchase not compatible with the device of your choice?
Don’t worry, now with every Packt book you get a DRM-free PDF version of that book at no cost.
Read anywhere, any place, on any device. Search, copy, and paste code from your favorite technical
books directly into your application.
The perks don’t stop there, you can get exclusive access to discounts, newsletters, and great free content
in your inbox daily
Follow these simple steps to get the benefits:

---

## 3. 	That’s it! We’ll send your free PDF and other benefits to your email directly

-- 21 of 270 --
Part 1:
Reinforcing the Foundations
In this part you will delve deeper into the fundamentals of the Angular framework and its basic
concepts such as why to use Angular, how to organize your project and set up a productive development
environment. In addition, you will learn about best practices in the tasks of component creation and
communication with the backend.
This part has the following chapters:
• Chapter 1, Starting Projects the Tight Way
• Chapter 2, Organizing Your Application
• Chapter 3, TypeScript Patterns for Angular
• Chapter 4, Components and Pages
• Chapter 5, Angular Services and the Singleton Pattern
-- 22 of 270 --
-- 23 of 270 --
1
Starting Projects the Right Way
Angular is a framework that has the motto “batteries included” as a development philosophy. This
means that practically all the resources you need for your frontend application needs are already
available as soon as you create a new project.
In this chapter, you will understand why choose Angular for your web application, what its main
characteristics and design are, and why companies, especially the biggest ones, choose Angular as the
main framework for developing single-page applications.
You will explore the technologies that make up the framework and thus take greater advantage of
possible alternatives if you need them for a specific case. You’ll also set up your workspace with the
best tools to help you and your team’s productivity.
In this chapter, we’re going to cover the following topics:
• 	Why choose Angular?
• 	What technologies are present in the ecosystem?
• 	Configuring your development environment
• 	Starting an Angular project
• 	Using the Angular Command-Line Interface (CLI) for your productivity
By the end of this chapter, you will have arguments for using Angular in your project and be more
productive in your development workspace.

---

## Technical requirements

To follow the instructions in this chapter, you’ll need the following:
• 	Visual Studio Code (VS Code) (https://code.visualstudio.com/Download)
• 	Node.js 18 or higher (https://nodejs.org/en/download/)
-- 24 of 270 --
Starting Projects the Right Way	4
The code files for this chapter are available at https://github.com/PacktPublishing/
Angular-Design-Patterns-and-Best-Practices/tree/main/ch1.
Why choose Angular?
The choice of technology to be used in a given project is critical to its success. You, as a project developer
or architect, must help your team in this mission by choosing the best tool for the job.
The Angular framework is one of the most used tools for building a single-page application, along
with React and Vue. When choosing the right tool for the job, you need to answer why.
The following are some arguments for choosing Angular.

---

## Batteries included

Angular is an opinionated framework, which means that the Angular development team has already
made several choices of tools and solutions for every challenge that a web application can have. This
way, you and your team don’t have to research which route engine or state management library you
should use; it’s all included and configured for your project.
This feature also simplifies the onboarding of new developers in your team. Following the guidelines
proposed by the documentation and using the best practices, Angular projects usually have the same
structure and method of development. Knowing Angular you can quickly locate yourself in any
ongoing project.

---

## Google support

Angular was created and maintained by the Angular team at Google. Although excellent frameworks
such as Vue.js and Svelte are maintained only by their communities, having such a big tech company
supporting the framework brings security to the choice of technology, especially for large companies.
In addition, Angular is used in more than 300 internal applications and Google products, which means
stability and quality because, before each new version of the framework is released, it is validated in
all these applications.
The Angular team has strived since version 13 to increase transparency within the community by
releasing a roadmap (https://angular.io/guide/roadmap) detailing all the improvements
in progress and what to expect for the future of the framework, giving you peace of mind that it will
be supported for years to come.

---

## Community

Technology is only as alive as the community that supports it, and Angular has a huge one. Meetups,
podcasts, events, articles, and videos – the Angular community has many resources to help developers.
-- 25 of 270 --
What technologies are present in the ecosystem? 	5
The people who make up this community also have the important contribution of giving feedback,
creating and correcting issues in Angular. As it is an open source project, everyone is invited to evaluate
and contribute to the code.
The Angular team also asks the community for help with major framework decisions through Requests
for Comment (RFCs).
In addition, the community creates many libraries that expand the possibilities of the framework,
such as NgRx (https://ngrx.io/) for advanced state management and Transloco (https://
ngneat.github.io/transloco/) to support internationalization, among others.

---

## Tooling

One of the differentiating factors of Angular compared to its competitors is the focus from the beginning
on tooling and developer experience. The Angular CLI tool is a powerful productivity tool that we will
explore in this chapter, which is used far beyond the simple creation and setup of a project.
From a testing point of view, Angular is already equipped and configured with Karma as a test runner
and Jasmine as a configuration tool. Angular’s tooling already configures the project build using
webpack and already has a dev server.
The tool is also extensible, allowing the community to create routines for configuring and updating
their libraries.
With these arguments, you will be able to base your choice of Angular on your project; let’s see now
which technologies make up the framework’s ecosystem.
What technologies are present in the ecosystem?
The Angular team, when creating the solution for the growing complexity of web application development,
decided to unite the best tools and libraries in an opinionated package with the maximum number
of configurations made by default.
We then have the following libraries that make up the core of Angular.
TypeScript
TypeScript is a superset of the JavaScript language that adds type checking and other features to the
language, ensuring a better developer experience and security for web development.
It has been present in Angular since its first version and is the cornerstone of the framework that
enables several features such as dependency injection, typed forms and Angular’s tooling.
TypeScript is currently the preferred tool for backend development in Node.js and is encouraged by
communities of other frameworks such as React and Vue.js.
-- 26 of 270 --
Starting Projects the Right Way	6
RXJS
RXJS is a library that implements the reactive paradigm (https://www.reactivemanifesto.
org/) in the JavaScript language.
Since the first version of Angular, reactivity was a core theme that the framework wanted to achieve
and so it uses the RXJS library to help with it.
HTTP requests, routes, forms, and other Angular elements use the concepts of observables and their
operators to provide Angular developers with the tools to create more fluid and dynamic applications
with less boilerplate code.
RXJS also provides mechanisms for state management in a frontend application without the need to
use more complex patterns such as Redux.
Karma and Jasmine
Quality should be the top priority in any application and this is especially important in frontend
applications as for the user, it is the application.
One of the ways to attest to quality is through testing, and with that in mind, Angular already comes
by default with the tool duo of Jasmine and Karma.
Jasmine is a framework for unit-testing JavaScript and TypeScript applications with several functions
for assertion and test assembly.
Karma is the test runner, that is, the environment where the unit test setup is executed with the help
of Jasmine. This environment, configu

---

## Webpack

After the development of an application, it is necessary to create the bundle to send it to production,
and Webpack is the tool that the Angular team chose for this task.
Webpack is a very powerful and versatile bundler, and it is thanks to it that the framework manages
to make some interesting optimizations such as tree shaking and lazy loading of bundles.
However, Webpack is complex in its configuration, and with that in mind, the Angular team has
already set up and created some abstractions for fine-tuning the tool, such as the angular.json file.
-- 27 of 270 --
Configuring your development environment 	7
We understand what pieces make up the framework and how they relate to delivering rich and fluid
interfaces. We will now set up our development environment.

---

## Configuring your development environment

A well-organized environment with the right tools is the first step toward excellence and productivity;
now, let’s set this environment up in your workspace.
After installing Node.js following the instructions in the Technical requirements section, the following
tools and their plugins will help you in your workflow.
VS Code
VS Code (https://code.visualstudio.com/) is currently the default tool for most developers,
especially for frontend projects.
There are other very good ones such as WebStorm (https://www.jetbrains.com/webstorm),
but VS Code, with its plugins especially for Angular projects, facilitates great productivity and ergonomics.
To install the plugins listed here, in the code editor, click on Extensions or use the shortcut Ctrl +
Shift + X (Windows) or Cmd + Shift + X (macOS).
The following are the VS Code plugins recommended for developing Angular applications.
Git Extension Pack
Git Extension Pack (h t t p s : / / m a r k e t p l a c e . v i s u a l s t u d i o . c o m /
items?itemName=donjayamanne.git-extension-pack) is not specifically for developing
Angular applications but it is useful for any kind of work.
Git is the default tool for version control and VS Code has native support for it. This set of plugins
improves this support even further, adding the ability to read comments and changes made in previous
commits in the editor, support for multiple projects, and a better view of your repository history and logs.
Angular Language Service
The Angular Language Service (https://marketplace.visualstudio.com/
items?itemName=Angular.ng-template) extension is maintained by the Angular team
and adds support for most of the framework’s functionality right from the code editor.
By adding this extension to your editor, it will have the following features:
• 	Autocomplete in the HTML template file, allowing you to use component methods without
having to consult the TypeScript file
• 	Checking for possible compilation errors in HTML template files and TypeScript files
-- 28 of 270 --
Starting Projects the Right Way	8
• 	Quick navigation between HTML and TypeScript templates, allowing you to consult the
definition of methods and objects
This extension is also available for other IDEs such as WebStorm and Eclipse.

---

## Prettier

Prettier (https://marketplace.visualstudio.com/items?itemName=esbenp.
prettier-vscode) is a JavaScript tool that solves the code formatting problem. It is opinionated
on formatting settings although some customization is possible.
In addition to TypeScript, Prettier formats HTML, CSS, JSON, and JavaScript files, making this
extension useful also for backend development using Node.js.
To standardize formatting across your entire team, you can install Prettier as a package for your project
and run it on the project’s CI/CD track, which we’ll see in Chapter 12, Packaging Everything – Best
Practices for Deployment.
ESLint
When creating an application, the use of a linter is highly recommended to ensure good language
practices and avoid errors from the beginning of development.
In the past, the default tool for linting TypeScript projects was TSLint, but the project has been absorbed
by ESLint (https://marketplace.visualstudio.com/items?itemName=dbaeumer.
vscode-eslint), which allows you to verify JavaScript and TypeScript projects.
With this extension, verification occurs quickly while you type the code of your project. ESLint can be
installed as a package in your Angular project and thus performs this validation on the CI/CD conveyor
of your project, which we will see in Chapter 12, Packaging Everything – Best Practices for Deployment.
EditorConfig
The EditorConfig (https://marketplace.visualstudio.com/
items?itemName=EditorConfig.EditorConfig) plugin has the function of creating a
default configuration file for not only VS Code but also any IDE that supports this format.
This plugin is useful for standardizing things for your project and your team – for example, the number
of spaces that each Tab key represents, or whether your project will use single quotes or double quotes
to represent strings.
To use it, just create or have a file named .editorconfig at the root of your project and VS Code
will respect the settings described in the file.
-- 29 of 270 --
Configuring your development environment 	9
VS Code settings
VS Code, in addition to extensions, has several native settings that can help in your day-to-day work.
By accessing the File menu, we can activate the automatic saving flag so you don’t have to worry
about pressing Ctrl + S all the time (although this habit is already engraved in stone in our brains...).
Another interesting setting is Zen mode, where all windows and menus are hidden so you can just
focus on your code. To activate it, go to View | Appearance | Zen Mode, or use the keyboard shortcut
Ctrl + K + Z for Windows/Linux systems and Cmd + K + Z for macOS.
To improve the readability of your code during editing, an interesting setting is Bracket coloring,
which will give each parenthesis and bracket in your code a different color.
To enable this setting, open the configuration file using the shortcut Ctrl + Shift + P for Windows/
Linux or Cmd + Shift + P for macOS and type Open User Settings (JSON).
In the file, add the following e

---

## Standardizing the extensions and settings in the project

In the Why choose Angular? section, we learned that one of the advantages of choosing this framework
for your project is the standardization it provides to development and the team.
You can also standardize your VS Code settings and record them in your Git repository so that not
only you but also our team can have that leap in productivity.
To do this, in your repository, create a folder called .vscode, and inside that folder, create two
files. The extensions.json file will have all the extensions recommended by the project. In this
example, we will use the extensions we saw earlier:
{
"recommendations": [
"dbaeumer.vscode-eslint",
"esbenp.prettier-vscode",
"Angular.ng-template",
"donjayamanne.git-extension-pack",
"editorconfig.editorconfig"
]
}
-- 31 of 270 --
Configuring your development environment 	11
Let’s also create the settings.json file, which allows you to add VS Code settings to your workspace.
These settings take precedence over user settings and VS Code’s default settings.
This file will have the previously suggested settings:
{
"editor.bracketPairColorization.enabled": true,
"editor.guides.bracketPairs": true
"editor.fontFamily": "Fira Code",
"editor.fontLigatures": true,
"typescript.inlayHints.parameterNames.enabled": "all",
"typescript.inlayHints.functionLikeReturnTypes.enabled": true,
"typescript.inlayHints.parameterTypes.enabled": true,
"typescript.inlayHints.propertyDeclarationTypes.enabled": true,
"typescript.inlayHints.variableTypes.enabled": true,
"editor.inlayHints.enabled": "on"
}
By synchronizing these files in your repository, when your team members download the project and
open VS Code for the first time, the following message will appear:
Figure 1.2 – VS Code prompt for recommended extensions
Once confirmed, all the extensions configured in the file will be installed in the VS Code development
environment of your team members, thus automating the task of standardizing the team’s
work environment.
Angular DevTools
One tool missing from the Angular framework was a way to drill down into an application in the
browser. Browsers such as Chrome and Firefox have greatly improved the developer experience over
the years, broadly for all types of websites.
With that in mind, the Angular team, starting from version 12, created the Angular DevTools extension
for Chrome and Firefox.
To install it, you need to go to the extension store of the browser (Chrome or Firefox) and click on Install.
-- 32 of 270 --
Starting Projects the Right Way	12
With it installed, access to the site built with Angular, and with the build set up for development, the
Angular tab will appear in the developer tools:
Figure 1.3 – Angular DevTools Chrome extension example
This tool allows you to browse the structure of your app, locate the code of the components on the
screen, and profile your application to detect possible performance problems.
Now you have a productive development environment for developing Angular applications, we are
ready to start our ap

---

## 4. 	Confirming the Angular CLI will create the entire initial structure of the project and will

install the dependencies using the npm i command, leaving everything ready for the start of
development, as in the following example.
-- 34 of 270 --
Starting Projects the Right Way	14
Figure 1.5 – Prompt of files generated by angular-cli
To verify that the project was successfully installed, in your operating system’s terminal, type the
following command:
ng serve
This command will start the development web server and load the example project page, as shown
in Figure 1.6:
Figure 1.6 – Example page generated by angular-cli on project creation
-- 35 of 270 --
Starting an Angular project 	15
The ng new command has other options that can be used for specific needs in your project. They
are listed in the official documentation (https://angular.io/cli/new), and here are some
that may be interesting:
• 	Parameter '—package-manager': With this parameter, it is possible to choose another
node package manager such as yarn (https://yarnpkg.com/).
• 	Parameter '--skip-install': With this parameter, the CLI does not perform the
package installation step, which can be useful for creating automation tools for your team.
• 	Parameter '--strict': This parameter is set to true by default, but it is important to
mention it because it configures your project in strict mode, which configures the TypeScript
and Angular mechanisms to improve type and template validations. For more details, see

---

## Project structure

The Angular CLI creates the project in the structure recommended by the Angular team with all files
configured by default. To deepen our knowledge of the framework, we need to know the main files,
their functions, and available customizations as follows:
• 	src: This is the folder where your project will be, including all components, modules, and services.
• 	assets: Contains the static files you will need in your project, such as images and icons. In
the build process, by default, it will export the files from this folder without any changes to
the production build.
• 	index.html: This is the initial file of your application. This file will be used in the build
process, and it is recommended not to change it unless there is a very specific need. The title
information must be changed with an Angular feature and not directly in this file.
• 	main.ts: This is the first JavaScript file that will be loaded in your application. You shouldn’t
change it unless your project has a very specific need for it to be changed.
• 	styles.css: This is the file that can contain the global CSS of your application, that is,
the CSS that can be read by all components since Angular by default isolates the CSS of each
component. This file is usually modified when your project uses a design system such as
Material (https://material.angular.io/).
• 	.editorconfig: As described in the VS Code section of this chapter, this file, together
with the extension that interprets and configures the IDE, allows standardization in your code
conventions, such as the use of double or single quotes and the use of tabs or indentation spaces.
• 	angular.json: This is the most important configuration file for an Angular application. In
it, you can customize the way your project is built, and define budgets for the size of bundles
(more details in Chapter 12, Packaging Everything – Best Practices for Deployment), among
other settings.
-- 36 of 270 --
Starting Projects the Right Way	16
• 	package.json and package-lock.json: These files refer to the dependencies of the
npm packages of your project and also the place to create the npm scripts that will be used in the
creation of the CI/CD pipes of the Angular application (more details in Chapter 12, Packaging
Everything – Best Practices for Deployment).
As of version 15 of Angular, the CLI hides Karma configuration files and environment variables files
(enviroment.ts) by default with the justification of simplifying the project structure. It is still
possible to create these files for fine-tuning your application build, test, and environment processes
(more details in Chapter 8, Improving Backend Integrations: the Interceptor Pattern).
We created our project using the angular-cli tool, but this tool can help us even more, as we
will learn next.
Using the Angular CLI for your productivity
We learned how to create a project with all its options, but the Angular CLI is far from being just
a project creation tool. It is a very important tool for 

---

## Summary

In this chapter, we covered the features and philosophy of Angular and how to start a project in the
most productive way. We learned which technologies make up its ecosystem and how to configure
its desktop with the best VS Code extensions and settings. Finally, we learned how to start a project
with the Angular CLI and what other features this powerful tool can provide us with.
Now you’ll be able to argue why to use Angular in your team’s project and you’ll be able to help it set
up a productive work environment. You’ll also be able to use the Angular CLI to create and maintain
your project.
In the next chapter, we will learn how to organize the components of an Angular application.
-- 40 of 270 --
-- 41 of 270 --
2
Organizing Your Application
A messed-up project is a bug’s nest waiting to spoil your user experience. In addition to quality, good
organization of your project from the beginning will give your team productivity and, in the case of
Angular, potential improvement in the performance of your application.
In this chapter, you will learn about the function of Angular modules, the difference between these
and JavaScript modules, and how to use them in the best way for your project.
You will learn about the single module app anti-pattern and how and why to avoid it. You will also
use Angular modules to optimize the import of common components to your application using the
SharedModule pattern. Finally, you will understand how to use lazy loading to optimize your
application’s performance.
In this chapter, we’re going to cover the following topics:
• 	Organizing the application with Angular modules
• 	The first module: AppModule
• 	Avoiding anti-pattern: single module app
• 	Optimizing the usage of common modules: the SharedModule pattern
• 	Improving the size of your app: lazy loading
By the end of this chapter, you will be able to organize your Angular application into functional and
optimized modules.

---

## Technical requirements

To follow the instructions in this chapter, you’ll need the following:
• 	Visual Studio Code (https://code.visualstudio.com/Download)
• 	Node.js 18 or higher (https://nodejs.org/en/download/)
-- 42 of 270 --
Organizing Your Application	22
The code files for this chapter are available at https://github.com/PacktPublishing/
Angular-Design-Patterns-and-Best-Practices/tree/main/ch2.
Organizing the application with Angular modules
The basis for organizing the components of an application using the framework is the Angular modules,
more recognized in the documentation and the community by the name NgModules.
An Angular module is a TypeScript class marked with the @NgModule decorator that contains
metadata, as in this example:
import { NgModule } from '@angular/core';
@NgModule({
declarations: [SimulationComponent],
providers:[],
imports: [
CommonModule,
SharedModule,
MatCardModule,
MatButtonModule,
MatSelectModule,
MatRadioModule,ReactiveFormsModule,
],
exports: [SimulationComponent],
})
export class SimulationModule {}
Let’s detail each of these types of metadata in the following subsections.
declarations
This metadata contains an array of components, directives, and pipes that make up the module. These
components must belong to only one module, otherwise, the Angular compiler will throw an error,
as shown in Figure 2.1:
-- 43 of 270 --
Organizing the application with Angular modules 	23
Figure 2.1 – Error message when declaring a component in more than one module
providers
In this attribute, we can register the classes we want to inject using Angular’s dependency injector
system, normally used for services (which will be detailed in Chapter 5, Angular Services and the
Singleton Pattern.
imports
In this metadata, we inform the modules that we want to import and use their components and
services. For example, if we want to use Angular’s HTTP request services, we must declare the
HttpClientModule module here.
It is important to know that, here, we should not import components or services, only Ngmodules.
exports
By default, all items in the declarations attribute are private. This means that if a module contains
the StateSelectorComponent component and another module, for example, importing the
module to use this component will cause the following error to occur:
Figure 2.2 – Error message when using a component not exported correctly
-- 44 of 270 --
Organizing Your Application	24
To inform Angular that the component can be used, it is necessary to declare it in the exports metadata.
Unlike the imports metadata, here, you can declare components, pipes, directives, and other modules
(as we’ll see in the Optimizing the usage of common modules – the SharedModule pattern section).
Now that we know how to declare a module, let’s study the module that is generated when creating
an Angular project.
The first module – AppModule
The modules in Angular are so important to the framework that when you start a project, it automatically
creates a module called AppMod

---

## Modules type

Now that we understand and have reinforced the concept of modules in the Angular framework,
let’s divide our application and make better use of this feature. There is no fixed rule for organizing
the modules of an application, but the Angular team and the community suggest the separation of
modules based on the grouping of functionalities with common characteristics.
Based on this thought, we can have the following types of Angular modules:
• 	Business domain modules
• 	Component modules

---

## Business domain modules

An application will serve one or more user workflows. This type of module aims to group these flows
based on the affinity of the interfaces that compose them. For example, in an application for resource
management, we can have the accounting module and the inventory module.
-- 46 of 270 --
Organizing Your Application	26
In the application available in the ch2 folder, there is the talktalk application that we will use in this
and other chapters to put our knowledge into practice. In the project folder, let’s create the home
module with the following command:
ng g m home
In this command, we use the Angular CLI, ng, and the abbreviations g for generate and m for module.
Then we give the name of the module, home.
Let’s create the Page component that will represent the application’s home page and, since we are
using Angular material, we will use the Angular CLI to generate a page with a side menu using the
following command:
ng generate @angular/material:navigation home/home
The Angular CLI, besides creating the component, also edited the home.module.ts file by adding
it to the declarations attribute. Change this file as shown in the following example:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
@NgModule({
declarations: [HomeComponent],
imports: [
CommonModule,
LayoutModule,
MatToolbarModule,
MatButtonModule,
MatSidenavModule,
MatIconModule,
MatListModule,
],
exports: [HomeComponent],
})
export class HomeModule {}
-- 47 of 270 --
The first module – AppModule 	27
In this module, we will export the HomeComponent component to use in the application’s route. In
the app.module.ts file, import the module as follows:
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/
animations';
import { HomeModule } from './home/home.module';
@NgModule({
declarations: [
AppComponent
],
imports: [
BrowserModule,
AppRoutingModule,
BrowserAnimationsModule,
HomeModule
],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }
With the module in the import attribute of the NgModule metadata, we can change the route in
the app-routing.module.ts file:
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
const routes: Routes = [
{ path: '', pathMatch: 'full', redirectTo: 'home' },
{
path: 'home',
compon

---

## Component modules

The purpose of this module is to group directive components and pipes that will be reused by
business domain components and even other components. Even using a component library such as
Angular Material, your system will need custom components according to the business rules of your
business domain.
This type of component has components, directives, and pipes declared in the declaration attribute
and exported in the exports attribute, as shown in the following example:
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatesSelectorComponent } from './states-selector/states-
selector.component';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
declarations: [StatesSelectorComponent],
imports: [CommonModule, MatSelectModule],
exports: [StatesSelectorComponent],
})
export class ComponentsModule {}
-- 49 of 270 --
Avoiding anti-pattern – single module app 	29
Separating the project into business domain modules and components will organize your code and
improve its maintainability. Let’s analyze a common anti-pattern in Angular applications.
Avoiding anti-pattern – single module app
When we are starting to study and develop with Angular, it is very common not to pay much attention
to the organization and use of the application modules. As we studied at the beginning of this chapter,
NgModules are so fundamental to Angular that as soon as we start a project, the Angular CLI creates
the first module for the project, AppModule.
In theory, only this module is necessary for your application to work. From there, we can declare all
the components and directives, and import all the libraries that the project might need, as we can see
in the following example:
import { NgModule } from '@angular/core';
. . .
@NgModule({
declarations: [
AppComponent,
StatesSelectorComponent,
HomeComponent,
SimulationComponent
],
imports: [
BrowserModule,AppRoutingModule,
BrowserAnimationsModule,HttpClientModule,
ReactiveFormsModule,LayoutModule,
MatToolbarModule,MatButtonModule,
MatSidenavModule,MatIconModule,
MatListModule,
],
bootstrap: [AppComponent]
})
export class AppModule { }
This approach has some problems and is an anti-pattern that we’ll call a single-module app.
The problems we have here are as follows:
• 	Disorganized folder structure: The team will soon not know which components belong to
which area of the project. As the project grows, this file will get bigger and more confusing.
• 	Bundle size and build time: Angular has several build and bundle optimizations that depend
on the definition of application modules. Staying in just one module, these optimizations are
not very effective.
-- 50 of 270 --
Organizing Your Application	30
• 	Component maintainability and update issues: As this file grows, the team will have difficulties
deprecating no longer used components or updating those components where the Angular CLI
is unable to update automatically.
The solution to this anti-pattern is to app

---

## Important

The modules present in SharedModule must be modules common to the majority of modules
in your project, as this can increase the size of the module’s bundle. If the module needs some
specific dependency, you must declare it in that dependency and not in SharedModule.
In the next topic, we’ll see a feature that will improve your user’s experience and is based on organizing
the application into modules.
Improving the size of your app – lazy loading
A good strategy for separating modules from your Angular application will increase your team’s
productivity and improve code organization. But another advantage that will impact the quality for
your user is the use of the lazy loading technique for modules.
If we run the build process of the sample application using the ng build command, we can see
the following message:
Figure 2.4 – Sample application bundle size
-- 53 of 270 --
Improving the size of your app – lazy loading 	33
The size of our application’s initial bundle (the main.ts file) is 94.73 kB, which may seem small, but
for the size of our application with few features, it is a considerable size.
As the project has more features, the tendency is for this initial bundle to increase considerably, harming
our users’ experience as they will initially need to download a larger file. This problem particularly
manifests itself in environments where the internet is not very good, such as 3G networks.
To reduce this file and consequently improve our user experience, the ideal is to have smaller packages
and for these packages to be loaded only when necessary – that is, in a lazy way.
We are going to refactor our project, and the first step we have already taken is to separate the
functionalities into feature modules (in the Avoiding anti-pattern – single module app section, we
explained the danger of not separating the application modules, and without a doubt, the size of the
bundle is the most impactful for the user).
Now, let’s create a route file for the Home module. As the module already exists, let’s manually create
the home-routing.module.ts file in the same folder as the home.module.ts file.
In this file, we will add the following code:
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
const routes: Routes = [
{
path: '',
component: HomeComponent,
},
];
@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule],
})
export class HomeRoutingModule {}
This route file is similar to the application’s main route file, with the difference that @NgModule’s
import uses the forChild method instead of forRoot. This is because this module is a subroute
of the main route.
Another important detail to note is that the chosen path for the HomeComponent component is
empty. We can explain this because the main route file that defines the /home route and how this
module represents the /home component is already defined.
-- 54 of 270 --
Organizing

---

## Summary

In this chapter, we studied the Angular modules in detail and how we can use them for the organization
and performance of our applications. We learned the difference between Angular modules and
JavaScript modules, and we saw each attribute of a module definition and the types that we can create
in the project. Finally, we learned how to avoid the single module app anti-pattern and how to create
the SharedModule.
We reiterated our example application to use lazy loading of bundles, which demonstrates that good
module organization reflects performance and fluidity for our users. Now, you are able to organize
your application in such a way that it can scale and increase in complexity and features without
compromising the maintainability of the project.
In the next chapter, we will learn how to use TypeScript effectively and productively for our
Angular projects.
-- 57 of 270 --
3
TypeScript Patterns for Angular
Since version 2 of the framework, Angular is based on TypeScript for its development, both internally
and for those who use it to build applications.
This was a controversial decision at the time, as this JavaScript superset, created by Microsoft, was
new. Nowadays, most web frameworks, such as React, Vue.js, and Svelte, support TypeScript, and
some web frameworks actively recommend TypeScript as the language to use.
In this chapter, we will study the best practices and patterns for using TypeScript with Angular
and beyond; these techniques can be applied to Node.js backend development and even other web
frameworks, such as React and Vue.js.
We’ll learn how to better declare our application’s methods and functions and how to leverage
TypeScript’s type inference mechanism to make our classes less verbose.
In this chapter, we’re going to cover the following topics:
• 	Creating classes and types
• 	Creating methods and functions
• 	Decreasing verbosity: type inference
• 	Validating types: type guards
• 	Using a better alternative to the any type
By the end of the chapter, you will be able to better apply TypeScript resources in your projects,
improving the quality of your code and the productivity of your team.

---

## Technical requirements

To follow the instructions in this chapter, you’ll need the following:
• 	Visual Studio Code (VS Code) (https://code.visualstudio.com/Download)
• 	Node.js 18 or higher (https://nodejs.org/en/download/)
-- 58 of 270 --
TypeScript Patterns for Angular	38
The code files for this chapter are available at https://github.com/PacktPublishing/
Angular-Design-Patterns-and-Best-Practices/tree/main/ch3.

---

## Creating classes and types

The basis of application development using Angular is object-oriented programming, so it is important
for us to delve into how to create classes and instantiate objects. Using TypeScript instead of pure
JavaScript, we have another powerful element in our toolbox of types.
By typifying variables and objects, the TypeScript transpiler is able to carry out checks and alerts,
preventing errors that could occur at runtime during development if this process did not exist.
Bear in mind that after transpiling (a process that transforms TypeScript code into JavaScript), the
code delivered to the client’s browser is pure JavaScript, including some optimizations; that is, code
written in TypeScript is no less performant than code written directly in JavaScript.
To start with the fundamentals, let’s explore primitive and basic types.

---

## Primitive and basic types

JavaScript, despite not being a strongly typed language, has three types called primitives:
• 	boolean: Represents the two binary values false and true
• 	string: Represents a set of characters such as words
• 	number: Represents numerical values
For each of these primitive types, TypeScript already has a datatype that represents them, namely,
Boolean, String, and Number, respectively.

---

## Important

The first letter of the primitive types in TypeScript is in uppercase to differentiate it from the
primitive JavaScript types. If you want to check a type at runtime using the typeof function,
use the names of the primitives in lowercase.
To declare the variables of these types, just use the : symbol in front of the variable declaration, as
in the following example:
export function primitive_example() {
let name: string;
let age: number;
let isAlive: boolean;
name = "Mario";
-- 59 of 270 --
Creating classes and types 	39
age = 9;
isAlive = true;
console.log(`Name:${name} Age:${age} is alive:${isAlive ? "yes" :
"no"}`);
}
In the preceding example, we declare the name, age, and isAlive variables as string, number,
and boolean, respectively. Note that we can use JavaScript type names in TypeScript because
TypeScript allows both forms for these primitive types.
In JavaScript, it is very common to use the array data structure. This structure allows us to store and
manipulate a list of values for our applications. TypeScript has a type for this structure called Array,
where it is possible not only to create a variable with that type but also to typify what kind of values
the array will contain:
export function array_example() {
let names: Array<string>;
let surnames: string[];
names = ["Mario", "Gabriel", "Lucy"];
surnames = ["Camillo", "Smith"];
names.forEach((name) => console.log(`Name:${name}`));
surnames.forEach((surname) => console.log(`Surname:${surname}`));
}
In this function, we declare the names array using the Array type and declare that it is a string
list because we are informing it between square braquets.. In the surnames array declaration, we
make the same declaration but use a TypeScript syntax sugar using [] after the string type. This
way of declaring has the same effect; it’s just more succinct.
At the end of the example, we use Array’s foreach method to print the elements of the array.
Finally, another basic type that is widely used is the any type. This type tells the TypeScript transpiler
not to perform any type checking on it, and its content can be type-changed anywhere in the code,
as in the following example:
export function any_example(){
let information:any;
information = 'Mario';
console.log(`Name: ${information}`);
information = 7;
console.log(`Age: ${information}`);
}
-- 60 of 270 --
TypeScript Patterns for Angular	40
The information variable is declared as any and then we put the Mario string in it. We
subsequently redefine the variable with the value 5.
By default, in TypeScript, every variable that does not have its type declared, or that has its value
defined in its declaration, is of type any.
This language rule allows, for example, a project with JavaScript code to be incrementally converted
to TypeScript by initially declaring all variables of the any type. Another use of the any type is when
your code needs the flexibility of JavaScript for some more general algorithm types.
However, it is recommended that Angular

---

## Classes

Building on our knowledge of basic types, let’s now create more complex data types. The first one we’re
going to explore is classes. An essential element of object-oriented programming, the class represents
a model, which can be real, such as a person or vehicle, or abstract, such as a text box on a web page.
From the class, we create the objects that are the elements that our systems will manipulate to execute
a business rule, as in the following example:
class Person {
name: string;
age: number;
constructor(name: string, age: number) {
this.name = name;
this.age = age;
}
}
export function basic_class() {
let client: Person = new Person("Mario", 7);
console.log(`Name:${client.name} Age:${client.age}`);
}
First, we declare the Person class with the name and age properties by typing the properties, and
then we create a method for the class called constructor. This method is special because it defines
the rule for how the object will be instantiated from this class.
-- 61 of 270 --
Creating classes and types 	41
In the basic_class function, we instantiate an object called client, which is of the Person
type with the new keyword. To retrieve the properties of this instantiated object, we use the notation
client.name and client.age.
This declaration and use of class in TypeScript is almost the same as JavaScript except for typing the
attributes of the class.
The same example in pure JavaScript would be as follows:
class Person {
constructor(name, age) {
this.name = name;
this.age = age;
}
}
function basic_class() {
let client = new Person("Mario", 7);
console.log(`Name:${client.name} Age:${client.age}`);
}
Notice that the process of declaring the class and instantiating an object from it changes very little from
TypeScript. However, as we will see in the following code block, TypeScript provides more resources
for the use of the class in our projects.
In addition to attributes, classes also define methods, which are functions that an object can perform.
In the example we are working on, we are now going to add a method:
class Person {
name: string;
age: number;
constructor(name: string, age: number) {
this.name = name;
this.age = age;
}
toString(){
return `Name:${this.name} Age:${this.age}`;
}
}
The toString method returns a string that represents the object, so it accesses the attribute of
the object instance using the reserved JavaScript word this.
There is a concept in object-oriented programming called the encapsulation of attributes. This consists
of defining which attributes are accessible to the function that instantiates a given object.
-- 62 of 270 --
TypeScript Patterns for Angular	42
This concept, important for the correct use of some design patterns, does not exist in its entirety in
JavaScript. Every class attribute is public, but in TypeScript it is implemented and validated by the
transpiler, as in the following example:
class Person {
name: string;
age: number;
private id:number;
constructor(name: string, age: number) {
this.name = na

---

## Interfaces

In TypeScript, we have another way of typifying the structure of an object called an interface. The
following example demonstrates its use:
export interface Animal {
species: string;
kingdom: string;
class: string;
}
To declare an interface, we use the reserved word interface and declare its properties as a class
as we saw earlier.
To use interface, we can proceed as follows:
import { Animal } from "./animals";
export function basic_interface() {
let chicken: Animal = {
kingdom: "Animalia",
species: "Gallus",
class: "birds",
-- 64 of 270 --
TypeScript Patterns for Angular	44
};
console.log(
`kingdom:${chicken.kingdom} species:${chicken.species}
class:${chicken.class}`
);
}
Note that to use a class, we just type the variable and declare its values, without using the reserved
word new. This happens because the interface is not a JavaScript element and is only used by the
TypeScript transpiler to check whether the object contains the defined properties.
To prove that the interface does not exist, if we transpile the interface file, a blank file will be
generated by TypeScript!
We can also make use of interfaces to create contracts for classes, should a class require certain methods
and attributes. Let’s see the following example:
export interface Animal {
species: string;
kingdom: string;
class: string;
}
export interface DoSound {
doASound: () => string;
}
export class Duck implements DoSound {
public doASound(){
return 'quack';
}
}
export class Dog implements DoSound {
public doASound(){
return 'bark';
}
}
To define that a certain class follows the DoSound contract, we use the reserved word implements.
TypeScript then requires that a method called doASound be defined and that this method returns
a string.
-- 65 of 270 --
Creating classes and types 	45
This feature of the interface facilitates the use of a very important capability of the object-oriented
language, which is polymorphism. Let’s see the example:
export function animalDoSound() {
let duck = new Duck();
let dog = new Dog();
makeSound(duck);
makeSound(dog);
}
function makeSound(animal: DoSound) {
console.log(`The animal make this sound:${animal.doASound()}`);
}
We create the makeSound function, which receives an animal that implements the DoSound
contract. The function is not concerned with the type of animal or its attributes; it just needs to follow
the DoSound interface contract, as it will invoke one of its methods.
Angular uses this characteristic of TypeScript interfaces a lot, as we can see in the declaration of
a component:
export class SimulationComponent implements OnInit {
When we inform Angular that the component implements the OnInit interface, it will execute the
ngOnInit method required at the beginning of the component’s lifecycle (we will study this in more
detail in Chapter 4, Components and Pages).

---

## Type aliases

The last way to type a variable that we will see in this chapter is the simplest one, which is to create
type aliases. Like interfaces, type aliases only exist in TypeScript, and we can use them as in the
following example:
type Machine = {
id: number;
description: string;
energyOutput: number;
};
export function basic_type() {
let car: Machine = {
id: 123,
description: "Car",
energyOutput: 1000,
-- 66 of 270 --
TypeScript Patterns for Angular	46
};
console.log(
`ID:${car.id} Description:${car.description} Energy Output:${car.
energyOutput} `
);
}
In this code, we create the Machine type, describing the object we want to represent, and in the
basic_type function, we instantiate a variable with that type.
Note that we use the attributes of this variable just like the previous examples. This demonstrates how
much TypeScript maintains the flexibility of JavaScript while giving more possibilities to the developer.
A well-used feature of type aliases is the creation of a type from other types. One of the most common
is the union of types, as we can see in the following code:
type ID = string | number;
type Machine = {
id: ID;
description: string;
energyOutput: number;
};
Here, we are creating a type called id, which can be string or number. For this, we use the |
symbol, which is the same as used in JavaScript to indicate the conditional OR.
This feature was important for the use of more advanced techniques, such as the guard type, which
we will see in this chapter.
When to use classes, interfaces, or types
With all these ways of creating typed objects, you must be wondering in which situations we should
use each one. Based on the characteristics of each form, we can categorize the use of each one:
• 	Type alias: The simplest form of creation, recommended for typing input parameters and
function returns.
• 	Interfaces: Recommended for representing JSON data objects, where we won’t have methods,
just the data representation. An example is the return of an API that we will use in our Angular
project. The interface can also be used to define class contracts using the implements keyword.
• 	Classes: The basis of object orientation, also present in JavaScript. We should use it whenever
we need an object with methods and attributes. In Angular, all components and services are
ultimately objects created from classes.
-- 67 of 270 --
Creating methods and functions 	47
Remember that in TypeScript, it is possible to create an alias type that behaves as an interface, as
well as indicate an interface as a parameter and return of a function, but the recommendations here
advise you to use the best for each type of situation and also explain how they are normally used in
Angular apps.
Now that we have a good understanding of the different ways of creating more complex variables as
objects, let’s get to know how to create functions and methods with TypeScript.

---

## Creating methods and functions

One of the best ways used by TypeScript to improve the developer experience in Angular application
development is through the ability to type parameters and return functions and methods.
Both for developers who create libraries and frameworks and for those who consume these software
components, knowing what a function expects and what the expected return is allows us to reduce
the time spent reading and looking for documentation, especially the runtime bugs that our system
may encounter.
To carry out the typing of the parameters and the return of a function, let’s consider the following example:
interface invoiceItem {
product: string;
quantity: number;
price: number;
}
type Invoice = Array<invoiceItem>;
function getTotalInvoice(invoice: Invoice): number {
let invoiceTotal = invoice.reduce(
(total, item) => total + item.quantity * item.price,
0
);
return invoiceTotal;
}
export function invoiceExample() {
let example: Invoice = [
{ product: "banana", price: 1.5, quantity: 3 },
{ product: "apple", price: 0.5, quantity: 5 },
{ product: "pinaple", price: 3, quantity: 12 },
];
console.log(`Invoice Total:${getTotalInvoice(example)}`);
}
In this example, we start by defining an interface that represents an invoice item and then we create
a type that will represent an invoice, which in this simplification is an array of items.
-- 68 of 270 --
TypeScript Patterns for Angular	48
This demonstrates how we can use interfaces and types to better express our TypeScript code. Soon
after, we create a function that returns the total value of the invoice; as an input parameter, we receive
a value with the invoice type, and the return of the function will be a number.
Finally, we create an example function to use the getTotalInvoice function. Here, in addition to
type checking, if we use an editor with TypeScript support such as VS Code, we have basic documentation
and autocomplete, as shown in the following screenshot:
Figure 3.2 – Documentation generated by TypeScript and visualized by VS Code
In addition to primitive types and objects, functions must also be prepared to handle null data or
undefined variables. In the next section, we will explore how to implement this.

---

## Working with null values

In TypeScript, by default, all function and method parameters are required and checked by the transpiler.
If any parameter is optional, we can define it in the type it represents, as in the following example:
function applyDiscount(
invoice: Invoice,
discountValue: number,
productOfDiscount?: string
) {
discountValue = discountValue / 100;
let newInvoice = invoice.map((item) => {
if (productOfDiscount === undefined || item.product ===
productOfDiscount) {
item.price = item.price - item.price * discountValue;
}
return item;
});
return newInvoice;
}
-- 69 of 270 --
Decreasing verbosity – type inference 	49
Within this function of applying a discount to the invoice, we created an optional parameter that
allows the user of the function to determine a product to apply the discount. If the parameter is not
defined, the discount is applied to the entire invoice.
To define an optional parameter, we use the ? character. In TypeScript, optional parameters must be
the last to be defined in a function. If we change the position of the function parameters the following
error is thrown by the transpiler:
error TS1016: A required parameter cannot follow an optional
parameter.
Additionally, TypeScript allows you to define a default value for the parameter:
function applyDiscount(
invoice: Invoice,
discountValue = 10,
productOfDiscount?: string
)
When assigning a value in the parameter declaration, if the function user does not use the parameter,
a 10% discount will be applied to the invoice items.
We’ve seen how we can use TypeScript to typify function parameters and returns. Now let’s discuss
type inference and how we can use it to reduce the verbosity of our code.
Decreasing verbosity – type inference
In this chapter, we saw the best TypeScript capabilities that help in the development of our Angular
projects. We were typing all the variables and relying on the TypeScript transpiler to avoid errors that
would otherwise occur in our user’s runtime.
Let’s now explore TypeScript’s powerful inference mechanisms. Through it, TypeScript identifies
the types of variables by content, not requiring you to define the type explicitly. Let’s observe the
following example:
export function primitive_example() {
let name = "Mario";
let age = 9;
let isAlive = true;
console.log(`Name:${name} Age:${age} is alive:${isAlive ? "yes" :
"no"}`);
}
-- 70 of 270 --
TypeScript Patterns for Angular	50
This example is the same as in Primitive and basic types, but we directly inform the values in the
variables. This way of declaring the variable has the same effect as the explicit method. If you change the
value of a variable to another type, TypeScript will perform the validation as in the following example:
TSError: ⨯ Unable to compile TypeScript:
src/basic_types/primitive.ts:6:3 - error TS2322: Type 'number' is not
assignable to type 'string'.
TypeScript can also infer complex types, such as arrays and function returns. A good practice here is
to use the inference capability to write l

---

## Using a better alternative to the any type

In the development of TypeScript applications, we may have situations where we do not know which
type of parameter we are going to receive, such as the return of an API.
What is trafficked can be defined by creating an interface that represents the data, (for more details,
see Chapter 5, Angular Services and the Singleton Pattern). It is not possible to guarantee this because
pure text is trafficked on the internet.
In these cases, we can use the any type, which prevents TypeScript from doing the type checking.
In this example, we can see the use of any:
interface Products {
id: number;
description: string;
}
type ListOfProducts = Array<Products>;
const exampleList: ListOfProducts = [
{ id: 1, description: "banana" },
{ id: 2, description: "apple" },
{ id: 3, description: "pear" },
];
function getProductById(id: any) {
return exampleList.find((product) => product.id === id);
}
In the preceding code sample, we create an interface that represents a product and a type that represents
a list of products. We then create a function that receives an id of the any type and searches the
Array, returning an item from the list of products.
-- 73 of 270 --
Decreasing verbosity – type inference 	53
In these simple examples, we can assume that there is no bug, but let’s create a function that will use
this snippet and see what happens:
export function getProductTest() {
const id = '2';
const item = getProductById(id);
if (item !== undefined) {
console.log(`ID:${item.id} Description:${item.description}`);
} else {
console.log("No product found");
}
}
In this example, the item was not found because the variable we passed was a string. This could
happen if the data we are passing to the function came from an API or external call, and the data was
not properly formatted.
Running the code, we get the following result:
Figure 3.5 – Function returned No product found due to the id variable typing
When we use the any type, we give up the advantage of type checking and this type of bug can occur
in our application. But how can we have the flexibility of the any type without losing TypeScript’s
type checking?
In these cases, we use the unknown type. This type has the same flexibility as the any type, but with
one detail: TypeScript forces you to perform type guarding before using the variable.
Let’s refactor our example function:
function getProductById(id: unknown) {
if (typeof id === 'string'){
id = parseInt(id);
} else if (typeof id !== 'number'){
return
}
return exampleList.find((product) => product.id === id);
}
Here we declare that id will be of an unknown type and, right after that, we make a guard type in
this variable, dealing with the possible scenario of the variable being numerical.
-- 74 of 270 --
TypeScript Patterns for Angular	54
The any type will still be used in your application, but consider using the unknown type to ensure
correct type handling when you are not sure who will call your function.

---

## Summary

In this chapter, we saw how we can use TypeScript to create better-quality code with less effort, increasing
our productivity. We learned about basic TypeScript types, such as number, string, and Array.
We also studied creating classes, interfaces, and type aliases, and how we can choose and mix these
types of structures to make our code cleaner and more maintainable.
Finally, we learned about TypeScript’s type inference mechanism and how we can use the concept of
type guards to further improve the type-checking mechanism. With these concepts, we also became
familiar with the unknown type, which provides a better alternative to the any type.
In the next chapter we will learn about the basics of the interfaces of an Angular project, that is,
the Components.
-- 75 of 270 --
4
Components and Pages
The main building blocks of an Angular application are the components. It is by using them that we
assemble our user interfaces and define the flow of the experience. In Angular architecture, components
organize an application into reusable parts, making it easy to maintain and scale.
In this chapter, we will explore the communication between components and thus assemble our pages
using component composition, avoiding the anti-pattern of creating monolithic interfaces.
In this chapter, we’re going to cover the following topics:
• 	Creating components
• 	Communication between components – inputs and outputs
• 	Best practice – using the TrackBy property
• 	Separating responsibilities – smart and presentation components
• 	Communication from the child component – using @Output
By the end of this chapter, you will be able to create reusable and easy-to-maintain components and
pages, streamlining the development of your project and increasing your productivity and that of
your team.

---

## Technical requirements

To follow the instructions in this chapter, you’ll need the following:
• 	Visual Studio Code (https://code.visualstudio.com/Download)
• 	Node.js 18 or higher (https://nodejs.org/en/download/)
The code files for this chapter are available at https://github.com/PacktPublishing/
Angular-Design-Patterns-and-Best-Practices/tree/main/ch4.
-- 76 of 270 --
Components and Pages	56

---

## Creating components

Every interface created with Angular is a component in the architecture of the framework; therefore,
theoretically, we could have our entire application in a single component.
As we studied in Chapter 2, Organizing Your Application, it is best to separate your application into
modules, and with components, we use the same reasoning by separating our interfaces into and
composing them with different components, maximizing reuse and maintainability.
In this chapter, we will illustrate this with a gym diary application, as shown in the following figure
– to focus on Angular, we will not use Angular Material, only HTML, CSS (in this case, Tailwind
CSS), and TypeScript.
Figure 4.1 – Gym diary application UI
In this initial example, we created a component with just the HTML template and the CSS and
TypeScript files are as they were created by Angular CLI. Here’s the top of the page first:
<div class="min-h-screen bg-gray-200">
<header class="bg-blue-500 py-4 text-white">
<div class="mx-auto max-w-6xl px-4">
<h1 class="text-2xl font-bold">Workout diary</h1>
</div>
</header>
Using good HTML semantic practices, let’s create a main section:
<main class="mx-auto mt-8 max-w-6xl px-4">
<section class="mb-8">
<h2 class="mb-4 text-xl font-bold">List of entries</h2>
-- 77 of 270 --
Creating components 	57
<ul class="rounded border shadow">
<li class="mb-4 border-b bg-white p-4">
<span class="font-bold">Date:</span> 2023-03-20<br />
<span class="font-bold">Exercise:</span> Bench press<br />
<span class="font-bold">Sets:</span> 3<br />
<span class="font-bold">Reps:</span> 10
</li>
<!-- more entries here -->
</ul>
</section>
<button
class="rounded bg-blue-500 py-2 px-4 font-bold text-white
hover:bg-blue-700"
>

---

## Add new entry

</button>
</main>
</div>
We can see that in the preceding example, the interface is designed and stylized, but it is not functional
because the diary entries are fixed in HTML, and in our application, the user should be able to add
as many entries as they want.
We can identify here that this part of the diary entry could be a component for the page to use, so let’s
create a component called entry. As we learned in Chapter 1, Starting Projects the Right Way, we are
going to use the Angular CLI to create this new component in the module we need:
ng g c diary/entry-item
With this command, the Angular CLI will create a folder with the following four files in addition to
updating the diary module with the new component.
• 	entry-item.component.css: This file will contain the component’s style sheet. Angular
manages to solve a big pain point of a web application, which is the CSS scope of each component.
With this feature, we can specify the component’s styling without having to worry about whether
it will affect an application’s CSS even using the same property or selector name.
• 	entry-item.component.html: This file contains the component’s HTML template and,
although the extension seems to indicate that we can only use HTML tags, in the template file,
we can use Angular directives, as we will study in this chapter.
• 	entry-item.component.spec.ts: This file contains the unit test for the component,
which we will detail in Chapter 10, Design for Tests: Best Practices.
-- 78 of 270 --
Components and Pages	58
• 	entry-item.component.ts: This is the TypeScript file that represents the component
itself. All other files are optional, making it possible for you to create a component with just this
file, although this is not a practice widely applied in Angular projects and is only recommended
for very small components.
In the entry-item.component.ts file, the Angular CLI created the following structure:
import { Component } from '@angular/core';
@Component({
selector: 'app-entry-item',
templateUrl: './entry-item.component.html',
styleUrls: ['./entry-item.component.css']
})
export class EntryItemComponent {
}
With this example, we reinforce the definition that a component is a TypeScript class, and by using
the @Component decorator, we indicate to Angular where the parts to assemble it are.
The main properties are as follows:
• 	selector: This is an optional property that defines what the component’s selector will be if it
is used in the template of another component. Components that represent a page do not need
to have a selector defined as they are instantiated from a route. The Angular CLI suggests the
selector based on your application’s prefix defined in the prefix property of the angular.
json file, along with the name you defined in the ng g command.
• 	templateUrl: This defines the path of the HTML file that contains the component’s
template. Alternatively, we can use the template property to define a string with all the
component’s HTML.
• 	styleU

---

## Add new entry

</button>
</main>
</div>
Using the app-entry-item selector, we are consuming our new component on the page. From
version 15 of Angular, we can use self-closing tags for components, so we have used <app-entry-
item /> here, but if you prefer the previous way, <app-entry-item> </app-entry- item>
also still works.
Running our project, we can see that it continues to work. However, the data is the same in both
items. We now need a way to pass information between components, and we’ll see how to do that in
the next section.
-- 80 of 270 --
Components and Pages	60
Communication between components – inputs and
outputs
In our gym diary application, we now need the workout list page component, DiaryComponent,
to communicate with the list item component, EntryItemComponent.
The simplest way to accomplish this communication is with Angular’s Property Binding concept.
Despite the complicated name, in practice, we annotate a component object’s property with the
@Input annotation, so Angular creates a custom HTML attribute on the component.
Let’s see this concept in practice; first, let’s create an interface that will represent an item in our diary:
ng g interface diary/interfaces/exercise-set
With the preceding command, we create the file and, as an organized practice, we create a folder to store
the module’s interfaces. In the generated file, we will define the object we want to communicate with:
export interface ExerciseSet {
id?: string;
date: Date;
exercise: string;
sets: number;
reps: number;
}
export type ExerciseSetList = Array<ExerciseSet>;
We create an interface defining the object and a type to define a list of exercises, improving the future
readability of our implementation.
Now, in the entry-item.component.ts file, let’s add the new property:
import { Component, Input } from '@angular/core';
import { ExerciseSet } from '../interfaces/exercise-set';
@Component({
selector: 'app-entry-item',
templateUrl: './entry-item.component.html',
styleUrls: ['./entry-item.component.css']
})
export class EntryItemComponent {
@Input('exercise-set') exerciseSet!:ExerciseSet;
}
Here we create a property called exerciseSet of type ExerciseSet that we just defined. We
use the ! symbol in the type definition because we are going to define its value at runtime.
-- 81 of 270 --
Communication between components – inputs and outputs 	61
The @Input annotation receives the exercise-set string as a parameter. With this, we define the
name of the custom HTML attribute to be used in the template. This parameter is optional; if it's not
used, the name of the attribute will be the name of the property. Here, it would be exerciseSet.
Let’s now change our template to use this property:
<div class="mb-4 border-b bg-white p-4">
<span class="font-bold">Date:</span> {{ exerciseSet.date | date
}}<br />
<span class="font-bold">Exercise:</span> {{ exerciseSet.exercise
}}<br />
<span class="font-bold">Sets:</span> {{ exerciseSet.sets }}<br />
<span class="font-bold">Reps:</span> {{ exerci

---

## Add new entry

</button>
<br />
<br />
<button
class="rounded bg-blue-500 py-2 px-4 font-bold text-white
hover:bg-blue-700"
(click)="newList()"
>
erver Sync
</button>
</main>
-- 88 of 270 --
Components and Pages	68
The DiaryComponent Smart component just passes the list to the ListEntriesComponent
Presentation component, which iterates over the list by calling the EntryItemComponent
Presentation component. With this structure, only the DiaryComponent component needs to
worry about the list of exercises, respecting SOLID’s Single Responsibility concept.
We’ve studied how to structure our pages and components, but how do child components communicate
with their parents? Let’s learn about the output attributes of Angular components next.
Communication from the child component – using
@Output
We studied how parent components, which can be either smart or presentational, can communicate
with their child components by using attributes marked with the @Input decorator.
However, when we need the opposite, the child component passes some information to the parent. As
we saw in the previous section, business rule processing should ideally happen in the Smart component.
For this type of communication, we mark attributes with the @Output decorator.
Let’s create a button for adding an item to our diary. We’ll see the use of forms in Chapter 6, Handling
User Input: Forms, but here we want to focus on the interaction between components.
Using the Angular CLI, we will create the new component using this command:
ng g c diary/new-item-button
In the new component’s template, let’s move the diary button template into the component:
<button
class="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-
blue-700"
>

---

## Add new entry

</button>
In the new-item-button.component.ts file, we will add the new attribute:
import { Component, EventEmitter, Output } from '@angular/core';
import { ExerciseSet } from '../interfaces/exercise-set';
@Component({
selector: 'app-new-item-button',
templateUrl: './new-item-button.component.html',
styleUrls: ['./new-item-button.component.css'],
})
export class NewItemButtonComponent {
-- 89 of 270 --
Communication from the child component – using @Output 	69
@Output() newExerciseEvent = new EventEmitter<ExerciseSet>();
addNewExercise() {
const id = Date.now().toString();
const date = new Date();
const reps = 10;
const sets = 4;
const exercise = 'Leg Press';
const newExerciseSet: ExerciseSet = { id, date, reps, sets,
exercise };
this.newExerciseEvent.emit(newExerciseSet);
}
}
Here, we first create the newExerciseEvent attribute and add the @Output decorator to define
that it will be an attribute present in the component’s template.
Here, there is a difference from the @Input attribute; in this case, we are already assigning an object
of the EventEmitter class to the variable. This Angular class aims to emit events when a certain
action takes place.
This is necessary because, unlike @Input, the value of which is assigned when the component is
structured and rendered, @Output communication can occur at any time, depending on the user’s action.
The EventEmitter class uses TypeScript’s type-checking capability, making it possible for us to
determine what type of object we are going to emit to the parent component.
In the addNewExercise method, we create an object of type ExerciseSet, and using the emit
method of the EventEmitter class, we pass this object to the parent component.
Back to the template – let’s add the method call to the button’s click action:
<button
class="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-
blue-700"
(click)="addNewExercise()"
>

---

## Add new entry

</button>
Now let’s refactor DiaryComponent to consume the new button:
. . .
<main class="mx-auto mt-8 max-w-6xl px-4">
<app-list-entries [exerciseList]="exerciseList" />
-- 90 of 270 --
Components and Pages	70
<app-new-item-button (newExerciseEvent)="addExercise($event)" />
<br />
<br />
<button
class="rounded bg-blue-500 py-2 px-4 font-bold text-white
hover:bg-blue-700"
(click)="newList()"
>
Server Sync
</button>
</main>
. . .
In the template, we are using the app-new-item-button component to pass the addExercise
function to the newExerciseEvent attribute.
Here, we can highlight that the binding of an @Output attribute must be done with parentheses –
( ) – and this $event parameter represents the object that the child component will emit. If you
highlight this parameter in VS Code, we can verify that it is of type ExerciseSet.
Finally, let’s create the addExercise method in the component:
. . .
addExercise(newSet: ExerciseSet) {
this.exerciseList.push(newSet);
}
. . .
Our method receives the emitted value and adds it to the exercises array. Running our project,
we can see that the items are successfully added.
In this example, we can see in practice the whole flow of the design pattern of the Smart and presentation
components. When clicking on the Add Exercises button, the Diary Smart component receives the
new exercise from the NewItemButtonComponent presentation component.
By updating the list, the list is automatically passed to the ListEntriesComponent component,
which renders the list on the screen. Now we are going to implement actions for the items of the list
of exercises – we will see how to emit events of these items and how to identify these elements.

---

## Propagating events from nested components

We will add the options to delete an item from the list and increase the number of repetitions to our
diary. First, let’s add the buttons to the list item template. In the entry-item.component.html
file, we will edit the template:
-- 91 of 270 --
Propagating events from nested components 	71
<div class="mb-4 flex items-center justify-between border-b bg-white
p-4">
<div>
<span class="font-bold">Date:</span> {{ exerciseSet.date | date
}}<br />
<span class="font-bold">Exercise:</span> {{ exerciseSet.exercise
}}<br />
<span class="font-bold">Sets:</span> {{ exerciseSet.sets }}<br />
<span class="font-bold">Reps:</span> {{ exerciseSet.reps }}
</div>
<div class="flex items-center">
<button
class="mr-2 rounded bg-red-500 py-2 px-4 font-bold text-white
hover:bg-red-700"
>

---

## Delete

</button>
<button
class="rounded bg-blue-500 py-2 px-4 font-bold text-white
hover:bg-blue-700"
>
New Rep
</button>
</div>
</div>
The challenge here is to ensure that the action that will happen on each item in the list if correctly
identified to be applied correctly – that is, the Diary Smart component that handles the list will find
the corresponding item and change it.
For this, we will apply the Angular output feature to the item component:
@Output() newRepEvent = new EventEmitter<ExerciseSet>();
@Output() deleteEvent = new EventEmitter<string>();
delete() {
this.deleteEvent.emit(this.exerciseSet.id);
}
newRep() {
const reps = ++this.exerciseSet.reps;
const newItem: ExerciseSet = {
...this.exerciseSet,
reps,
};
-- 92 of 270 --
Components and Pages	72
this.newRepEvent.emit(newItem);
}
We create two outputs, each one for a different event that we want to emit, and we type them because
we need different actions.
We then create the delete method, which will emit the id value of the item we want to delete,
and the newRep method, with which we will add repetitions to the item of the exercise that will be
performed and emit that item.
We will return to the template to associate the methods with the buttons created:
<button
class="mr-2 rounded bg-red-500 py-2 px-4 font-bold text-white
hover:bg-red-700"
(click)="delete()"
>

---

## Delete

</button>
<button
class="rounded bg-blue-500 py-2 px-4 font-bold text-white
hover:bg-blue-700"
(click)="newRep()"
>
New Rep
</button>
Now let’s change the list-entries.component presentation component for creating the output,
which here, for simplicity, will have the same name as the item’s output:
export class ListEntriesComponent {
@Input() exerciseList!: ExerciseSetList;
@Output() newRepEvent = new EventEmitter<ExerciseSet>();
@Output() deleteEvent = new EventEmitter<string>();
. . .
}
To propagate the item’s events, we will change the list template:
<li *ngFor="let item of exerciseList; index as i; trackBy:
itemTrackBy">
<app-entry-item
[exercise-set]="item"
(deleteEvent)="deleteEvent.emit($event)"
(newRepEvent)="newRepEvent.emit($event)"
-- 93 of 270 --
Propagating events from nested components 	73
/>
</li>
We can see that we only emit the item’s event using the emit method of the outputs.
Finally, we will refactor the DiaryComponent Smart component to react to the item’s event. First,
let’s see the template:
<main class="mx-auto mt-8 max-w-6xl px-4">
<app-list-entries
[exerciseList]="exerciseList"
(deleteEvent)="deleteItem($event)"
(newRepEvent)="newRep($event)"
/>
. . .
</main>
As in the previous example, we used parentheses to associate it with a method, which will handle the
event and receive the element emitted by the parameter of that method using the $event variable.
We will now refactor the component by creating two new methods – one to delete a journal entry and
one to create a new repetition for an exercise:
. . .
deleteItem(id: string) {
this.exerciseList = this.exerciseList.filter((item) => item.id !==
id);
}
newRep(exerciseSet: ExerciseSet) {
const id = exerciseSet.id;
const i = this.exerciseList.findIndex((item) => item.id === id);
if (i >= 0) {
this.exerciseList[i] = { ...exerciseSet };
}
}
. . .
We are using the TypeScript array methods to simulate deleting and changing the array of items. We
can see that the method already receives the deletion item or id automatically due to Angular’s event
emission mechanism.
We are taking advantage of the smart and presentation component pattern here to leverage its usage
with a slightly more complex requirement.
-- 94 of 270 --
Components and Pages	74

---

## Summary

In this chapter, we studied the elements responsible for rendering the interface of our project, the
components. We saw how to create and organize the components in a granular way, resulting in our
project being more maintainable.
We also studied how to communicate between components using the @Input and @Output
attributes, using the capabilities of Angular that facilitate this communication.
We saw the good practice of using TrackBy to iterate lists in templates using the ngFor directive,
improving performance specifically for lists with many items.
Finally, we study the design pattern of the Smart and Presentation components, a way of organizing
components and their interactions in order to simplify this orchestration with a unidirectional
information flow.
In the next chapter, we will study the Angular elements responsible for the business rules and interaction
with the backend – the services.
-- 95 of 270 --
5
Angular Services and
the Singleton Pattern
One of the great differences between a static web page and a single-page application is the processing
capacity and interaction in the user’s browser, giving the feeling of an application installed on the
device. In the Angular framework, the elements for this processing and interaction, not only with the
backend but with the user, are the services.
This element is so important to Angular that the team created a dependency management system,
which allows a simplified way of creating, composing, and using services in components.
In this chapter, we will explore this element and learn about the design patterns it uses and the best
practices to use in your project.
Here we will cover the following topics:
• 	Creating services
• 	Understanding the dependency injection pattern
• 	Communication between components using services
• 	REST API consumption
By the end of the chapter, you will be able to create reusable and maintainable services, in addition
to understanding practices that will improve your productivity.

---

## Technical requirements

To follow the instructions in this chapter, you’ll need the following:
• 	Visual Studio Code (https://code.visualstudio.com/Download)
• 	Node.js 18 or higher (https://nodejs.org/en/download/)
-- 96 of 270 --
Angular Services and the Singleton Pattern	76
The code files for this chapter are available at https://github.com/PacktPublishing/
Angular-Design-Patterns-and-Best-Practices/tree/main/ch5.

---

## Creating services

Services in Angular are TypeScript classes that aim to implement business logic for our interfaces.
Business logic in a frontend project can seem like a controversial issue because ideally, all logic and
processing should take place on the backend, which is correct.
Here we are using business rules; these rules are generic behaviors that do not depend on a visual
component and can be reused in other components.
Examples of frontend business rules could be as follows:
• 	Application state control
• 	Communication with the backend
• 	Information validations with a fixed rule, such as the number of digits in a telephone number
We are going to put this concept into practice, and in our gym diary application, we are going to create
the first service. In the command line we will use the Angular CLI:
ng generate service diary/services/ExerciseSets
Unlike the component, we can see that the element created by the Angular CLI is composed only of
a TypeScript file (and its corresponding unit test file).
In this file, we will see the boilerplate that the Angular CLI generated:
import { Injectable } from '@angular/core';
@Injectable({
providedIn: 'root'
})
export class ExerciseSetsService {
constructor() { }
}
Here we have a TypeScript class called ExerciseSetsService with a decorator called
@Injectable. It is this decorator that characterizes a service in Angular; we will see more details
about it later in this chapter.
Let’s refactor our project and place the initial series of sets for our diary in this service.
-- 97 of 270 --
Creating services 	77
First, we’ll create the methods that will get the initial list and refresh it in the backend:
private setList?: ExerciseSetList;
getInitialList(): ExerciseSetList {
this.setList = [
{ id: 1, date: new Date(), exercise: 'Deadlift', reps: 15, sets: 3
},
{ id: 2, date: new Date(), exercise: 'Squat', reps: 15, sets: 3 },
{ id: 3, date: new Date(), exercise: 'Barbell row', reps: 15,
sets: 3 },
];
return this.setList;
}
refreshList(): ExerciseSetList {
this.setList = [
{ id: 1, date: new Date(), exercise: 'Deadlift', reps: 15, sets: 3
},
{ id: 2, date: new Date(), exercise: 'Squat', reps: 15, sets: 3 },
{ id: 3, date: new Date(), exercise: 'Barbell row', reps: 15,
sets: 3 },
{ id: 4, date: new Date(), exercise: 'Leg Press', reps: 15, sets:
3 },
];
return this.setList;
}
In the service, we move the initialization and refresh of the journal component into the service, using
the getInitialList and refreshList methods.
These methods will be improved when we see the communication with the backend, but here, we are
already decoupling the exercise list management business rule from the component that renders the
user interface, creating a specific service.
Let’s now consider the method that adds an item to the exercise list:
addNewItem(item: ExerciseSet): ExerciseSetList {
if (this.setList) {
this.setList = [...this.setList, item];
} else {
this.setList = [item];
}
return this.setList;
}
-- 98 of 270 --
Angular Services and 

---

## Understanding the dependency injection pattern

In object-oriented software development, it is good practice to prioritize composition over inheritance,
meaning that a class should be composed of other classes (preferably interfaces).
In our previous example, we can see that the service class comprises the DiaryComponent
component. Another way to use this service would be as follows:
. . .
export class DiaryComponent {
private exerciseSetsService: ExerciseSetsService;
exerciseList: ExerciseSetList;
constructor() {
this.exerciseSetsService = new ExerciseSetsService();
-- 99 of 270 --
Understanding the dependency injection pattern 	79
this.exerciseList = this.exerciseSetsService.getInitialList();
}
. . .
}
Here we modify our code, leaving the creation of the service class object expressly in the component’s
constructor method. Running our code again, we can see that the interface remains the same.
This approach, although functional, has some problems, such as the following:
• 	High coupling between the component and the service, which means that we may encounter
problems if we need to change the implementation of the service, for example, for the construction
of unit tests
• 	If the service depends on another class, as we will see with Angular’s HTTP request service, the
HttpClient class, we will have to implement this dependency in our component, increasing
its complexity
To simplify development and solve the problems we’ve described, Angular has a dependency
injection mechanism. This feature allows us to compose a class just by declaring the object we need
in its constructor.
Angular, leveraging TypeScript, will use the types defined in this declaration to assemble the dependency
tree of the class we need and create the object we require.
Let’s return to our code and analyze how this mechanism works:
. . .
export class DiaryComponent {
constructor(private exerciseSetsService: ExerciseSetsService) {}
exerciseList = this.exerciseSetsService.getInitialList();
. . .
}
In the code, we declare the dependency of our class in the constructor, creating the
exerciseSetsService attribute. With this, we can initialize the exerciseList attribute
in its declaration.
In Chapter 10, Design for Tests: Best Practices, we will replace the implementation of this service in the
test runtime. All this is possible thanks to Angular’s dependency injection feature.
From version 14 of Angular, we have an alternative for dependency injection that we can use, which
we will see next.
-- 100 of 270 --
Angular Services and the Singleton Pattern	80
Using the inject() function
The inject() function allows you to use the same dependency injection feature but in a simpler way.
Let’s refactor our component’s code:
import { Component, inject } from '@angular/core';
import { ExerciseSet } from '../interfaces/exercise-set';
import { ExerciseSetsService } from '../services/exercise-sets.
service';
. . .
export class DiaryComponent {
private exerciseSetsService = inject(ExerciseSetsService);
exerciseList = this.exerciseSetsService.ge

---

## Communication between components using services

A characteristic that we must understand about Angular services is that, by default, every service
instantiated by the dependency injection mechanism has the same reference; that is, a new object is
not created, but reused.
-- 101 of 270 --
Communication between components using services 	81
This is because the dependency injection mechanism implements the singleton design pattern to
create and deliver the objects. The singleton pattern is a design pattern of the creational type and
allows the creation of objects whose access will be global in the system.
This characteristic is important for the service because, as the service deal with reusable business
rules, we can use the same instance between components, without having to rebuild the entire
object. In addition, we can take advantage of this characteristic and use services as an alternative for
communication between components.
Let’s change our gym diary so that the ListEntriesComponent component receives the initial
list by service instead of @Input:
export class ListEntriesComponent {
private exerciseSetsService = inject(ExerciseSetsService);
exerciseList = this.exerciseSetsService.getInitialList();
itemTrackBy(index: number, item: ExerciseSet) {
return item.id;
}
}
In the DiaryComponent component, we will remove the list from the input:
<main class="mx-auto mt-8 max-w-6xl px-4">
<app-list-entries />
<app-new-item-button (newExerciseEvent)="addExercise($event)" />
<br />
<br />
<button
class="rounded bg-blue-500 py-2 px-4 font-bold text-white
hover:bg-blue-700"
(click)="newList()"
>
Server Sync
</button>
</main>
Running it again we can see that the list continues to appear. This is because the instance of the service
used in both components is the same. However, this form of communication requires us to use RxJS to
update the values with the buttons on the diary screen. We will go deeper into this topic in Chapter 9,
Exploring Reactivity with RxJS.
We saw that, by default, the services are singleton, but in Angular, it is possible to change this
configuration for another service if you need to solve some corner cases in your application.
-- 102 of 270 --
Angular Services and the Singleton Pattern	82
When we create a service, it has an @Injectable decorator, as in our example:
@Injectable({
providedIn: 'root',
})
export class ExerciseSetsService {
The provideIn metadata determines the scope of the service. The value 'root' means that the
instance of the service will be unique for every application; that’s why, by default, Angular services
are singleton.
To change this behavior, let’s first return to the ListEntriesComponent component to receive
@Input:
export class ListEntriesComponent {
@Input() exerciseList!: ExerciseSetList;
itemTrackBy(index: number, item: ExerciseSet) {
return item.id;
}
}
Let’s go back to inform the attribute in the DiaryComponent component:
<main class="mx-auto mt-8 max-w-6xl px-4">
<app-list-entries [exerciseList]="exerciseList" />
<app-new-item-button (newExerciseEv

---

## Summary

In this chapter, we learned about Angular services and how to correctly isolate the business rule from
our applications in a simple and reusable way, as well as how Angular services use the singleton pattern
for memory and performance optimization.
We worked with and studied Angular’s dependency injection mechanism and noticed how important
it is to be able to organize and reuse services between components and other services. We also learned
how to use the inject function for Angular services as an alternative to dependency injection via
Angular’s constructor.
Finally, we worked with one of the main uses of services, communication with the backend, and in
this chapter, we began to explore the integration of our frontend applications with the backend.
In the next chapter, we will study the best practices for using forms, the main way that our users enter
information into our systems.
-- 108 of 270 --
-- 109 of 270 --
Part 2:
Leveraging Angular’s Capabilities
In this part, you will work with more advanced aspects of Angular and see how you can use the
features of this framework for the most common tasks in your applications. You will learn about best
practices for forms, how to correctly use Angular’s routing mechanism, and finally, how to optimize
API consumption using the Interceptor design pattern and the RxJS library.
This part has the following chapters:
• Chapter 6, Handling User Inputs: Forms
• Chapter 7, Routes and Routers
• Chapter 8, Improving Backend Integrations: the Interceptor Pattern
• Chapter 9, Exploring Reactivity with RXJS
-- 110 of 270 --
-- 111 of 270 --
6
Handling User Inputs: Forms
Since the early days of web applications, before the concept of Single Page Applications (SPAs), in
HTML 2, the <form> tag has been used to create, organize, and send forms to the backend.
In common applications, such as banking systems and health applications, we use forms to organize
the inputs that our users need to perform in our systems. With such a common element in web
applications, it is natural that Angular, a framework whose philosophy is batteries included, offers
this feature to its developers.
In this chapter, we will delve into the following forms features in Angular:
• 	Template-driven forms
• 	Reactive forms
• 	Data validation
• 	Custom validations
• 	Typed reactive forms
By the end of this chapter, you will be able to create maintainable and fluid forms for your user, in
addition to improving your productivity with this type of task.

---

## Technical requirements

To follow the instructions in this chapter, you’ll need the following:
• 	Visual Studio Code (https://code.visualstudio.com/Download)
• 	Node.js 18 or higher (https://nodejs.org/en/download/)
The code files for this chapter are available at https://github.com/PacktPublishing/
Angular-Design-Patterns-and-Best-Practices/tree/main/ch6.
-- 112 of 270 --
Handling User Inputs: Forms	92
During the study of this chapter, remember to run the backend of the application found in the
gym-diary-backend folder with the npm start command.
Template-driven forms
Angular has two different ways of working with forms: template-driven and reactive. First, let’s
explore template-driven forms. As we can see by the name, we maximize the use of the capabilities of
the HTML template to create and manage the data model linked to the form.
We will evolve our Gym Diary application to better exemplify this concept. In the following command
line, we use the Angular CLI to create the new page component:
ng g c diary/new-entry-form-template
To access the new assignment form, we’ll refactor the journal page component so the Add New Entry
button takes the user to the component we created.
Let’s add to the DiaryModule module the import of the framework module responsible for managing
the application’s routes:
. . .
import { RouterModule } from '@angular/router';
@NgModule({
declarations: [
DiaryComponent,
EntryItemComponent,
ListEntriesComponent,
NewItemButtonComponent,
NewEntryFormTemplateComponent,
],
imports: [CommonModule, DiaryRoutingModule, RouterModule],
})
export class DiaryModule {}
With the RouterModule module imported, we will be able to use Angular’s route services. For
more details on routing, see Chapter 7, Routes and Routers. We will add the new component to a route
in the DiaryRoutingModule module:
. . .
import { NewEntryFormTemplateComponent } from './new-entry-form-
template/new-entry-form-template.component';
const routes: Routes = [
{
-- 113 of 270 --
Template-driven forms 	93
path: '',
component: DiaryComponent,
},
{
path: 'new-template',
component: NewEntryFormTemplateComponent,
},
];
@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule],
})
export class DiaryRoutingModule {}
To be able to compare the two form creation approaches, we will create a route for each example
component that we are going to create. Here, the URL /home/new-template will direct us to
the template-driven form route.
We will now refactor DiaryComponent to modify the behavior of the Add New Entry button:
. . .
import { Router } from '@angular/router';
@Component({
templateUrl: './diary.component.html',
styleUrls: ['./diary.component.css'],
})
export class DiaryComponent implements OnInit {
private exerciseSetsService = inject(ExerciseSetsService);
private router = inject(Router)
. . .
addExercise(newSet: ExerciseSet) {
this.router.navigate(['/home/new-template'])
}
. . .
}
First, we need to inject Angular’s router service.We change the addExercise method to use the

---

## Reactive forms

Reactive forms use a declarative and explicit approach to creating and manipulating form data. Let’s
put this concept into practice by creating a new form for our project.
First, on the command line, let’s use the Angular CLI to generate the new component:
ng g c diary/new-entry-form-reactive
In the same way as we did with the template-driven form, let’s add this new component to the
DiaryRoutingModule routing module:
import { NewEntryFormReactiveComponent } from './new-entry-form-
reactive/new-entry-form-reactive.component';
const routes: Routes = [
{
path: '',
component: DiaryComponent,
},
-- 118 of 270 --
Handling User Inputs: Forms	98
{
path: 'new-template',
component: NewEntryFormTemplateComponent,
},
{
path: 'new-reactive',
component: NewEntryFormReactiveComponent,
},
];
In the DiaryModule module, we need to add the ReactiveFormsModule module responsible
for all the functionality that Angular makes available to us for this type of form:
@NgModule({
declarations: [
. . .
],
imports: [
. . .
ReactiveFormsModule,
],
})
To finalize the component’s route, let’s change the main screen of our application, replacing the route
that the New Entry button will call:
addExercise(newSet: ExerciseSet) {
this.router.navigate(['/home/new-reactive']);
}
We will now start creating the reactive form. First, let’s configure the component elements in the
new-entry-form-reactive.component.ts TypeScript file:
export class NewEntryFormReactiveComponent implements OnInit {
public entryForm!: FormGroup;
private formBuilder = inject(FormBuilder);
ngOnInit() {
this.entryForm = this.formBuilder.group({
date: [''],
exercise: [''],
sets: [''],
reps: [''],
});
}
}
-- 119 of 270 --
Reactive forms 	99
Note that the first attribute is entryForm of type FormGroup. It will represent our form—not just
the data model, but the whole form—as validations, field structure, and so on.
Then, we inject the FormBuilder service responsible for assembling the entryForm object. Note
the name of the service that Angular uses from the Builder design pattern, which has the objective
of creating complex objects, such as a reactive form.
To initialize the entryForm attribute, we’ll use the onInit component lifecycle hook. Here, we’ll
use the group method to define the form’s data model. This method receives the object, and each
attribute receives an array that contains the characteristics of that attribute in the form. The first
element of the array is the initial value of the attribute.
In the component’s template, we will create the structure of the form, which, in relation to the template-
driven form example, is very similar:
<div class="flex h-screen items-center justify-center bg-gray-200">
<form
[formGroup]="entryForm"
>
<input
type="date"
id="date"
name="date"
formControlName="date"
/>
<input
type="text"
id="exercise"
name="exercise"
formControlName="exercise"
/>
<input
type="number"
id="sets"
name="sets"
formControlName="sets"
/>
<input
type="number"
id="reps"
name="reps"
formControlNam

---

## Data validation

A good UX practice is to validate the information that users enter in the form as soon as it leaves
the filled field. This minimizes user frustration while improving the information that will be sent to
the backend.
Using reactive forms, we can use utility classes created by the Angular team to add
validations that are commonly used in forms. Let’s improve our project, first in the
NewEntryFormReactiveComponent component:
. . .
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
. . .
export class NewEntryFormReactiveComponent implements OnInit {
. . .
ngOnInit() {
this.entryForm = this.formBuilder.group({
date: ['', Validators.required],
exercise: ['', Validators.required],
sets: ['', [Validators.required, Validators.min(0)]],
reps: ['', [Validators.required, Validators.min(0)]],
});
-- 122 of 270 --
Handling User Inputs: Forms	102
}
newEntry() {
if (this.entryForm.valid) {
const newEntry = { ...this.entryForm.value };
this.exerciseSetsService
.addNewItem(newEntry)
.subscribe((entry) => this.router.navigate(['/home']));
}
}
}
In the preceding example, we are importing the Validators package from Angular that will
provide the utility class for the basic validations of our report. In the ngOnInit method where
we create the reactive form object, the validations are in the second position of the array that defines
the form’s fields.
We use the required validation in all fields of the form, and in the sets and reps fields, we add
another validation to guarantee that the number is positive. To add more than one validation, we can
add another array with the validations.
Another change we made to our component is that it now checks whether the form is valid before
starting the interaction with the backend. We do this by checking the valid attribute of the object.
Angular automatically updates this field as the user enters data.
In the template file, let’s add the error messages for the user:
<div
*ngIf="entryForm.get('date')?.invalid && entryForm.get('date')?.
touched"
class="mt-1 text-red-500"
>
Date is required.
</div>
<div
*ngIf="
entryForm.get('exercise')?.invalid &&
entryForm.get('exercise')?.touched
"
class="mt-1 text-red-500"
>
Exercise is required.
</div>
. . .
-- 123 of 270 --
Data validation 	103
<div
*ngIf="entryForm.get('sets')?.invalid && entryForm.get('sets')?.
touched"
class="mt-1 text-red-500"
>
Sets is required and must be a positive number.
</div>
<div
*ngIf="entryForm.get('reps')?.invalid && entryForm.get('reps')?.
touched"
class="mt-1 text-red-500"
>
Reps is required and must be a positive number.
</div>
<button
type="submit"
[disabled]="entryForm.invalid"
[class.opacity-50]="entryForm.invalid"
>
Add Entry
</button>
To show validation in the template, we use div elements with the message we want. To decide whether
or not the message will appear, we use the ngIf directive, checking the status of the field.
For this, we first get the field using the GET method and check the following two properties:
• 	The invalid prop

---

## Custom validations

We can expand the use of validations and create custom functions that can even receive parameters to
maximize reuse in our projects. To illustrate this, let’s create a custom validation to evaluate whether
the number of repetitions or sets are multiples of two and three, respectively.
Let’s create a new file called custom-validation.ts and add the following function:
import { AbstractControl, ValidationErrors, ValidatorFn } from '@
angular/forms';
export function multipleValidator(multiple: number): ValidatorFn {
return (control: AbstractControl): ValidationErrors | null => {
const isNotMultiple = control.value % multiple !== 0;
return isNotMultiple ? { isNotMultiple: { value: control.value } }
: null;
-- 125 of 270 --
Custom validations 	105
};
}
For Angular to recognize the form validation function, it must return a new function with the
signature described in the ValidatorFn interface. This signature defines that it will receive
AbstractControl and must return an object of type ValidationErrors that allows the
template to interpret the new type of validation.
Here, we get the input value using control.value, and if it is not a multiple of three, we will
return the error object. Otherwise, we will return null, which will indicate to Angular that the
value is correct.
To use this function, we are going to refactor our form component as follows:
. . .
ngOnInit() {
this.entryForm = this.formBuilder.group({
date: ['', Validators.required],
exercise: ['', Validators.required],
sets: [
'',
[Validators.required, Validators.min(0), multipleValidator(2)],
],
reps: [
'',
[Validators.required, Validators.min(0), multipleValidator(3)],
],
});
}
. . .
To use our custom function, we import it from the new file we created and use it in the validation
array in the construction of the form object in the same way as standard Angular validations.
Finally, let’s change the form template to add the error message:
. . .
<div
*ngIf="
entryForm.get('sets')?.errors?.['isNotMultiple'] &&
entryForm.get('sets')?.touched
"
class="mt-1 text-red-500"
>
sets is required and must be multiple of 2.
-- 126 of 270 --
Handling User Inputs: Forms	106
</div>
. . .
<div
*ngIf="
entryForm.get('reps')?.errors?.['isNotMultiple'] &&
entryForm.get('reps')?.touched
"
class="mt-1 text-red-500"
>
Reps is required and must be multiple of 3.
</div>
. . .
We include the new div elements, but to specifically validate the error of multiples of the input,
we use the error attribute and in it the new isNotMultiple attribute of our custom function.
We are using this parameter in square brackets because it is defined at runtime and Angular will warn
at compile time that it does not exist.
Running our project, we can see the new validations:
Figure 6.4 – Gym Diary Form UI custom validations
-- 127 of 270 --
Typed reactive forms 	107
In addition to validations, reactive forms from version 14 of Angular can be better typed to ensure
higher productivity and security in the development of your project. We

---

## Typed reactive forms

In our project, if we look at the types of objects and values, we can see that they are all of the any
type. Although functional, it is possible to improve this development experience by better using
TypeScript’s type checking.
Let’s refactor our code in the component as follows:
export class NewEntryFormReactiveComponent {
private formBuilder = inject(FormBuilder);
private exerciseSetsService = inject(ExerciseSetsService);
private router = inject(Router);
public entryForm = this.formBuilder.group({
date: [new Date(), Validators.required],
exercise: ['', Validators.required],
sets: [0, [Validators.required, Validators.min(0),
multipleValidator(2)]],
reps: [0, [Validators.required, Validators.min(0),
multipleValidator(3)]],
});
newEntry() {
if (this.entryForm.valid) {
const newEntry = { ...this.entryForm.value };
this.exerciseSetsService
.addNewItem(newEntry)
.subscribe((entry) => this.router.navigate(['/home']));
}
}
}
We moved the creation of the form object to the construction of the component and set the initialization
of the fields with the types that will be accepted by the API. Using Visual Studio Code’s IntelliSense, we
can see that Angular infers the types and now we have an object very close to the ExerciseSet type.
With this change, however, the addNewItem method threw an error, which is actually a good thing,
as it means that we are now using TypeScript’s type checking to discover possible bugs that could only
appear at runtime. To resolve this issue, we first need to change the service to receive an object that
can contain some of the attributes of ExerciseSet.
-- 128 of 270 --
Handling User Inputs: Forms	108
In the service, change the addNewItem method:
addNewItem(item: Partial<ExerciseSet>): Observable<ExerciseSet> {
return this.httpClient.post<ExerciseSet>(this.url, item);
}
Here, we use the Partial type of TypeScript to inform the function that it can receive an object
with part of the interface attributes. Returning to our component, we can see that it still has an error.
This happens because it can receive null values in the form’s attributes.
To resolve this, let’s change the FormBuilder service to the NonNullableFormBuilder type
as follows:
export class NewEntryFormReactiveComponent {
. . .
private formBuilder = inject(NonNullableFormBuilder);
. . .
}
With this change, Angular itself performs this verification. The only requirement is that all the form
fields are initialized, which we have already done here.
With that, we have our reactive form working and can now use TypeScript’s type-checking more effectively!

---

## Summary

In this chapter, we explored Angular forms and how to use them to improve our user experience and
our team’s productivity. We learned how to use template forms for simpler requirements and explored
how Angular performs the binding between the HTML and the data model using the ngModel object.
We also work with reactive forms, which opens up many possibilities for creating and manipulating
forms. Regarding reactive forms, we studied how to apply validations to fields and how to create our
own custom validation functions. Finally, we refactored our reactive form to use TypeScript type
checking using typed forms.
In the next chapter, we will explore Angular’s routing mechanism and the possibilities it can have for
our applications.
-- 129 of 270 --
7
Routes and Routers
A single-page application (SPA) is one in which the user originally receives only one index.html
page and, from there, all the content of the web application is rendered using JavaScript.
From the user’s perspective, however, they are interacting with the application on different interfaces
(or pages) such as the login screen, the home page, and the purchase form. Technically, they are all
rendered on the index.html page but, for the user, they are different experiences.
The mechanism responsible for this flow of interfaces that the client interacts with in a SPA is the
routing engine. The Angular framework has this feature out of the box and, in this chapter, we will
explore it in detail.
We will cover the following topics in this chapter:
• 	Routes and navigation
• 	Defining an error page and title
• 	Dynamic routes – wildcards and parameters
• 	Securing routes – guards
• 	Optimizing the experience – Resolve
By the end of the chapter, you will be able to use Angular’s routing mechanisms to create navigation
flows that will improve your users’ experience.

---

## Technical requirements

To follow the instructions in this chapter, you’ll need the following:
• 	Visual Studio Code (https://code.visualstudio.com/Download)
• 	Node.js 18 or higher (https://nodejs.org/en/download/)
-- 130 of 270 --
Routes and Routers	110
The code files for this chapter are available at https://github.com/PacktPublishing/
Angular-Design-Patterns-and-Best-Practices/tree/main/ch7.
While following this chapter, remember to run the backend of the application found in the gym-diary-
backend folder with the npm start command.

---

## Routes and navigation

Let’s improve our project by creating a home page with a simplified menu for our interface, thereby
exploring the possibilities we can have with Angular routes. In the command line, we’ll use the Angular
CLI to create a new module and the component page:
ng g m home --routing
In the preceding snippet, we first create a new module, and by using the --routing parameter, we
instruct the Angular CLI to create the module along with the routing file. The following command
creates the component we are working on:
ng g c home
For more details about the Angular CLI and modules, you can refer to Chapter 2, Organizing
Your Application.
First, let’s create the template in the HTML file of the component we just created:
<div class="flex h-screen">
<aside class="w-1/6 bg-blue-500 text-white">
<nav class="mt-8">
<ul class="flex flex-col items-center space-y-4">
<li>
<a class="flex items-center space-x-2 text-white">
<span>Diary</span>
</a>
</li>
<li>
<a class="flex items-center space-x-2 text-white">
<span>New Entry</span>
</a>
</li>
</ul>
</nav>
</aside>
<main class="flex-1 bg-gray-200 p-4">
<router-outlet></router-outlet>
</main>
</div>
-- 131 of 270 --
Routes and navigation 	111
In this template example, we are using the <aside> and <main> HTML elements to create the
menu and the area where the selected pages will be projected. For this purpose, we are using the
<router-outlet> directive to indicate the correct area to Angular.
To make the home page the main page, we need to modify the main routing module of our application
in the app-routing.module.ts file:
. . .
const routes: Routes = [
{ path: '', pathMatch: 'full', redirectTo: 'home' },
{
path: 'home',
loadChildren: () =>
import('./home/home.module').then((file) => file.HomeModule),
},
];
. . .
export class AppRoutingModule {}
The routes array is the main element of the Angular routing mechanism. We define objects in it that
correspond to the routes our users will have access to. In this example, we defined that the root route
("/") of our application will redirect the user to the home route using the redirectTo property.
Here, we should use the pathMatch property with the "full" value. This is because it determines
whether the Angular route engine will match the first route that matches the pattern (the default
behavior, which is "prefix"), or whether it will match the entire route.
In the second object, we are defining the home route and loading the Home module lazily. For more
details about lazy loading, you can refer to Chapter 2, Organizing Your Application.
When running our application, we have the menu and the area where the pages of our workout diary
will be displayed.
To include the workout diary on the home page, we need to modify the HomeRoutingModule module:
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
const routes: Routes = [
{
path: '',
component: HomeComponent,
children: [
{
path: 'diary'

---

## Defining an error page and title

In our current project, if the user enters a path that does not have a mapped route, they will be faced
with a blank screen. This is not a good user experience (UX) practice; ideally, we need to handle this
error by presenting an error page for it to be redirected to the correct page.
First, let’s create the component using the Angular CLI:
ng generate component ErrorPage
Here, we are creating the component directly in AppModule because we want to give this treatment
to our entire system and not to a specific functional module.
Let’s create the template for this component with the error message:
<div class="flex h-screen flex-col items-center justify-center">
<h1 class="mb-4 text-6xl font-bold text-red-500">Oops!</h1>
<h2 class="mb-2 text-3xl font-bold text-gray-800">Looks like you're
lost!</h2>
-- 134 of 270 --
Routes and Routers	114
<p class="mb-6 text-gray-600">
We couldn't find the page you're looking for.
</p>
<p class="text-gray-600">
But don't worry! Go back to the Gym Diary and continue your
progress!
</p>
<a
routerLink="/home"
class="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white
hover:bg-blue-600"
>
Go back to the Gym Diary
</a>
</div>
Note that we have the link to the home page as a call to action for the user to return to the home page.
The next step is to update the AppRoutingModule routes file:
. . .
import { ErrorPageComponent } from './error-page/error-page.
component';
const routes: Routes = [
{ path: '', pathMatch: 'full', redirectTo: 'home' },
{
path: 'home',
loadChildren: () =>
import('./home/home.module').then((file) => file.HomeModule),
},
{ path: 'error', component: ErrorPageComponent },
{ path: '**', redirectTo: '/error' },
];
. . .
At this point, Angular will do its job. Just by defining the error page route and then creating another
entry in the array, we have defined the '**' path and redirected it to the error route.
-- 135 of 270 --
Defining an error page and title 	115
When we run our project, if the user enters an incorrect page, the following message will be displayed:
Figure 7.2 – Incorrect route error page
Another point that we can improve in our application is the title of the page in the Browser tab.
For this, we can once again use Angular’s routing mechanisms. In DiaryRoutingModule, we
need to change the following code snippet:
. . .
const routes: Routes = [
{
path: '',
component: DiaryComponent,
title: 'Diary',
},
{
path: 'new-template',
component: NewEntryFormTemplateComponent,
},
{
path: 'new-reactive',
component: NewEntryFormReactiveComponent,
title: 'Entry Form',
},
];
. . .
To change the title, we just need to inform the title property in the route definition. Another
approach that is possible (but longer) is to use Angular’s Title service.
-- 136 of 270 --
Routes and Routers	116
Let’s exemplify this in the NewEntryFormTemplateComponent component:
import { Title } from '@angular/platform-browser';
. . .
export class NewEntryFormTemplateComponent implements OnInit {
. . .
private titleService = i

---

## Edit

</button>
. . .
We will also adjust the ListEntriesComponent component to properly propagate editEvent:
export class ListEntriesComponent {
@Input() exerciseList!: ExerciseSetList;
@Output() editEvent = new EventEmitter<ExerciseSet>();
@Output() deleteEvent = new EventEmitter<string>();
. . .
}
<app-entry-item
[exercise-set]="item"
(deleteEvent)="deleteEvent.emit($event)"
(editEvent)="editEvent.emit($event)"
/>
We’ll make a small change to the diary to reflect the new route. We’ll do this in the template first:
<app-list-entries
[exerciseList]="exerciseList"
(deleteEvent)="deleteItem($event)"
(editEvent)="editEntry($event)"
/>
-- 139 of 270 --
Dynamic routes – wildcards and parameters 	119
In the component, we will change the newRep method, which, in addition to the name change, will
redirect to the new route:
addExercise(newSet: ExerciseSet) {
this.router.navigate(['/home/diary/entry']);
}
deleteItem(id: string) {
this.exerciseSetsService.deleteItem(id).subscribe();
}
editEntry(updateSet: ExerciseSet) {
const id = updateSet.id ?? '';
this.router.navigate([`/home/diary/entry/${id}`]);
}
To redirect to the new route, we are doing string interpolation to include id that was emitted by the output of
the list item. Finally, let’s focus our attention on the form. In the NewEntryFormReactiveComponent
component, let’s adjust the button label in the template:
<button
type="submit"
[disabled]="entryForm.invalid"
[class.opacity-50]="entryForm.invalid"
class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-
blue-700"
>
Add Entry
</button>
In the NewEntryFormReactiveComponent component, we will adapt it to now be the form
for creating and editing entries in our application:
. . .
export class NewEntryFormReactiveComponent implements OnInit {
. . .
private route = inject(ActivatedRoute);
private entryId?: string | null;
. . .
ngOnInit(): void {
this.entryId = this.route.snapshot.paramMap.get('id');
if (this.entryId) {
this.exerciseSetsService
.getItem(this.entryId)
.subscribe((entry) => this.updateForm(entry));
}
}
-- 140 of 270 --
Routes and Routers	120
updateForm(entry: ExerciseSet): void {
let { id: _, ...entryForm } = entry;
this.entryForm.setValue(entryForm);
}
. . .
}
In the example, we use the OnInit lifecycle hook to configure the form according to the route it was
called. For this, Angular has a service called ActivatedRoute.
In the ngOnInit method, we capture the parameter of the route that called our application and, if
the component receives the ID, it will fetch the entry from the backend and update the form according
to the return.
One detail here is that we are using the destructuring assignment to remove the id field from the
object because it does not exist in the form’s data model.
In the same component, we need to change the recording of the diary entry:
newEntry() {
if (this.entryForm.valid) {
const newEntry = { ...this.entryForm.value };
if (this.entryId) {
this.exerciseSetsService
.updateItem(this.entryId, newEntry)
.subscrib

---

## Summary

In this chapter, we worked with routes and their resources to guide and organize user flows in our
application. We learned about the router concept in the Angular framework and created an error page
in case a user uses a route that does not exist. We created our edit diary entry page by reusing a form
and, with the dynamic route feature, we learned how to capture route data for page setup.
Finally, we learned about the route guards feature, created our simplified login flow, and saw how to
optimize the user experience by loading the backend information before the page loads using the
guard resolve feature.
In the next chapter, we will learn how to use a resource to streamline our requests to the backend
using the interceptor design pattern.
-- 152 of 270 --
-- 153 of 270 --
8
Improving Backend
Integrations: the Interceptor

---

## Pattern

In a single-page application (SPA), communication with the backend is one of the most common
tasks. In Chapter 5, Angular Services and the Singleton Pattern, we learned that the Angular component
that makes this communication is called Service. However, many side tasks are common to all
communications with the backend, such as header processing, authentication, and loading.
We could do this sides task on a service-by-service basis, but in addition to being an unproductive
activity, the team might not be able to implement some control on the request due to the carelessness
or ignorance of a new member of the team.
In order to simplify the development of side tasks for communicating with the backend, the Angular
framework implements the interceptor design pattern, which we will explore in this chapter. Here,
we will cover the following topics:
• 	Attaching the token to the request with an interceptor
• 	Changing the request route
• 	Creating a loader
• 	Notifying success
• 	Measuring the performance of a request
By the end of this chapter, you will be able to create interceptors capable of implicitly performing tasks
necessary for your backend communication.
-- 154 of 270 --
Improving Backend Integrations: the Interceptor Pattern	134

---

## Technical requirements

To follow the instructions in this chapter, you’ll need the following:
• 	Visual Studio Code (https://code.visualstudio.com/Download)
• 	Node.js 18 or higher (https://nodejs.org/en/download/)
The code files for this chapter are available at https://github.com/PacktPublishing/
Angular-Design-Patterns-and-Best-Practices/tree/main/ch8.
While following this chapter, remember to run the backend of the application found in the gym-diary-
backend folder with the npm start command.

---

## Attaching the token to the request with an interceptor

So far, our backend doesn’t have any kind of authentication control, which doesn’t happen (or at least
it shouldn’t happen) in the real world. The backend was modified to perform authentication, but this
was reflected in the frontend because, if we tried to log in, the following error would occur:
ERROR Error: Uncaught (in promise): HttpErrorResponse:
{"headers":{"normalizedNames":{},"lazyUpdate":null},"status":401,"sta-
tusText":"Unauthorized","url":"http://localhost:3000/diary","ok":-
false,"name":"HttpErrorResponse","message":"Http failure response
for http://localhost:3000/diary: 401 Unauthorized","error":{"mes-
sage":"Unauthorized","statusCode":401}}
This error means that our request was rejected by the server because it was not authorized. That’s because
our server implements a very common form of security that consists of asking for an authorization
token in every request.
This token is created when the user logs in to the application and it must be passed in the header of
the HTTP request.
We’ll fix this problem first by making a change to the AuthService service:
export class AuthService {
private httpClient = inject(HttpClient);
private url = 'http://localhost:3000/auth/login';
#token?: Token;
login(loginForm: Partial<LoginForm>): Observable<Token> {
return this.httpClient
.post<Token>(this.url, loginForm)
.pipe(tap((token) => (this.#token = token)));
}
get isLogged() {
-- 155 of 270 --
Attaching the token to the request with an interceptor 	135
return this.#token ? true : false;
}
logout() {
this.#token = undefined;
}
get token() {
return this.#token?.access_token;
}
}
First, we change the access mode of the token attribute. We are using the # symbol, which is the
way to declare a private attribute in standard JavaScript. We want the token to be read by the
other component but never overwritten, and using the token ensures that this happens even if the
consumer class forces manipulation.
We change the class to the new attribute name and, at the end, we create the token() accessor
method to return the token stored by the service.
We’ll refactor the ExerciseSetsService service to send the token in the request that returns
the diary items:
. . .
private authService = inject(AuthService);
private url = 'http://localhost:3000/diary';
getInitialList(): Observable<ExerciseSetListAPI> {
const headers = new HttpHeaders({
Authorization: `Bearer ${this.authService.token}`,
});
return this.httpClient.get<ExerciseSetListAPI>(this.url, { headers
});
}
. . .
Here, we create a header using the accessory class of Angular, HttpHeaders, passing the token
in the Authorization attribute. Then, we pass this header in the get method of Angular’s
HttpClient service.
-- 156 of 270 --
Improving Backend Integrations: the Interceptor Pattern	136
When we run our application again, it works again (Username is mario, and Password is 1234):
Figure 8.1 – Gym diary home page
This approach has a problem, as we would need to replicate this operation for all of the servic

---

## Changing the request route

In our project so far, we have two services that make requests to the backend. If we analyze them, we
see that they both point directly to the backend URL. This is not a good practice since, as the project
scales and grows in complexity, errors can occur by pointing to the wrong URL. In addition to the
need to change the host, we will need to change numerous files.
There are a few ways to handle this problem, but a very useful tool for this is the Angular interceptor.
Let’s see it in practice starting with the Angular CLI, where we are going to create the new interceptor:
ng g interceptor shared/host
With the generated file, let’s create the intercept function:
@Injectable()
export class HostInterceptor implements HttpInterceptor {
intercept(
request: HttpRequest<unknown>,
next: HttpHandler
): Observable<HttpEvent<unknown>> {
const url = 'http://localhost:3000';
const resource = request.url;
if (request.url.includes('http')) {
return next.handle(request);
}
const urlsReq = request.clone({
url: `${url}/${resource}`,
});
return next.handle(urlsReq);
}
}
-- 160 of 270 --
Improving Backend Integrations: the Interceptor Pattern	140
In this function, we have the URL of the backend and, in the resource variable, we receive the
original URL of the request that we want to intercept and modify. We use an if statement next because
we want to avoid errors in case some service needs to call another API directly.
Finally, we create a new request object (this time, with the URL changed) and we pass this new object to
the request flow. For this interceptor to be triggered by Angular, we need to add it to the providers
array of the AppModule module:
@NgModule({
declarations: [AppComponent, ErrorPageComponent],
imports: [BrowserModule, AppRoutingModule, HttpClientModule],
providers: [
{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:
true },
{ provide: HTTP_INTERCEPTORS, useClass: HostInterceptor, multi:
true },
],
bootstrap: [AppComponent],
})
export class AppModule {}
We will refactor our service to only care about the features they need, starting with the
ExerciseSetsService service:
export class ExerciseSetsService {
private httpClient = inject(HttpClient);
private url = 'diary';
. . .
}
We follow this with the Authentication service:
export class AuthService {
private httpClient = inject(HttpClient);
private url = 'auth/login';
. . .
}
We can see that if we needed new services or changed the URL, the HTTP requests would not need
to be refactored, as we created an interceptor to work on that.
Next, we’ll learn how to give our users a better experience if a request takes too long.
-- 161 of 270 --
Creating a loader 	141

---

## Creating a loader

In a frontend project, performance is not only about having faster requests but also improving the
user’s perception of the application. A blank screen without any feedback signals to the user that the
page did not load, that their internet is having a problem, or any other type of negative perception.
That’s why we always need to signal that the action the user expects is being performed. One way to
show this is a loading indicator, and that’s what we’re going to do in this session. In the command line
of our operating system, we will use the Angular CLI:
ng generate component loading-overlay
ng generate service loading-overlay/load
ng generate interceptor loading-overlay/load
With that, we created the overlay component, the service that will control the loading state, and
the interceptor that will control the beginning and end of the loading based on HTTP requests.
L e t ’s c r e a t e t h e l o a d i n g o v e r l a y s c r e e n i n t h e H T M L t e m p l a t e o f t h e
LoadingOverlayComponent component:
<div class="fixed inset-0 flex items-center justify-center bg-gray-800
bg-opacity-75 z-50">
<div class="text-white text-xl">
Loading...
</div>
</div>
We will implement the LoadService service, which will maintain and control the loading state:
@Injectable({
providedIn: 'root',
})
export class LoadService {
#showLoader = false;
showLoader() {
this.#showLoader = true;
}
hideLoader() {
this.#showLoader = false;
}
get isLoading() {
return this.#showLoader;
}
}
-- 162 of 270 --
Improving Backend Integrations: the Interceptor Pattern	142
We create two methods to turn the loading state on and off and a property to expose this state.
In the load interceptor, we will implement the following:
@Injectable()
export class LoadInterceptor implements HttpInterceptor {
private loadService = inject(LoadService);
intercept(
request: HttpRequest<unknown>,
next: HttpHandler
): Observable<HttpEvent<unknown>> {
if (request.headers.get('X-LOADING') === 'false') {
return next.handle(request);
}
this.loadService.showLoader();
return next
.handle(request)
.pipe(finalize(() => this.loadService.hideLoader()));
}
}
The intercept method starts by turning on the loading state and returning requests without
modifying anything in them.
However, in the flow of the request, we placed the finalize operator from RxJs, which has the
characteristic of executing a function when an observable arrives in the complete state – here, turning
off the loading state. For more details about RxJS, read Chapter 9, Exploring Reactivity with RxJS.
To activate the interceptor, we will add it to AppModule:
@NgModule({
declarations: [AppComponent, ErrorPageComponent,
LoadingOverlayComponent],
imports: [BrowserModule, AppRoutingModule, HttpClientModule],
providers: [
{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi:
true },
{ provide: HTTP_INTERCEPTORS, useClass: HostInterceptor, multi:
true },
{ provide: HTTP_INTERCEPTORS, useClass: LoadInterceptor, multi:
true },
],
bootstrap: [Ap

---

## Notifying success

In addition to the loading screen to inform the user that the system is looking for the information
they want, it is important to notify the user after processing an item. We can handle this notification
directly from the service or component, but we can also implement it generically and implicitly
using interceptors.
We will refactor our application to add this treatment. But first, let’s install a library to show the
toaster component on the screen with an animation. In the command line of our operating system,
we will use the following command in the main folder of our frontend project:
npm install ngx-toastr
In order for the package to work, we need to add our CSS to our project by editing the angular.
json file:
. . .
"build": {
. . .
"assets": [
"src/favicon.ico",
"src/assets"
],
"styles": ["src/styles.css", "node_modules/ngx-toastr/toastr.
css"],
. . .
},
For the toaster animations to work, we need to change the AppModule module:
imports: [
BrowserAnimationsModule,
AppRoutingModule,
HttpClientModule,
ToastrModule.forRoot(),
],
In the main module of our application, we are adding the ToastrModule module from the library
and changing BrowserModule to BrowserAnimationsModule, which adds Angular animation
services used by the library.
With the new package configured, we can proceed with creating the new interceptor using the
Angular CLI:
ng interceptor notification/notification
-- 165 of 270 --
Notifying success 	145
With the interceptor created, we will change the file with the treatment for the notification:
. . .
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class NotificationInterceptor implements HttpInterceptor {
private toaster = inject(ToastrService);
intercept(
request: HttpRequest<unknown>,
next: HttpHandler
): Observable<HttpEvent<unknown>> {
return next.handle(request).pipe(
tap((event: HttpEvent<any>) => {
if (event instanceof HttpResponse && event.status === 201) {
this.toaster.success('Item Created!');
}
})
);
}
}
As in the Creating a loader section, we are using the fact that the request is treated as a flow to use
RxJS and its observables to verify the request’s characteristics. We are using the tap operator, which
aims to perform side effects on the request without changing it.
This operator will execute an anonymous function that will check the HTTP event, which brings us
to an interesting point. As we are interested in the return of the request, we only select the event of
type HttpResponse and the event code is 201-Created.
When we develop an interceptor, we have to remember that it is called in the request and the response,
so it is important to use conditionals to execute what we need when we need it.
The last point we need to configure is the main AppModule module:
providers: [
. . .
{
provide: HTTP_INTERCEPTORS,
useClass: NotificationInterceptor,
multi: true,
},
. . .
]
-- 166 of 270 --
Improving Backend Integrations: the Interceptor Pattern	146
Running our project and creating an entry, we notice th

---

## Measuring the performance of a request

As a development team, we must always seek to offer the best experience for our users, and, in addition
to developing quality products, we must allow the application to be monitored to maintain quality
during production.
There are several tools available on the market, and many of them need some level of instrumentation
to accurately measure the user experience. We will develop a simpler telemetry example, but it can be
applied to the monitoring tool your team uses.
Using the Angular CLI, we will create a new interceptor:
ng g interceptor telemetry/telemetry
In the file generated by the Angular CLI, we will develop our interceptor:
@Injectable()
export class TelemetryInterceptor implements HttpInterceptor {
intercept(
request: HttpRequest<unknown>,
next: HttpHandler
): Observable<HttpEvent<unknown>> {
-- 167 of 270 --
Measuring the performance of a request 	147
if (request.headers.get('X-TELEMETRY') !== 'true') {
return next.handle(request);
}
const started = Date.now();
return next.handle(request).pipe(
finalize(() => {
const elapsed = Date.now() - started;
const message = `${request.method} "${request.urlWithParams}"
in ${elapsed} ms.`;
console.log(message);
})
);
}
}
To illustrate the ability to customize an interceptor, we agree that telemetry will only be used if the
request made has a custom header called X-TELEMETRY, and right at the beginning of the function,
we do this verification.
As we did in the loader example, we used the finalize operator to measure the performance of
the request in a simplified way and presented it in console.log. You could put your telemetry
provider call or even your custom backend here.
To exemplify, we use console.log to show the information. As in the other sections, we need to
configure the interceptor in the main AppModule module:
. . .
providers: [
. . .
{
provide: HTTP_INTERCEPTORS,
useClass: TelemetryInterceptor,
multi: true,
},
],
. . .
Finally, in the ExerciseSetsService service, we will send the customized header to carry out
the telemetry of this request only:
. . .
getInitialList(): Observable<ExerciseSetListAPI> {
const headers = new HttpHeaders().set('X-TELEMETRY', 'true');
return this.httpClient.get<ExerciseSetListAPI>(this.url, { headers
});
-- 168 of 270 --
Improving Backend Integrations: the Interceptor Pattern	148
}
. . .
Header passing is a way to configure an interceptor to behave differently depending on the situation.
Running our project, we can see the messages in the browser log:
GET "http://localhost:3000/diary" in 5 ms. telemetry.interceptor.
ts:25:16
With this development, HTTP requests with the configured header will be logged in console.log.
You can replace this interceptor with an integration to a telemetry service, improving the monitoring
of your application.

---

## Summary

In this chapter, we explored the interceptor feature in Angular and the possibilities that this feature
can give our team. We learned how to attach the authentication token to the requests without having
to change all the services in our project. We also worked on changing the URL of the request, making
our project more flexible to its execution environment.
We also improved our users’ experience by creating a loader in case their internet is slow and notifying
them on the screen when a new entry is registered in their gym diary. Finally, we created a simple
example of telemetry using a custom header to give the team the ability to select which requests are
telemetry capable.
In the next chapter, we’ll explore RxJS, the most powerful library in the Angular utility belt.
-- 169 of 270 --
9
Exploring Reactivity with RxJS
In a web application, one of the most challenging tasks is dealing with the asynchronous nature of the
web. An application cannot predict when events such as requests to the backend, changing routes,
and simple user interactions will happen. Imperative programming in these cases is more complex
and susceptible to errors.
The RxJS library that makes up the Angular ecosystem aims to make controlling asynchronous flows
simpler using declarative and reactive programming.
In this chapter, we will cover the following topics:
• 	Observables and operators
• 	Handling data – transformation operators
• 	Another way to subscribe – the async pipe
• 	Connecting information flows – high-order operators
• 	Optimizing data consumption – filter operators
• 	How to choose the correct operator
By the end of the chapter, you will be able to create better experiences for your users by integrating
their actions with backend requests.

---

## Technical requirements

To follow the instructions in this chapter, you’ll need the following:
• 	Visual Studio Code (https://code.visualstudio.com/Download)
• 	Node.js 18 or higher (https://nodejs.org/en/download/)
The code files for this chapter are available at https://github.com/PacktPublishing/
Angular-Design-Patterns-and-Best-Practices/tree/main/ch9.
-- 170 of 270 --
Exploring Reactivity with RxJS	150
During this chapter, remember to run the backend of the application found in the gym-diary-
backend folder with the npm start command.

---

## Observables and operators

Up until this point, we’ve used observables as a way to capture the data that came from the backend
API using the subscribe method, but let’s take a step back and ask what an observable is and why
we don’t just use JavaScript promises.
Let’s use a table to organize our explanation:
Single 	Multiple
Synchronous 	Function 	Iterator
Asynchronous 	Promise 	Observable
Table 9.1 – Types of objects by requirement
When we need to perform synchronous processing and expect a return value, we use a function. If we
need a collection of synchronous values, we use an object of the Iterator type. We use promises
when we need the return value of a function, but its processing is asynchronous.
But what can we use for asynchronous processing that does not return a value but a collection of
values that can be distributed over time as events? The answer to that need is an observable! With
this data structure, we can capture a series of events in time and declaratively make our application
react to these events.
Regarding the use of promises for HTTP requests, we can use them, but tasks that are verbose and
complex to perform when using promises can be done using observables and RxJS instead. We can
say that everything a promise can do, an observable is also capable of doing, but vice versa, this
becomes complex.
In Angular, most asynchronous events are mapped and controlled by observables. In addition to HTTP
requests, user typing, the exchange of routes by the application, and even the life cycle of components
are controlled by observables as they are events that occur over time.
We can think of these events as flows of information, and RxJS and the concept of observables can
manipulate these flows and make our application react to them. The main resources for manipulating
this flow are the RxJS operators, which are functions that receive and return data to this flow.
In the next section, we’ll start with the operator that will transform the stream data.
-- 171 of 270 --
Handling data – transformation operators 	151
Handling data – transformation operators
In our DiaryComponent application component, which renders a list of diary entries, we can notice
that our component needs to know the details of the return value taken from the API, in which case
the detail is returned in an attribute called item.
Let’s refactor the service to return just what the component needs already formatted, abstracting the
structure of the API.
In the ExerciseSetsService service, we will refactor the following methods:
import { Observable, map } from 'rxjs';
. . .
export class ExerciseSetsService {
. . .
getInitialList(): Observable<ExerciseSetList> {
const headers = new HttpHeaders().set('X-TELEMETRY', 'true');
return this.httpClient
.get<ExerciseSetListAPI>(this.url, { headers })
.pipe(map((api) => api?.items));
}
refreshList(): Observable<ExerciseSetList> {
return this.httpClient
.get<ExerciseSetListAPI>(this.url)
.pipe(map((api) => api?.items));
}
. . .
}
In the getInitialList and re

---

## 3. 	Finally, we run the switchMap high-order operator to switch the form typing observable to

the service’s HTTP request observable.
We can also, with another operator, add a waiting time for starting the flow of the observable, as in
the following example:
const DEBOUNCE_TIME = 300;
. . .
public exercises$ = this.entryForm.valueChanges.pipe(
debounceTime(DEBOUNCE_TIME),
map((model) => model?.exercise ?? ''),
filter((exercise) => exercise.length >= 3),
switchMap((exercise) => this.exerciseService.getExercises(exercise))
);
. . .
We added the debounceTime operator to create a delay time for the beginning of the flow, defining
the time in milliseconds and with the good practice of using a constant to make the code clearer.
Let’s add one last optimization to our code with a new operator:
public exercises$ = this.entryForm.valueChanges.pipe(
debounceTime(DEBOUNCE_TIME),
map((model) => model?.exercise ?? ''),
filter((exercise) => exercise.length >= 3),
distinctUntilChanged(),
switchMap((exercise) => this.exerciseService.getExercises(exercise))
);
The distinctUntilChanged operator checks whether the stream’s data, here exercise, has
changed from one iteration to another and triggers the next operator only if the value is different,
saving even more unnecessary calls to the backend.
-- 179 of 270 --
How to choose the correct operator 	159
We’ve learned about a few operators, but the library has over 80. In the next section, we’ll learn how
to navigate the library’s documentation.

---

## How to choose the correct operator

The RxJS library has an extensive number of operators that can help simplify your code and handle
corner cases of asynchrony and even performance.
You don’t need to memorize all the operators and the ones we’ve seen so far will help you with the
most common cases.
The library documentation has a Decision Tree page, and we’ll learn how to navigate that.
Enter the site (https://rxjs.dev/operator-decision-tree) and, here, we will navigate
to an operator that we have already studied to exemplify the use of this tool.
Figure 9.2 – Operator Decision Tree
Let’s go back to our form example. We need to fetch the exercise information from what the user’s
typing – let’s assume that we don’t know which operator to choose.
We already have an observable, which is the valueChanges event in the Angular form, so on the
first screen, we will choose the I have one existing Observable, and option.
-- 180 of 270 --
Exploring Reactivity with RxJS	160
The request to our API is represented by an observable, so on the next screen, we will choose the I
want to start a new Observable for each value option.
As we want to make a new request for each letter the user types, we want to change one stream for
another, so on the next screen, we’ll choose and cancel the previous nested Observable when a new
value arrives.
The exercise search depends on the value that is in the Angular form, so on the final page, we will
choose where the nested Observable is calculated for each value.
Confirming the selection, the decision tree indicates that the correct operator for this situation is the
switchMap operator that we are using!
Another thing we need to understand in the RxJS documentation is the marble graph. For this, let’s
take as an example another operator that we studied in the chapter, the map operator here: https://
rxjs.dev/api/index/function/map.
In addition to the textual explanation, we have the following figure:
Figure 9.3 – Map operator marble graph (source: https://rxjs.dev/api/index/function/map, MIT license)
As we learned at the beginning of this chapter, RxJS works on information flows, where operators
have the function of handling information.
The graph that illustrates this flow uses arrows to represent the passage of time and marbles to
represent values.
In the documentation here, then, we see that the map operator takes each value emitted and, based
on a function, results in a flow with the values transformed by it.
These values are exchanged one by one as soon as they are issued so, in the graph, we can see that the
positions of the marbles are same.
This understanding is fundamental to understanding other more complex operators in the library.
-- 181 of 270 --
Summary 	161

---

## Summary

In this chapter, we explored the RxJS library and its basic elements, observables.
We learned what an observable is and how it differs from a promise or a function. With that knowledge,
we refactored our project to handle data with the map operator, abstracting the implementation details
of the component that will consume the service. We also learned about Angular’s async pipe and how
it simplifies the management of subscription to an observable, leaving this task to the framework
itself to manage.
Finally, we created a typeahead search field using RxJS to search for exercises based on the user’s typing
event, using operators in order to optimize HTTP calls from our frontend. In the next chapter, we will
explore the possibilities of the automated tests that we can do in our Angular application.
-- 182 of 270 --
-- 183 of 270 --
Part 3:
Architecture and Deployment
In this part, you will learn how to build the architecture of your Angular project to meet the challenges
and demands of your users. We will explore the best practices for automated testing using the libraries
that the framework uses and we will install Cypress for end-to-end testing. We will understand the
micro frontend architecture and how to implement it with Angular. We will use the Azure cloud service
to perform the build and deploy our example application and finally understand how to update an
Angular application and use features from version 17 onwards such as Angular Signals
This part has the following chapters:
• Chapter 10, Design for Tests: Best Practices
• Chapter 11, Micro Frontend with Angular Elements
• Chapter 12, Packaging Everything: Best Practices for Deployment
• Chapter 13, The Angular Renaissance
-- 184 of 270 --
-- 185 of 270 --
10
Design for Tests: Best Practices
One of the best practices in a software project, be it a frontend or backend project, is testing. After all,
if you and your team don’t rigorously test your system, the people who will inevitably test the system
and find possible bugs are the users, and we don’t want that.
For this reason, it is no wonder that the Angular team has, since the first versions of the framework,
been concerned with creating and integrating automated testing tools.
We can notice this with the fact that, by default, the Angular CLI always generates, together with the
component, its test files as if saying, “Hey, buddy, don’t forget the unit test!”
In this chapter, we will explore this topic by covering the following:
• 	What to test
• 	Service tests
• 	Understanding TestBed
• 	Component testing
• 	E2E tests with Cypress
At the end of the chapter, you will be able to create tests for your components and service, improving
the quality of your delivery and your team.

---

## Technical requirements

To follow the instructions in this chapter, you’ll need the following:
• 	Visual Studio Code (https://code.visualstudio.com/Download)
• 	Node.js 18 or higher (https://nodejs.org/en/download/)
The code files for this chapter are available at https://github.com/PacktPublishing/
Angular-Design-Patterns-and-Best-Practices/tree/main/ch10.
-- 186 of 270 --
Design for Tests: Best Practices	166
During the study of this chapter, remember to run the backend of the application found in the
gym-diary-backend folder with the npm start command.

---

## What to test

Within a software project, we can do several types of tests to ensure the quality of the product. In this
discipline, it is very common to categorize tests using a pyramid.
Figure 10.1 – Test pyramid
At the base of the pyramid, we have unit tests, whose objective is to verify the quality of the smallest
elements within a software project, such as functions or methods of a class. Due to their narrow scope
and atomic nature, they are quickly executed by tools and should ideally make up the majority of an
application’s tests.
In the middle layer, we have integration tests, which are focused on verifying how the project components
interact with each other, being able, for example, to test an API through an HTTP request. Because these
tests use more elements and need certain environmental requirements, they are less performant and
have a higher execution cost, which is why we see them in smaller quantities compared to unit tests.
At the top of the pyramid, we have end-to-end tests (E2E tests), which validate the system from the
user’s point of view, emulating their actions and behaviors. These tests require an almost complete
environment, including a database and servers. In addition, they are slower and therefore there are
fewer of them compared to the previous ones.
-- 187 of 270 --
What to test 	167
Finally, we have manual and exploratory tests, which are tests performed by quality analysts. Ideally,
these tests will serve as a basis for the creation of E2E tests, mainly on new features. As they are run by
humans, they are the most expensive, but they are the best for discovering new bugs in new features.
It is important to highlight that no test is better or more important than another. Here, we have the
classification by volume of test executions in a period of time. You and your team must identify which
tests to prioritize based on the capacity and resources available for your project. These types of tests
can be applied to any type of software project, but you must be wondering how we fit this concept
into an Angular project.
The concept of manual testing can be applied without tools because what we need is a quality analyst and
an application with a complete environment, that is, the backend services responding to our application.
E2E tests are performed by specific tools that simulate user behavior. Up to version 14, Angular already
had a built-in tool called Protractor, but the Angular team no longer recommends it because there
are more modern, faster alternatives. In this chapter, we are going to use Cypress for this purpose.
Finally, unit tests are performed on the methods of our services and components, verifying their behavior.
In the Angular toolbox, we have two tools for creating and running these tests: Jasmine and Karma.
These tools are installed by default when we start a new project.
Jasmine is a testing framework that has several checking functions, in addition to providing the
ability to change the functionality of a method or cl

---

## Service tests

As we studied in detail in Chapter 5, Angular Services and the Singleton Pattern, the service that works
as a repository of business rules in an Angular application. Consequently, it is crucial for us to develop
unit tests for these services. In this section, we will focus on the ExerciseSetsService service
to illustrate the Angular unit testing techniques in our project. Let’s begin.
In the exercise-sets.service.spec.ts test file, let’s start by fixing the tests automatically
created by the Angular CLI that are not running correctly:
import { TestBed } from '@angular/core/testing';
import { ExerciseSetsService } from './exercise-sets.service';
import { HttpClientTestingModule } from '@angular/common/http/
testing';
fdescribe('ExerciseSetsService', () => {
let service: ExerciseSetsService;
let httpMock: HttpTestingController;
beforeEach(() => {
TestBed.configureTestingModule({ imports:
[HttpClientTestingModule] });
service = TestBed.inject(ExerciseSetsService);
httpMock = TestBed.inject(HttpTestingController);
});
it('should be created', () => {
expect(service).toBeTruthy();
});
});
As we want to work on service testing, at this time, we replace the describe function with the
fdescribe function, so the Karma test runner will only execute this test case. The fdescribe feature
is also available for isolating a specific test, in this case replacing the it function with the fit function.
To fix the error identified by the Angular compiler, we import the 'HttpClientTestingModule'
module in the TestBed component.
We need to understand how Karma, Jasmine, and Angular work together to run tests. Before each
test case is defined in it functions, Angular sets up an isolated environment for the tests. This
environment has virtually no module configuration at first, as your real application has, and the
TestBed component comes into play, where we configure the minimum necessary dependencies
for your test to run.
-- 190 of 270 --
Design for Tests: Best Practices	170
In this service, as it depends on HttpClient to perform HTTP requests, we need to import the
HttpClientModule module to have this dependency. You might be wondering, “But here you are
using HttpClientTestingModule. Is this correct?” As we will see in the following code, not
only will we want to use HttpClient but we will also need to simulate HTTP calls, and to make
this task easier, the Angular team has prepared a specific module for this type of testing.
With our basic “should be created” test case in place, let’s test the methods of the class:
it('should use the method getInitialList to return the list of
entries', fakeAsync(() => {
const fakeBody: ExerciseSetListAPI = {
hasNext: false,
items: [
{
id: '1',
date: new Date(),
exercise: 'Deadlift',
reps: 15,
sets: 4,
},
],
};
service.getInitialList().subscribe((response) => {
expect(response).toEqual(fakeBody.items);
});
const request = httpMock.expectOne((req) => {
return req.method === 'GET';
});
request.flush(fakeBody);
tick();
}));
As you can 

---

## Component testing

Angular component unit tests not only examine logic but also assess the values that will be presented
on the screen.
If your application follows the component architecture recommended by the Angular team (more
details in Chapter 4, Components and Pages), you probably won’t have much business logic in your
components, delegating it to services.
To exemplify, in this section, we will create tests for some methods of the DiaryComponent component.
We will create the test case for the gym diary entry deletion operation and check whether the service’s
delete method is called:
describe('DiaryComponent', () => {
. . .
let exerciseSetsService: ExerciseSetsService;
beforeEach(async () => {
await TestBed.configureTestingModule({
. . .
}).compileComponents();
. . .
exerciseSetsService = TestBed.inject(ExerciseSetsService);
});
it('should call delete method when the button delete is clicked',
fakeAsync(() => {
exerciseSetsService.deleteItem = jasmine.createSpy().and.
returnValue(of());
component.deleteItem('1');
tick();
expect(exerciseSetsService.deleteItem).
toHaveBeenCalledOnceWith('1');
}));
});
In the preceding code block, we are testing the DiaryComponent component, so we mock the
service it depends on with TestBed. But for this test, we need a reference to this service, and for
that, we declare a variable called exerciseSetsService. With the TestBed.inject method,
we assign the value to this variable.
In the test setup, we need to use the createSpy function to assign the service’s deleteItem
method because the mock generated by the Jasmine framework does not have the full implementation
of the service and therefore does not return the observable that the component is expecting.
In the execution phase, we call the deleteItem method of the component.
-- 198 of 270 --
Design for Tests: Best Practices	178
As this operation is asynchronous, we use the tick function to simulate the passage of time.
In the assertion phase, we check that the exerciseSetsService service method was called once
and with the expected parameter.
Let’s test the editEntry method next:
import { Location } from '@angular/common';
describe('DiaryComponent', () => {
let location: Location;
beforeEach(async () => {
await TestBed.configureTestingModule({
. . .
imports: [
RouterTestingModule.withRoutes([
{
path: 'home/diary/entry/:id',
component: NewEntryFormReactiveComponent, },
]),
]
}).compileComponents();
location = TestBed.inject(Location);
});
it('should direct to diary entry edit route', fakeAsync(() => {
const set: ExerciseSet = { date: new Date(), exercise: 'test',
reps: 6, sets: 6, id: '1' };
component.editEntry(set);
tick();
expect(location.path()).toBe('/home/diary/entry/1');
}));
});
To perform the assertion of the route, we are going to use an object of type Location – that’s why
we declare it at the beginning of the test and assign it using the TestBed component. Note that we
want the @angular/common library object and not the browser’s default Location object. Also,
in TestBe

---

## 5. 	Select the desired browser and click on Start E2E Testing and we will have the test

execution interface.
Notice that we already have a file called spec.cy.ts. It was generated by Cypress to exemplify the
creation of the test script. Let’s go back to Visual Studio Code and check this file:
describe('My First Test', () => {
it('Visits the initial project page', () => {
cy.visit('/')
cy.contains('app is running!')
})
})
Unlike Angular, Cypress uses Mocha (https://mochajs.org/) as a testing framework. However,
in practice, as we can see in the preceding example, it is very similar to the Jasmine framework.
We have the describe function to create the test suite and the it function to create the test cases.
The difference here is the cy object, which represents the browser’s interface, and with this object, we
can perform actions and evaluate the state of the page, from the user’s point of view. Here, we use the
visit method to go to the initial endpoint and we use the contains method to evaluate whether
the text app is running appears on the page. We are going to delete this file because we are going to
create the scripts for our application.
In the same folder as where the previous file was, we will create the login.cy.ts file and add the
following code:
describe('Login Page:', () => {
it('should login to the diary with the correct credentials.', () =>
{
cy.visit('/');
cy.get('#username').type('mario');
cy.get('#password').type('1234');
cy.get(':nth-child(3) > .w-full').click();
cy.contains('Workout diary');
});
});
In this test, we used the get method to obtain the page element through CSS queries so that we
could act on them. First, we take the username and password fields and use the type method
to simulate the user typing in these fields. Then we locate the Confirm button and use the click
method to simulate the mouse click action.
To assert the test, we used the contains method to assess whether the diary screen was displayed.
The tricky part of creating this script is the CSS queries needed to get the elements we need. But at
this point, Cypress helps us a lot.
-- 201 of 270 --
E2E tests with Cypress 	181
By running the test, we can see that there is a target icon at the top of the screen. By clicking on it
and selecting the element we want, Cypress will generate the necessary command ready to copy and
paste into our script.
Figure 10.4 – Cypress helping with the CSS query
In this script, however, there is a problem in selecting the button, in addition to the query not being
clear to another person reading the test script. If the team needs to change the layout, the test could
break unduly.
To avoid this error, let’s change the login component template:
<button
type="submit"
class="w-full rounded bg-blue-500 px-4 py-2 text-white"
[disabled]="loginForm.invalid"
[class.opacity-50]="loginForm.invalid"
data-cy="submit"
>

---

## Login

</button>
-- 202 of 270 --
Design for Tests: Best Practices	182
With this custom HTML element, we can use the element marked with the data-cy attribute for
our test:
describe('Login Page:', () => {
it('should login to the diary with the correct credentials.', () =>
{
cy.visit('/');
cy.get('#username').type('mario');
cy.get('#password').type('1234');
cy.get('[data-cy="submit"]').click();
cy.contains('Workout diary');
});
});
We replaced the previous CSS query with a simpler one that does not depend on layout elements. Use
this good practice in your project templates to facilitate E2E testing and make the test less likely to break.
We’ll create an E2E test for the new journal entry form, but first, let’s apply the best practice to the
templates we’ll be using in this test. In the Home component template, we will refactor as follows:
<li>
<a
routerLink="./diary"
class="flex items-center space-x-2 text-white"
data-cy="home-menu"
>
<span>Diary</span>
</a>
</li>
<li>
<a
routerLink="./diary/entry"
class="flex items-center space-x-2 text-white"
data-cy="new-entry-menu"
>
<span>New Entry</span>
</a>
</li>
<li>
<a
(click)="logout()"
class="flex items-center space-x-2 text-white"
data-cy="logout-menu"
>
<span>Logout</span>
-- 203 of 270 --
E2E tests with Cypress 	183
</a>
</li>
In the template, we add the data-cy HTML element to the items of the menu. Note that as the test
is from the user’s point of view, we need to simulate how they get to the form.
In the new-entry-form-reactive.component.html template, we will change the submit
button like so:
<button
type="submit"
[disabled]="entryForm.invalid"
[class.opacity-50]="entryForm.invalid"
class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-
blue-700"
data-cy="submit"
>

---

## Confirm

</button>
As with the login screen, we mark the button with the data-cy element to facilitate the development
of the E2E test.
With our application better adapted for testing, we will create the new-entry-form.cy.ts file
in the cypress/e2e folder of our workspace and add the following code:
describe('New Entry Form:', () => {
beforeEach(() => {
cy.visit('/');
cy.get('#username').type('mario');
cy.get('#password').type('1234');
cy.get('[data-cy="submit"]').click();
});
it('Should register a new entry in the workout diary', () => {
cy.get('[data-cy="new-entry-menu"]').click();
cy.contains('Date');
cy.get('#date').type('2023-08-08');
cy.get('#exercise').type('Front Squat');
cy.get('#sets').type('4');
cy.get('#reps').type('6');
cy.get('[data-cy="submit"]').click();
cy.contains('Item Created!');
});
});
-- 204 of 270 --
Design for Tests: Best Practices	184
Like Jasmine, the Mocha.js framework also has the beforeEach function, but here, instead of setting
up the environment with TestBed, we use the function to perform the login, since each test where
we are simulating the user is necessary for this action.
In the test case of the form, since we are already logged in, we click on the menu of the input form
and check whether there is a Date label. From then on, we fill in the form fields with data and click on
the button. In the assertion phase, we check whether the Item created message appears on the screen.
One thing to note is that at no point do we tell the script how long to wait for the backend response,
which can vary. This happens because the Cypress framework does this work for us and makes this
waiting process transparent to our development.
We will create a test case to evaluate the form validations:
it('should validate field information and show the validation
message', () => {
cy.get('[data-cy="new-entry-menu"]').click();
cy.contains('Date');
cy.get('#date').type('2023-08-08');
cy.get('#exercise').type('Front Squat');
cy.get('#sets').type('3');
cy.get('#reps').type('6');
cy.contains('Sets is required and must be a positive number.');
cy.contains('sets is required and must be multiple of 2.');
});
In this test case, we don’t need to worry about the login because the beforeEach function performs
this function and we work directly on the form. We fill in the fields, but this time, with information
that is not valid. In the assertion phase, we check whether the validation messages appear correctly
with the contains method.
With that, you’ve learned about Cypress and E2E testing in an Angular application, so let’s summarize
what we looked at in the chapter.

---

## Summary

In this chapter, we learned how to perform tests in an Angular project. We studied what types of
tests there are, their importance, and how to apply them in our daily lives. We worked on our project
by first creating tests for the services and looking at how to isolate the dependencies for a unit test.
Furthermore, we explored testing HTTP requests using the HttpClientTestingModule module.
We learned about the TestBed component and its important task of setting up the environment for
each unit test to run. We also looked at component testing and how to assert components that use
routes. Finally, we explored E2E tests with the Cypress tool, which simplifies the creation of scripts
that simulate the behavior of our application from the client’s point of view.
In the next chapter, we will explore the concept of the micro frontend using the Angular framework.
-- 205 of 270 --
11
Micro Frontend with Angular

---

## Elements

As your application grows and becomes more complex, one team alone is not enough to maintain the
growth rate, and new people are needed to handle other parts of the application as they appear. At this
point, the architecture of your project needs to evolve, and one possibility is to divide your application
into several projects that are integrated as one. This practice was born in the world of backend services
and appears in the frontend world under the name of micro frontends. In this chapter, we will learn
how to apply this principle in an Angular project.
In this chapter, we will cover the following topics:
• 	Micro frontend – concepts and application
• 	Slicing your application in the micro frontend
• 	Creating a micro frontend application with standalone components
• 	Preparing a page to be loaded by the base application
• 	Dynamically loading micro frontends
By the end of this chapter, you will be able to assess when it is necessary to use a micro frontend, how
to organize your Angular projects, and how to integrate it into a cohesive application.

---

## Technical requirements

To follow the instructions in this chapter, you’ll need the following:
• 	Visual Studio Code (https://code.visualstudio.com/Download)
• 	Node.js 18 or higher (https://nodejs.org/en/download/)
The code files for this chapter are available at https://github.com/PacktPublishing/
Angular-Design-Patterns-and-Best-Practices/tree/main/ch11.
-- 206 of 270 --
Micro Frontend with Angular Elements	186
Before you start reading this chapter, remember to run the backend of the application found in the
gym-diary-backend folder with the npm start command.
Micro frontend – concepts and application
In 2014, an article by Martin Fowler and James Lewis (https://martinfowler.com/articles/
microservices.html) shook the world of development with the formalization of the concept of
microservices. Focused on the development of backend services, the idea of dividing a large system
(known as a monolith) into small, independent services focused on just one aspect of the business
was undoubtedly a milestone for system architecture.
Not long after, this concept was applied to the frontend world, with one of the main articles written
by Cam Jackson (https://martinfowler.com/articles/micro-frontends.html).
The basic idea of the micro frontend is the same as its sibling, microservices, which consists of dividing
a large frontend project (monolith) into small, independent projects focused on one aspect of the
business. However, the concerns are different, of course. In microservices, we worry about databases and
communication protocols, whereas on the frontend, we need to worry about packet size, accessibility,
and user experience.
Let’s start by analyzing whether you need to use this type of architecture for your project.

---

## When to use a micro frontend

A big but very true cliché in systems architecture is that there is no silver bullet – that is, there is no
one-size-fits-all solution for all problems – and micro frontends cannot escape this cliché. The main
advantage of this architecture, before any technical aspect, is its organizational aspect.
When we use the micro frontend, we are separating an independent part focused on one aspect of
the business that will be handled by a team specializing in that aspect. With this, your project can
scale across different teams dealing with specific subjects that will be integrated into an experience
for your user. Each team has autonomy in the delivery cycle of this project, with independence from
build, deployment, and testing. Independence can reach a level where teams can work with different
versions of Angular and even different frameworks such as React and Vue, although this is not highly
recommended, as we will discuss in the next section.

---

## When not to use a micro frontend project

Another software engineering cliché is that there is no free lunch, and choosing to use micro frontends
has its costs and challenges.
The first challenge is the performance issue of your frontend. As we saw in Chapter 1, Starting Projects
the Right Way, in a single-page application (SPA), the user’s browser downloads the application bundle
containing the Angular framework code, in addition to the code that your team produced. After this
download, the browser interprets the bundle and renders the pages for the user. This entire process
-- 207 of 270 --
Slicing your application into micro frontends 	187
must be as quick and efficient as possible because, while it is occurring, the user cannot interact with
the screen, causing frustration.
Now imagine this process happening in every part of your system because, to guarantee version and
even framework independence, each micro frontend carries its framework engine in the specific
version. There are techniques and tools such as webpack’s module federation (https://webpack.
js.org/concepts/module-federation/), but you and your team must evaluate this challenge.
Another care we must take is concerning the user experience and the design of the components on
screen because, for them, the components between interfaces must be fundamentally the same to
guarantee cohesion in their experience.
This challenge can be overcome by implementing a design system – that is, a single design guide for
your company’s components, preferably with a library that supports it. An example of a design system
is Google’s Material Design.
Now that we have a basic understanding of micro frontends, let’s move on to the next section, where
we will explore how to split our application into micro frontends.

---

## Slicing your application into micro frontends

To maximize gains from the micro frontend architecture and minimize the risks defined in the previous
section, we need to create microservices that are as independent as possible and that make sense for
your team’s organization.
The most common type of project organization is the verticalization of functionalities – that is, for
one project you might have an entire user journey, such as a product purchase screen, another project
for product registration, and another for the administration module of the application.
Figure 11.1 – Micro frontend division
-- 208 of 270 --
Micro Frontend with Angular Elements	188
This diagram exemplifies the concept of division using an Angular application. In each project, we
have all the components for the user experience.
You may be wondering, “Can I achieve this same separation using Angular modules?” and the answer
is yes, you can. If a team takes care of all the modules for your company’s organization or the teams
can organize themselves into just one project, you can (and even should) do this.
We need to keep in mind that the reason for dividing your project into micro frontends is to
meet an organizational requirement of your project, and teams want to have deployment and
development independence.
With the basic concepts in mind, we will exemplify how to implement them in our gym diary project.

---

## Creating a micro frontend application with standalone

components
To exemplify the use of the micro frontend architecture in our gym diary, we will create a form to
define new exercises for our users. Let’s create another Angular project, simulating a new team that
will specifically take care of this functionality. In your operating system’s command line, use the
following command:
ng new gym_exercises --skip-git --standalone --routing false --style css
We learned about the ng new command in Chapter 1, Starting Projects the Right Way, but here we are
using some parameters that we haven’t seen before. We are using the skip-git parameter because,
in this example, we are creating it in the same Git project (which already has the gym-diary and
gym-backend projects). The routing parameter is set to false because our project will be
loaded in the diary application route, and the style parameter is set to CSS so the Angular CLI
does not need to ask what type of styling our project will have.
The biggest difference in this command is standalone, which parameterized our project to create all
components as standalone by default. But you might be wondering what a standalone component
is. Created from version 15 of Angular, this feature allows you to create a component without using
Angular modules (NgModule). Although modules are very important, as we saw in Chapter 2,
Organizing Your Application, there are cases in which they are not very useful and make the project
unnecessarily complicated. A good example of this is in small projects with a limited scope, such as
this micro frontend, where we will not have multiple routes or lazy loading.
Before we start creating the exercise form, let’s add and configure the Tailwind CSS framework, as we
want to have a style compatible with our main application. Inside the created project folder, run the
following command from the command line of your operating system:
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
-- 209 of 270 --
Creating a micro frontend application with standalone components 	189
This command will add development dependencies to the project and create configuration files in
the Tailwind CSS framework.
In the tailwind.config.js file, make the following changes:
/** @type {import('tailwindcss').Config} */
module.exports = {
content: [
"./src/**/*.{html,ts}",
],
theme: {
extend: {},
},
plugins: [],
}
In this file, we are telling Angular that it will apply the Tailwind CSS framework to all HTML files in
the src folder.
Finally, add the following lines of code to the app.component.css file:
@tailwind base;
@tailwind components;
@tailwind utilities;
With these CSS variables, the component will have access to the tailwindcss class.
We will then create a service that will be responsible for interacting with our backend’s exercise API.
On the command line, we will use the following:
ng g service service/Exercises
ng g interface exercise
Note a detail of our architecture: we already have a service that queries the exercise API in our main
pr

---

## Chapter 9, Exploring Reactivity with RxJS.

However, we are experiencing an error because we are not importing the HttpClientModule
module. But how can we import it if we don’t have a module in a standalone component?
In a project without modules, the import happens in the component itself; for services, we have the
app.config.ts file, and we will add the import to it:
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
export const appConfig: ApplicationConfig = {
providers: [provideHttpClient()],
};
-- 211 of 270 --
Creating a micro frontend application with standalone components 	191
Note that we are importing the provideHttpClient provider and not the module. This happens
because this provider was created by the Angular team to handle these standalone application cases.
In the main components of the application, we will code its behavior as follows:
@Component({
selector: 'app-root',
standalone: true,
imports: [CommonModule, ReactiveFormsModule],
templateUrl: './app.component.html',
styleUrls: ['./app.component.css'],
})
export class AppComponent {
private formBuilder = inject(NonNullableFormBuilder);
private exerciseService = inject(ExercisesService);
exerciseList$ = this.exerciseService.getExercises();
public entryForm = this.formBuilder.group({
description: ['', Validators.required],
});
newExercise() {
if (this.entryForm.valid) {
const newExercise = { ...this.entryForm.value };
this.exerciseService
.addExercises(newExercise)
.subscribe(
(_) => (this.exerciseList$ = this.exerciseService.
getExercises())
);
}
}
}
Let’s first highlight the component configuration in the @Component decorator metadata. The
standalone property means that this component can be used directly without being declared in
any module. In the imports property, we declare its dependencies, which are CommonModule,
the basis for any Angular component, and ReactiveFormsModule, as we will be developing a
reactive form (for more details about the form, read Chapter 6, Handling User Input: Forms). In the
component, we are injecting NonNullableFormBuilder and ExercisesService and we
take the initial list and assign it to the exerciseList$ attribute. We create the form object with
the formBuilder service, and finally, we create the newExercise method responsible for the
Submit button.
-- 212 of 270 --
Micro Frontend with Angular Elements	192
As we will have the list of exercises in the same form, in the subscribe method, we assign the
exerciseList$ attribute again to refresh the list.
To finish the component, let’s create its template as follows:
<div class="bg-gray-100 flex justify-center items-center min-h-
screen">
<div class="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
<h1 class="text-2xl font-bold mb-4">Exercise List</h1>
<div class="max-h-40 overflow-y-auto mb-4">
<ul>
<li class="mb-2" *ngFor="let exercise of exerciseList$ |
async">
{{ exercise.description }}
</li>
</ul>
</div>
</div>
</div>
In the first part, we have the list of exercises, and here we

---

## Confirm

</button>
</div>
</form>
-- 213 of 270 --
Preparing a page to be loaded by the base application 	193
We created a reactive form with just the Description field and added simple validation.
By running our application with the ng serve command, we will have the following interface:
Figure 11.2 – Exercise form
With our micro frontend project ready, we can prepare it to be consumed by our main application.

---

## Preparing a page to be loaded by the base application

With our micro frontend project ready, we need to prepare it to be consumed by another application.
There are several ways to share micro frontends, from the simplest (and obsolete), with the use of
iframes, to more modern, but complex, solutions such as module federation.
In this section, we will use an approach widely used in the market, which is the use of Web Components.
Web Components is a specification that aims to standardize components created by different frameworks
into a model that can be consumed between them. In other words, by creating an Angular component
following this specification, an application created in React or Vue could consume this component.
Although Web Components was not created with micro frontend projects in mind, we can see that
its definition fits perfectly for what we need.
Like almost everything in the Angular framework, to create this type of component, we don’t need
to do it manually, as the Angular team created a tool for this: Angular elements. An Angular element
component is a common component but transpiled to the Web Components standard, packaging not
only our code but also the Angular rendering engine, making it framework agnostic.
-- 214 of 270 --
Micro Frontend with Angular Elements	194
Let’s add it to our gym_exercises project on the command line of our operating system with the
following command:
npm i @angular/elements
With the preceding command, we add the angular/elements dependency to our project, and
to use it, we will make a change to the angular.json file:
{
"type": "anyComponentStyle",
"maximumWarning": "50kb",
"maximumError": "50kb"
}
The component generated by Angular elements will encapsulate the Tailwind CSS framework, so we
need to increase the component size budget a little to avoid errors when building the project.
The next change we must make is to the project’s main.ts file:
import {
bootstrapApplication,
createApplication,
} from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { createCustomElement } from '@angular/elements';
(async () => {
const app = await createApplication(appConfig);
const element = createCustomElement(AppComponent, {
injector: app.injector,
});
customElements.define('exercise-form', element);
})();
This file is responsible for configuring the initialization of an Angular project, and we normally do not
change it as we want standard SPA build and execution behavior. However, here, we need to change
it to inform Angular that the result of this project will be a web component generated by the Angular
elements package. Here, we are configuring the project so that the application will generate a web
component whose tag name will be exercise-form.
-- 215 of 270 --
Preparing a page to be loaded by the base application 	195
We now need to change the index.html file to understand this new tag so that we can render our
micro frontend for testing:
<!DOCTYPE html>
<html lang="en">
<head>
<

---

## Dynamically loading micro frontends

Let’s prepare our main application gym diary to consume the micro frontend that we prepared
previously. To do this, let’s start by creating a new module in the application. On the command line,
we will use the following Angular CLI commands:
ng g m exercise --routing
ng g c exercise/exercise
With the preceding commands, we create the module with the generated route file and a component
that will be responsible for loading mfe.
Let’s adjust the exercise-routing.module.ts file to target the component:
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExerciseComponent } from './exercise/exercise.component';
const routes: Routes = [
{
path: '',
component: ExerciseComponent,
title: 'Exercise Registry',
},
];
-- 217 of 270 --
Dynamically loading micro frontends 	197
@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule],
})
export class ExerciseRoutingModule {}
In the routes array, we define a base route for the exercise registration component as it will be
loaded via lazy loading.
Next, we will refactor the home-routing.module.ts file as follows:
. . .
const routes: Routes = [
{
path: '',
component: HomeComponent,
children: [
{
path: 'diary',
loadChildren: () =>
import('../diary/diary.module').then((file) => file.
DiaryModule),
},
{
path: 'exercise',
loadChildren: () =>
import('../exercise/exercise.module').then(
(file) => file.ExerciseModule
),
},
{
path: '',
redirectTo: 'diary',
pathMatch: 'full',
},
],
},
];
. . .
Our HomePage module contains the menu, and in this section, we are adding the new module to
be loaded in the correct area of the interface.
-- 218 of 270 --
Micro Frontend with Angular Elements	198
To finish adding this new module, let’s change the home.component.html file:
. . .
<li>
<a
routerLink="./exercise"
class="flex items-center space-x-2 text-white"
>
<span>Exercise Registry</span>
</a>
</li>
. . .
With the new menu item added to the home template, we now have the task of including the micro
frontend generated in the other project in our interface.
For this, we have a community package called @angular-extensions that allows us to load our
micro frontend simply using a directive, as we will see later. But first, let’s install this dependency in
our project using the following command:
npm i @angular-extensions/elements
Once installed, we can change the ExerciseModule module:
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExerciseRoutingModule } from './exercise-routing.module';
import { ExerciseComponent } from './exercise/exercise.component';
import { LazyElementsModule } from '@angular-extensions/elements';
@NgModule({
declarations: [ExerciseComponent],
imports: [CommonModule, LazyElementsModule, ExerciseRoutingModule],
schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ExerciseModule {}
In this file, we are first adding the library module called LazyElementsModule to have ac

---

## Summary

In this chapter, we explored the architecture of micro frontends and how to apply one to an Angular project.
We learned about the concept of the architecture, its advantages, and its trade-offs. We explored how
the main reason for opting for this architecture is its flexibility in relation to the organizational structure
of each team, as several teams can work on different parts of the frontend project independently.
We also learned how we can ideally divide our application into micro frontends.
With all these concepts, we applied our project by creating a small application using Angular’s
standalone components feature and preparing it to be loaded by another project using the Angular
elements library.
Finally, we performed dynamic loading in our main application with the help of the @angular-
extensions/elements library.
In the next chapter, we will explore the best practices for deploying an Angular application.
-- 221 of 270 --
12
Packaging Everything – Best
Practices for Deployment
After architecting, developing, and testing your application, it’s time to deploy it to your users.
In this chapter, we will learn the best practices for generating production packages and how to use
automation tools to maximize the team’s productivity and effectiveness at this point in the project.
In this chapter, we will cover the following topics:
• 	Deploying the backend
• 	Differentiating environments
• 	Preparing the production bundle
• 	Mounting a Docker image with Nginx
• 	Deploying a page to Azure Static Web Apps
By the end of this chapter, you will be able to use the Angular CLI to generate a package optimized
for production and CI/CD tools to automate this process for your team.

---

## Technical requirements

To follow the instructions in this chapter, you’ll need the following:
• 	Visual Studio Code (VSCode) (https://code.visualstudio.com/Download)
• 	Node.js 18 or higher (https://nodejs.org/en/download/)
• 	Docker (https://www.docker.com/)
• 	Docker for VSCode (https://m a r k e t p l a c e . v i s u a l s t u d i o . c o m /
items?itemName=ms-azuretools.vscode-docker)
-- 222 of 270 --
Packaging Everything – Best Practices for Deployment	202
• 	An Azure account (https://azure.microsoft.com)
• 	The Azure CLI (https://learn.microsoft.com/en-us/cli/azure/)
• 	Azure Functions Core Tools (https://learn.microsoft.com/en-us/azure/
azure-functions/functions-run-local)
• 	Azure Tools for VSCode (https://marketplace.visualstudio.com/
items?itemName=ms-vscode.vscode-node-azure-pack)
• 	The NestJS CLI (https://docs.nestjs.com/cli/overview)
The code files for this chapter are available at https://github.com/PacktPublishing/
Angular-Design-Patterns-and-Best-Practices/tree/main/ch12.

---

## Deploying the backend

Before preparing our gym diary project for production, let’s first upload the backend to a cloud service
so that our page has access to the data.
We chose the Azure service for this book, but the concepts in this chapter can also be applied to other
cloud services, such as AWS (https://aws.amazon.com) and GCP (https://cloud.
google.com).
The backend of this example does not use a database and was built using the NestJS framework
(https://nestjs.com/), which actually has an architecture completely inspired by Angular,
but for the backend! This framework allows you to add cloud deployment capabilities with Azure. To
prepare your backend for deployment, in the command line of your operating system, in the project
folder (/gym-diary-backend), run the following commands:
npm install @schematics/angular
nest add @nestjs/azure-func-http
The first command installs the Angular Schematic package, which will be used to build the application.
The nest add command has the same functionality as Angular’s ng add command, and here, in
addition to installing the dependencies for deployment on Azure, it also configures and creates the
necessary files for this task.
With the tools from the Technical requirements section installed, we first need to create an Azure
Functions project. To do this, let’s go to the Azure portal in the Function App menu option:
-- 223 of 270 --
Deploying the backend 	203
Figure 12.1 – Function App menu option
Azure has several ways to run a backend service, and one of the simplest is through Azure Functions.
With it, we can upload our service without needing to configure a server, as the provider will take
care of these details.
We then need to perform some basic configurations. To do this, we will click on + Create. Once done,
we will be presented with the following screen:
Figure 12.2 – Azure Functions service configuration
-- 224 of 270 --
Packaging Everything – Best Practices for Deployment	204
In the Subscription field, you need to choose your Azure subscription. In the Resource Group
field, you can select a group that you already have; if you don’t have one, you can create a new one
and enter its name. The Function App name field is important as it will initially be the address of
your endpoint. It is possible to buy a specific URL or place this API behind an Azure API gateway
(https://azure.microsoft.com/en-us/products/api-management), although this
is not required for our example. We will deploy directly from the code, so leave Do you want to deploy
code or container image? as Code. The project’s runtime stack should be set to NodeJS, version 18
LTS. For the project region, select one close to you, or East US, which is the default option. Finally,
Operating System should be set to Linux. The Hosting options and plans option should be set to
Consumption (Serverless) as we do not need any more specific features in this case.
Figure 12.3 – Hosting options and plans
Once we are done filling in all the necessary information, click on R

---

## Differentiating environments

After finishing the task of deploying our backend, we need to change our frontend project to make
requests to our cloud infrastructure. But here, a problem arises. We want to access our published
backend when we are in production, but the team needs to continue accessing the API locally to
develop new features in a more practical way. How can we have the best of both worlds?
The answer to this, once again, was thought up by the Angular team and is the creation of configuration
files for each development environment.
Until version 14 of Angular, these files were already standard when creating the project (the ng new
command). However, to simplify new projects and reduce the learning curve, these files were removed
for new projects.
But we shouldn’t worry because to add them, we can use the Angular CLI. On the command line,
use the following command:
ng generate environments
After executing the preceding command, the Angular CLI creates the environments folder, and
inside it, we have the environment.development.ts and environment.ts files.
These TypeScript files have only one object, and this object is where we will place all the settings that
we need to differentiate between production and development environments. We will first change the
environment.development.ts file like so:
export const environment = {
production: false,
apiUrl: 'http://localhost:3000'
};
In these objects, we declare a flag to indicate that this is a configuration of the development environment
and the URL of our local backend service. We will now change the environment.ts file like so:
export const environment = {
production: true,
apiUrl: 'https://gymdiaryangularboook.azurewebsites.net/api',
};
Here, we are doing the same but indicating the production environment of our application. The
backend address will be the one created in the previous section.
To use these files, we must import them and refactor the HostInterceptor service to use it:
. . .
import { environment } from 'src/environments/environment';
-- 228 of 270 --
Packaging Everything – Best Practices for Deployment	208
@Injectable()
export class HostInterceptor implements HttpInterceptor {
intercept(
request: HttpRequest<unknown>,
next: HttpHandler
): Observable<HttpEvent<unknown>> {
const url = environment.apiUrl;
. . .
}
In our interceptor service, which is responsible for adding the URL to our requests (for more details,
see Chapter 8, Improving Backend Integrations: the Interceptor Pattern), we use the environment
object property to determine the URL.
A point of attention here is that we must import the environment.ts file for this variable because
Angular makes the change when generating the build.
To make it clear which environment we are in, we will change the AppComponent component like so:
. . .
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.css'],
}

---

## Preparing the production bundle

The environmental needs of a frontend application running in production are different from the
development environment we have seen so far in the book.
When we are developing, we look for speed in compilation, powerful debugging, and profiling tools
to analyze our code, as well as generating boilerplate code, among other features.
Even though it costs more to process on our local machine, requires more space to generate instrumented
bundles to be able to perform debugging, and requires greater network consumption to download
development tools, all of this is important for the team’s productivity, and the Angular framework
delivers it in a robust ecosystem.
-- 231 of 270 --
Preparing the production bundle 	211
When we are talking about frontend web code running in production, the objective is almost the
opposite. We want our code to be as small and optimized as possible, to be downloaded and executed
by our users in the most performant way possible.
With this objective in mind, the Angular framework has a robust and simple build tool for generating
the production package.
To run it, we need to use the following command in our project folder:
ng build
This command will create the package that we will run in production in the dist folder of our project.
But to deepen our knowledge of the Angular framework, let’s understand what the basis for this
build process is. The answer is in the angular.json file. Let’s analyze some important properties
of the build:
"configurations": {
"production": {
"budgets": [
{
"type": "initial",
"maximumWarning": "500kb",
"maximumError": "1mb"
},
{
"type": "anyComponentStyle",
"maximumWarning": "2kb",
"maximumError": "4kb"
}
],
"outputHashing": "all"
},
. . .
"defaultConfiguration": "production"
}
In the configurations property, we have definitions of the types of environments that we can
have in our project. Initially, the Angular CLI creates two configurations: production and development.
In the production configuration, we have the budgets property, which determines the maximum
size that our package must have in addition to defining the maximum size that a unitary component
must have.
If your project exceeds this size, Angular may show a warning in the production console or even not
build your project.
-- 232 of 270 --
Packaging Everything – Best Practices for Deployment	212
This is important because we need to generate the smallest file possible as this results in a greater
perception of performance for our users, especially if they are using a device on a 3G network.
One way to reduce file sizes is to use Angular’s lazy-loading capabilities (for more details on this
feature, see Chapter 2, Organizing Your Application).
The outputHashing attribute ensures that the files generated by the application have their names
added to a hash.
This is important because most public clouds and Content Delivery Networks (CDNs) cache the
application based on the name of the files. When we generate a new version of our app, we want 

---

## Summary

In this chapter, we explored the techniques and capabilities of Angular when deploying our application
to production.
We started by uploading our backend to the cloud, where it will be available for our frontend application.
Then, we adapted our application to differentiate the development environment and the production
environment using the Angular feature of environment.ts files.
We explored the ng build command and all the tasks that Angular performs for us to make our
application as lean as possible to be faster for our users.
We learned about Docker and how we can package our Angular application to run on a web server
such as Nginx regardless of the type of machine our application runs on.
Finally, we learned about another way to deploy to the cloud with the Azure Static Web Apps service
and saw how it automates this process by creating a GitHub action script.
In the next chapter, we will explore the latest Angular innovations, including Angular Signals.
-- 240 of 270 --
-- 241 of 270 --
13
The Angular Renaissance
Our applications need to continually evolve, and to meet this need, the Angular framework and its
ecosystem also continue to evolve.
In this chapter, we will learn about the latest features of Angular. While many of them are still in
the developer preview phase, it is important for us to get a glimpse of what the future holds for this
incredible framework.
In this chapter, we will cover the following topics:
• 	Updating your project with the Angular CLI
• 	Using a new way to create templates – control flow
• 	Improving the user experience using the defer command
• 	Creating transitions between pages – view transactions
• 	Simplifying application states – Angular Signals
By the end of this chapter, you will have learned how to stay up to date with future versions of the
framework and how to update your project.

---

## Technical requirements

To follow the instructions in this chapter, you’ll need the following:
• 	Visual Studio Code (https://code.visualstudio.com/Download)
• 	Node.js 18 or higher (https://nodejs.org/en/download/)
The code files for this chapter are available at https://github.com/PacktPublishing/
Angular-Design-Patterns-and-Best-Practices/tree/main/ch13.
During the course of this chapter, remember to run the backend of the application found in the
gym-diary-backend folder with the npm start command.
-- 242 of 270 --
The Angular Renaissance	222
Updating your project with the Angular CLI
The Angular framework is continually evolving with new features and optimizations, but to help
communities and developers keep organized and their applications up to date, the Angular team uses
semantic versioning to number their releases.
A semantic version number is composed of three parts and each part has the following representation:
• 	Major: A number that is increased every time there is a change in the framework, which in turn
requires us to change something in our application so that it continues to work, also known
as a breaking change
• 	Minor: A number that is increased when the new version has a new functionality that we can
use, but if we don’t use it, we don’t need to change our application
• 	Patch: A number that is increased when there is a correction to the framework and we do not
need to change our code; this is widely used for versions that have security corrections
In this book, we are working with version 16.2.0 of Angular, and the next version will be 17.0.0, which
will bring new functionality and also some breaking changes. While the the term “breaking changes”
is used, we should note that the Angular team has taken more and more care with these changes and
currently, they only affect very specific cases that the vast majority of applications are not affected by.
In addition to rigorous versioning, the Angular team takes care to release major releases every six
months, allowing the team to plan application updates. You may ask, should I always update the
Angular version of my application? The answer is yes, and here are some reasons:
• 	Every new version brings internal improvements to the framework that improve the rendering
engines, which can make your application faster and the build time and the bundle size smaller
and more optimized
• 	New features give you more possibilities to create better experiences for your users
• 	It provides security updates and framework vulnerability fixes
It is important to highlight that the Angular team is committed to making corrections (long-term
support) for up to two major versions before the current one, which means that using old versions of
Angular can leave your application vulnerable to new security breaches. However, the task of updating
the Angular version of an application is not that complex as the Angular CLI helps to automate the
entire process. Let’s update our project to version 17 of Angular to use the new fe

---

## Improving the user experience using the defer command

The main intention behind the new HTML template flow control syntax was to have a new basis for
building new possibilities in the framework’s templates. The first new feature made possible by the
syntax is the defer instruction, with which it is possible to lazy load components directly from the
HTML template.
We learned in Chapter 2, Organizing Your Application, that the best practice is to separate your
application into functionality modules and configure Angular to load these modules in a lazy way.
This means that the module and its components would only be loaded if the user accessed a certain
route, resulting in smaller bundles and better performance of your application, especially if your user
does not have a good internet connection (such as 3G).
The defer command has the same purpose but instead of working for modules, it works for
standalone components. We studied standalone components in Chapter 11, Micro Frontend
with Angular Elements.
We will start our refactoring by transforming the exercise list components into a standalone
component. In the diary.component.ts file, make the following changes:
@Component({
standalone: true,
templateUrl: './diary.component.html',
styleUrls: ['./diary.component.css'],
imports: [ListEntriesComponent, NewItemButtonComponent],
})
In the preceding code, we have included the standalone attribute set to true and added the
components it depends on directly using the imports attribute.
We will do the same procedure in the EntryItemComponent component:
@Component({
selector: 'app-entry-item',
standalone: true,
templateUrl: './entry-item.component.html',
styleUrls: ['./entry-item.component.css'],
imports: [DatePipe],
})
In this component, in addition to the standalone property, we need to add the dependency so
that the date pipe works. It is necessary to note that the standalone component needs to have its
dependencies declaratively in the imports attribute, since it is not linked to any Angular module.
-- 247 of 270 --
Improving the user experience using the defer command 	227
To lazy load the template, we will also convert the NewItemButtonComponent component into
a standalone one:
@Component({
selector: 'app-new-item-button',
templateUrl: './new-item-button.component.html',
styleUrls: ['./new-item-button.component.css'],
standalone: true,
})
The last component to be converted into a standalone component is ListEntriesComponent,
changing it as follows:
@Component({
selector: 'app-list-entries',
standalone: true,
templateUrl: './list-entries.component.html',
styleUrls: ['./list-entries.component.css'],
imports: [EntryItemComponent],
})
In this example, we added the EntryItemComponent dependency to the import attribute.

---

## Important note

The unit tests were also adjusted to consider the component dependencies in the TestBed
definition, and you can find the test code in the GitHub repository of this chapter.
The last adjustment must be made in the DiaryModule module:
@NgModule({
declarations: [
NewEntryFormTemplateComponent,
NewEntryFormReactiveComponent,
],
imports: [
CommonModule,
DiaryRoutingModule,
RouterModule,
FormsModule,
ReactiveFormsModule,
],
})
export class DiaryModule {}
-- 248 of 270 --
The Angular Renaissance	228
As we will dynamically load the components that were converted to standalone, we have to remove
these components from the declarations attribute of the module.
After this preparation, we can use the defer command in the diary.component.html file:
@defer {
<app-list-entries
[exerciseList]="exerciseList"
(deleteEvent)="deleteItem($event)"
(editEvent)="editEntry($event)"
/>
}
To use the defer command, we must create a block that includes the components that we want to
lazy load.
If we run our application and analyze the Networks tab, we will notice that specific bundles are loaded
when the screen is rendered:
Figure 12.1 – Lazy-loaded bundle
We can see that the effect is similar to the lazy loading of a route module, but defer has other
interesting options. Let’s see this in practice by changing our code:
. . .
@defer (on hover(trigger)){
<app-list-entries
[exerciseList]="exerciseList"
(deleteEvent)="deleteItem($event)"
(editEvent)="editEntry($event)"
/>
}
. . .
<button
#trigger
class="rounded bg-blue-500 px-4 py-2 font-bold text-white
hover:bg-blue-700"
(click)="newList()"
>
Server Sync
</button>
. . .
-- 249 of 270 --
Improving the user experience using the defer command 	229
With the on hover(trigger) condition, the list is loaded when we hover over the Server Sync
button. This is just an example; the defer command opens up a range of opportunities for fine-tuning
the user experience. The defer command has the following conditions:
• 	on immediate: The component will be loaded the moment the screen is rendered.
• 	on idle: The component will be loaded on the first call to the browser requestIdleCallback
API. This API allows non-blocking processing in the browser and is the default behavior of
the defer command.
• 	on hover(target): We can define another interface component and loading will occur
when the user hovers over this component.
• 	on timer(time): Allows us to define in milliseconds when the component will be loaded
after the interface is rendered.
• 	on viewport(target): When the target component is in the browser’s viewport, the child
components will be loaded. This behavior is ideal for loading a component that is located after
the user has scrolled to the end of the page.
• 	on interaction(target): It has a similar behavior to on hover, but it will be triggered
by some interaction, such as a click.
• 	when (condition): Allows us to control the loading of the component imperatively,
through a Boolean attribute, or a function that returns a Boolean

---

## Important note

The View Transitions API was created in 2023 and is being gradually adopted by browsers.
Go to https://caniuse.com/ and check whether the browsers your users will use have
support for this API.
In the next section, we will explore Angular Signals and how we can use it to simplify state control
in our application.
Simplifying application states – Angular Signals
Controlling the state of a frontend application is one of the biggest challenges for a developer, as by
nature, the interface is dynamic and needs to react to various user actions. Angular, with its stacks
included philosophy, already had tools suitable for this task, and we studied in Chapters 5, Angular
Services and the Singleton Pattern, and Chapter 9, Exploring Reactivity with RxJS, how to use these
tools. However, despite being effective, the Angular community and team recognize that they are a bit
complex for new developers and for simple cases of reactivity in frontend projects. To fill this gap, the
Angular team introduced, from version 17 onward, a new element to the framework, called Signals.
According to the Angular documentation, a signal is a wrapper around a value that notifies consumers
when that value changes. An analogy that you can associate with a signal is a cell in a spreadsheet. It
can contain a value and we can create formulas in other cells that use its value to create other values.
Before refactoring our application, let’s illustrate this with a simpler example:
let a = signal<number>(2);
let b = signal<number>(3);
let sum = computed(() => a() + b());
console.log(sum());
To create a signal, we use the signal function, where we define what type of value it will store and
declare an initial value for it. A signal can be writable or read-only; in this case, the variables a and
b are writable. The variable c is also a signal but of a specific type, called computed. The computed
type is, in our analogy of a spreadsheet, a cell that contains a formula where you can read the values
of other cells to determine its value. Finally, we are reading the value of the signal by simply calling it
as a function. The result of this code snippet is the value 5.
-- 253 of 270 --
Simplifying application states – Angular Signals 	233
We will now change the example:
let a = signal<number>(2);
let b = signal<number>(3);
let sum = computed(() => a() + b());
console.log(sum());
a.set(9);
console.log(sum());
In this change, we are updating the value of signal a using the set method. When reading the sum
signal, we can notice that the value was updated to 12. Notice that the calculation reacts in real time
just like it would in a spreadsheet..
Another way to update the value of a writable signal is by using the update method:
let a = signal<number>(2);
let b = signal<number>(3);
let sum = computed(() => a() + b());
console.log(sum());
a.set(9);
console.log(sum());
b.update((oldValue) => oldValue * 2);
console.log(sum());
The update method allows you to update the signal based on the last valu

---

## Summary

In this chapter, we explored the possibilities that the future of the Angular framework can offer us. We
learned how to update our project to new versions of Angular, an ongoing activity as the framework
continues to evolve. We understood how Angular versioning works and the importance of continually
updating our project, from the point of view of security, performance, and new features. Then, we
changed our application to use the new template expressions, which, in addition to simplifying, can,
depending on the case, improve the performance of our applications. With this improvement in template
expressions, we looked at the defer expression, which allows for the lazy loading of components
within templates, giving us new options for optimizing interfaces with complex components. We
also learned how to use the View Transactions API to improve our users’ experience with animations
between page changes. Finally, we explored Angular Signals and simplified the state management of
our application with this new element that complements RxJs. Angular is a framework that never
stops evolving, as our users never stop demanding new features. In this chapter, we learned how to
stay up to date with Angular.
-- 258 of 270 --
-- 259 of 270 --

---

## Index

A
Ahead-of-Time (AOT) compilation 212
Angular CLI 5, 16, 110
project, updating with 222, 223
Angular DevTools 11, 12
Angular Language Service 7
URL 7
Angular module 22
business domain modules 25-28
component modules 28
usage, optimizing 30-32
versus JavaScript module 24, 25

---

## Angular project

starting 12-15
structure 15, 16
Angular, selecting reasons 4
batteries included 4
community 4
Google support 4
tooling 5

---

## Angular update website

URL 18
anti-pattern
avoiding 29, 30
any type 40
alternative 52, 53
application
size, improving 32-35
slicing, in micro frontend 187, 188
application, organizing with
Angular module 22
declarations 22
exports 23, 24
imports 23
providers 23
application states
simplifying 232-237
AppModule 24
array data structure 39
async pipe
subscription ways, managing with 153-155
AWS
URL 202
Azure Static Web Apps
page, deploying to 215-218
B
backend
deploying 202-206
bundling 212
business domain modules 25-28
business rules 76
-- 260 of 270 --
Index	240
C
child component
communication from 68-70
classes 40-46
component modules 28
components 55
communication between 60-62
creating 56-59
properties 58
component testing 177, 178
Container component 65
Content Delivery Networks (CDNs) 212
control flow 223
custom validations 104-107
Cypress 167
for end-to-end (E2E) tests 179-184
D
data consumption
optimizing 157, 158
data handling
operators transformation 151, 152
data validation 101-103
dead code elimination 212
defer command
used, for improving user experience 226-230
dependency injection pattern 78, 79
development environment
configuring 7

---

## Docker image

mounting, with Nginx 213-215
Dumb component 65
dynamic routes 116
E
ECMAScript modules (ESM) 25
EditorConfig 8
URL 8
encapsulation of attributes 41
end-to-end tests (E2E tests) 166, 167
with Cypress 179-184
environments
differentiating 207-210
ESLint 8
URL 8
events
propagating, from nested components 70-73
exploratory tests 167
F
filter operators 157, 158
Fira Code font 9
URL 10
frontend business rules
examples 76
functions
creating 47, 48
G
GCP
URL 202
Git Extension Pack 7
URL 7
GitHub action 218
Gym Diary application 112
dynamic routes 116-122
error page and title, defining 113-116
experience, optimizing 129-131
-- 261 of 270 --
Index	241
interceptor, used for attaching
token to request 134-139
loader, creating 141-143
performance of request, measuring 146-148
request route, modifying 139, 140
routes, securing 122-129
success, notifying of backend
request to user 144, 145
H
high-order operators 156, 157
I
information flows
connecting 156, 157
inject() function
using 80
@Input annotation 60, 61
integration tests 166
interceptor
token, attaching to request 134-139
interfaces 43-46
Ivy 24
J
Jasmine 6, 167
using 167-169
JavaScript module
versus Angular module 24, 25
K
Karma 6, 167
using 167-169
L
lazy loading 32-35
libraries, Angular 5
Jasmine 6
Karma 6
RXJS 6
TypeScript 5
Webpack 6
Ligatures 9
loader
creating 141-143
M
manual tests 167

---

## Material

URL 15
methods
creating 47, 48
micro frontend 185, 186
application, slicing in 187, 188
loading, dynamically 196-199
micro frontend application
creating, with standalone
components 188-193
microservices 186
minification 212

---

## Mocha

URL 180
module federation
reference link 187
modules 110
-- 262 of 270 --
Index	242
N
navigation 113
nested components
events, propagating from 70-73
NestJS framework
URL 202
ng add command 17, 18
ng build command 19
ng deploy command 19
ng generate command 19

---

## Nginx

Docker image, mounting with 213-215
NgModules 22
ng new command 15
NgRx
URL 5
ng serve command 18
ng update command 18
null values
working with 48, 49
O
observables 150
operators 150
decision tree 159
filter operators 157, 158
selecting 159, 160
transformation 151, 152
@Output annotation
using 68-70
P
page
deploying, to Azure Static
Web Apps 215-218
preparing, to be loaded by base
application 193-196
performance 129
polymorphism 45
Presentation component 65, 68
creating, with Angular CLI 66, 67
Prettier 8
URL 8
primitive types 38
Boolean 38
Number 38
String 38
production bundle
preparing 210-212
production mode 212
project
updating, with Angular CLI 222, 223
Protractor 167, 179
R
reactive forms 92, 97-101
Reactive Manifesto
URL 6
Representational State Transfer
(REST) protocol 83
request route
modifying 139, 140
Requests for Comment (RFCs) 5
resolve property
using 130, 131
REST API
consumption 83-86
route guard feature
using 122-129
routes 110-112
RXJS library 6
-- 263 of 270 --
Index	243
S
semantic version number
major 222
minor 222
patch 222
services 75, 76
creating 76-78
used, for communicating between
components 80-83
service tests 169-173
SharedModule pattern 30-32
signal 232
single module app 29, 30
single-page application
(SPA) 24, 65, 109, 133, 186, 213
singleton pattern 81
Smart component 65, 68
spy 167
standalone components
micro frontend application,
creating with 188-193
T
template-driven forms 92-97
templates
creating 223-225
TestBed 173-176
test pyramid 166
tests
fixing 173-176
TrackBy property
advantages 65
using 63-65
transitions
creating, between pages 230-232

---

## Transloco

URL 5
tree shaking 212
TSLint 8
type aliases 45, 46
typed reactive forms 107, 108
type guards 50-52
type inference 49
TypeScript 5
U
uglification 212
unit tests 166, 167
V
View Transitions API 230
VS Code 7
extensions and settings, standardizing
in project 10, 11
settings 9
URL 7
VS Code plugins, for Angular applications
Angular Language Service 7
EditorConfig 8
ESLint 8
Git Extension Pack 7
Prettier 8
W
Webpack 6
WebStorm
reference link 7
Y
yarn 15
-- 264 of 270 --
-- 265 of 270 --
www.packtpub.com
Subscribe to our online digital library for full access to over 7,000 books and videos, as well as
industry leading tools to help you plan your personal development and advance your career. For more
information, please visit our website.
Why subscribe?
• 	Spend less time learning and more time coding with practical eBooks and Videos from over
4,000 industry professionals
• 	Improve your learning with Skill Plans built especially for you
• 	Get a free eBook or video every month
• 	Fully searchable for easy access to vital information
• 	Copy and paste, print, and bookmark content
Did you know that Packt offers eBook versions of every book published, with PDF and ePub files
available? You can upgrade to the eBook version at packtpub.com and as a print book customer, you
are entitled to a discount on the eBook copy. Get in touch with us at customercare@packtpub.
com for more details.
At www.packtpub.com, you can also read a collection of free technical articles, sign up for a range
of free newsletters, and receive exclusive discounts and offers on Packt books and eBooks.
-- 266 of 270 --
Other Books You May Enjoy
If you enjoyed this book, you may be interested in these other books by Packt:
Reactive Patterns with RxJS for Angular
Lamis Chebbi
ISBN: 978-1-80181-151-4
• 	Understand how to use the marble diagram and read it for designing reactive applications
• 	Work with the latest features of RxJS 7
• 	Build a complete Angular app reactively, from requirement gathering to deploying it
• 	Become well-versed with the concepts of streams, including transforming, combining, and
composing them
• 	Explore the different testing strategies for RxJS apps, their advantages, and drawbacks
• 	Understand memory leak problems in web apps and techniques to avoid them
• 	Discover multicasting in RxJS and how it can resolve complex problems
-- 267 of 270 --
247	Other Books You May Enjoy
Learning Angular, Fourth Edition
Aristeidis Bampakos, Pablo Deeleman
ISBN: 978-1-80324-060-2
• 	Use the Angular CLI to scaffold, build, and deploy a new Angular application
• 	Build components, the basic building blocks of an Angular application
• 	Discover new Angular Material components such as Google Maps, YouTube, and multi-select
dropdowns
• 	Understand the different types of templates supported by Angular
• 	Create HTTP data services to access APIs and provide data to components
• 	Learn how to build Angular apps without modules in Angular 15.x with standalone APIs
• 	Improve your de

---

## Packt is searching for authors like you

If you’re interested in becoming an author for Packt, please visit authors.packtpub.com and
apply today. We have worked with thousands of developers and tech professionals, just like you, to
help them share their insight with the global tech community. You can make a general application,
apply for a specific hot topic that we are recruiting an author for, or submit your own idea.
Share Your Thoughts
Hi,
I am Alvaro Camillo Neto, author of Angular Design Patterns and Best Practices. I really hope you enjoyed
reading this book and found it useful for increasing your productivity and applications using Angular.
It would really help me (and other potential readers!) if you could leave a review on Amazon sharing
your thoughts on this book.
Go to the link below to leave your review:
https://packt.link/r/1837631972
Your review will help me to understand what’s worked well in this book, and what could be improved
upon for future editions, so it really is appreciated.
Best Wishes,
Alvaro Camillo Neto
-- 269 of 270 --
249
Download a free PDF copy of this book
Thanks for purchasing this book!
Do you like to read on the go but are unable to carry your print books everywhere?
Is your eBook purchase not compatible with the device of your choice?
Don’t worry, now with every Packt book you get a DRM-free PDF version of that book at no cost.
Read anywhere, any place, on any device. Search, copy, and paste code from your favorite technical
books directly into your application.
The perks don’t stop there, you can get exclusive access to discounts, newsletters, and great free content
in your inbox daily
Follow these simple steps to get the benefits:

---

