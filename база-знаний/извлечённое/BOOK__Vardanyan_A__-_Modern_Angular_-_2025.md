# Vardanyan A. - Modern Angular - 2025

> **Источник:** Vardanyan A. - Modern Angular - 2025
> **Дата извлечения:** 2026-06-03
> **Концепции:** signals, computed-signals, effects, standalone, change-detection, defer, control-flow, di, routing, http, rxjs, pipes, components, templates, testing, animations, performance, modules, model-inputs, advanced-components
> **Размер текста:** 682804 символов

---

## An idea arrives

The idea is explored.
An RFC document is compiled.
The draft is initially shared internally.
The draft is reviewed.
The RFC goes public.
Comments and feedback are gathered.
The feature is added into a release.
If the change is too revolutionary, the feature is marked as developer preview.
If the feature is successful, it is marked as stable.
Either as a GitHub
issue or an idea
from the team itself
The Angular team
privately experiments
with it and finds viable
implementations.

---

## The core team discourages

the developers from using the
feature in production codebases,
instead expecting developers to
“play” with it. Usually developer
preview features appear in major
releases.
-- 2 of 306 --
Modern Angular
ALSO COVERS SIGNALS , STANDALONE ,
SSR, ZONELESS , AND MORE
A RMEN VARDANYAN
M A N N I N G
S HELTER I SLAND
-- 3 of 306 --
For online information and ordering of this and other Manning books, please visit
www.manning.com. The publisher offers discounts on this book when ordered in quantity.
For more information, please contact
Special Sales Department
Manning Publications Co.
20 Baldwin Road
PO Box 761
Shelter Island, NY 11964
Email: orders@manning.com
©2025 by Manning Publications Co. All rights reserved.
No part of this publication may be reproduced, stored in a retrieval system, or transmitted, in
any form or by means electronic, mechanical, photocopying, or otherwise, without prior written
permission of the publisher.
Many of the designations used by manufacturers and sellers to distinguish their products are
claimed as trademarks. Where those designations appear in the book, and Manning Publications
was aware of a trademark claim, the designations have been printed in initial caps or all caps.
Recognizing the importance of preserving what has been written, it is Manning’s policy to have
the books we publish printed on acid-free paper, and we exert our best efforts to that end.
Recognizing also our responsibility to conserve the resources of our planet, Manning books
are printed on paper that is at least 15 percent recycled and processed without the use of
elemental chlorine.
The authors and publisher have made every effort to ensure that the information in this book
was correct at press time. The authors and publisher do not assume and hereby disclaim any
liability to any party for any loss, damage, or disruption caused by errors or omissions, whether
such errors or omissions result from negligence, accident, or any other cause, or from any usage
of the information herein.
Manning Publications Co. 	Development editor: Ian Hough
20 Baldwin Road 	Technical editor: Santosh Lalchand Yadav
PO Box 761 	Review editor: Dunja Nikitovic´
Shelter Island, NY 11964 	Production editor: Deirdre Blanchfield-Hiam
Copy editor: Kari Lucke
Proofreader: Keri Hales
Technical proofreader: Tanya Wilke
Typesetter: Dennis Dalinnik
Cover designer: Marija Tudor
ISBN: 9781633436923
Printed in the United States of America
-- 4 of 306 --
Dedicated to my sister, Marina, who bought for me all my laptops except
the one I used to write this book
-- 5 of 306 --
iv
contents
preface 	x
acknowledgments 	xii
about this book 	xiv
about the author 	xvii
about the cover illustration 	xviii
1 Welcome to modern Angular 	1
1.1 	What to expect 	2
Who will benefit from reading this book? 	2 ■ What do we need to
know before getting started? 	2 ■ How is the book structured? 	3
1.2 	How Angular was 	3
Angular’s core features 	4 ■ What is an Angular application? 	5
1.3 	Let’s start a modern Ang

---

## Who should read this book

Modern Angular is meant to be utilized by people who are already familiar with Angu-
lar and have worked on projects before; it is good both for developers who just
learned the important basics of the framework and those already very experienced
with it. Additionally, it is useful to developers who maintain large legacy projects and
look for strategies to bring their code up to modern standards.
How this book is organized: A road map
The book consists of 10 chapters, each covering a set of distinct new features. Each
chapter first explores the old approach of doing things, then dives into the new
approach by utilizing it in a brand-new project, and finally shows ways and strategies to
help migrate existing codebases.
 Chapter 1 discusses modern Angular as a whole, why the changes are happen-
ing, how to set up a project from scratch using the recent Angular versions, and
what structure these new projects have.
-- 16 of 306 --
ABOUT THIS BOOK 	xv
 Chapter 2 discusses standalone Angular building blocks, why we want them,
how to perform all common tasks with standalone components, and how to
migrate module-based components to become standalone.
 Chapter 3 dives into Angular’s dependency injection mechanism, discusses the
inject function, how it changed developers’ approaches to dependency injec-
tion, and what building blocks were affected by this change.
 Chapter 4 explores various small new additions and improvements, like the opti-
mized image loader, improved component inputs, better debugging options,
and more.
 Chapter 5 discusses RxJS and how it works with Angular as of now and the new
built-in interoperability library, tying in dependency injection improvements
from chapter 3 to new approaches with RxJS.
 Chapter 6 introduces signals, explains why they are necessary, and provides
high-level knowledge about all of their features.
 Chapter 7 dives deep into signals, explaining how they can improve application
performance and how to approach some advanced tasks like state management
and RxJS interoperability with them.
 Chapter 8 discusses unit testing in modern Angular applications and some new
useful tools that can help with the task.
 Chapter 9 talks about server-side rendering, how it can enhance application
performance, and how to build applications that utilize service-side rendering
and web page prerendering.
 Chapter 10 discusses future prospects of the Angular framework like zoneless
change detection and completely signal-based applications, and also explores
some experimental new features that are already available like the new template
syntax and deferred loading of components.
Readers are expected to read the book from start to end; however, after reading the
first two chapters, developers can feel free to read the chapters on topics that interest
them the most.

---

## About the code

This book contains many examples of source code both in numbered listings and in
line with normal text. In both cases, source code is formatted in a fixed-width font
like this to separate it from ordinary text. Sometimes code is also in bold to high-
light code that has changed from previous steps in the chapter, such as when a new
feature adds to an existing line of code.
In many cases, the original source code has been reformatted; we’ve added line
breaks and reworked indentation to accommodate the available page space in the
book. In rare cases, even this was not enough, and listings include line-continuation
markers (➥). Additionally, comments in the source code have often been removed
-- 17 of 306 --
ABOUT THIS BOOK	xvi
from the listings when the code is described in the text. Code annotations accompany
many of the listings, highlighting important concepts.
Please note: in chapter 10, we take a different route by exploring some experimen-
tal features on the code we already built; to have access to both versions, readers can
use the source code repository and switch to the branch named “chapter-10” to review
the other version.
The complete code for the examples in the book is available for download from
the Manning website at https://www.manning.com/books/modern-angular, and from
GitHub at https://github.com/Armenvardanyan95/modern-angular-hrms.
liveBook discussion forum
Purchase of Modern Angular includes free access to liveBook, Manning’s online read-
ing platform. Using liveBook’s exclusive discussion features, you can attach comments
to the book globally or to specific sections or paragraphs. It’s a snap to make notes for
yourself, ask and answer technical questions, and receive help from the author and
other users. To access the forum, go to https://livebook.manning.com/book/modern
-angular/discussion. You can also learn more about Manning’s forums and the rules
of conduct at https://livebook.manning.com/discussion.
Manning’s commitment to our readers is to provide a venue where a meaningful
dialogue between individual readers and between readers and the author can take
place. It is not a commitment to any specific amount of participation on the part of
the author, whose contribution to the forum remains voluntary (and unpaid). We sug-
gest you try asking the author some challenging questions lest his interest stray! The
forum and the archives of previous discussions will be accessible from the publisher’s
website as long as the book is in print.
-- 18 of 306 --
xvii
about the author
ARMEN VARDANYAN is a Google Developer Expert for Angular and a frontend team lead
with eight years of experience. He writes articles about Angular, TypeScript, RxJS, NgRx,
and other related technologies and sometimes appears as a speaker at conferences.
-- 19 of 306 --
xviii
about the cover illustration
The figure on the cover of Modern Angular, “Jeune Fille Armenienne,” or “Young Arme-
nian girl,” is taken from a four-volume set by Auguste Wahlen, publishe

---

## Welcome to

modern Angular
Angular, one of the most popular frontend development frameworks, is at a cross-
roads. The framework has seen years of improvements in performance, user expe-
rience, and new features, like the introduction of the Ivy rendering engine, which
reduced bundle sizes and improved run time. These developments have put the
framework in a beneficial position.
Now, the community can focus on more than just improving the visible parts of
the framework and, instead, work on the parts that directly affect user experience.
Importantly, attention can also be directed toward aspects that affect the developer
experience, such as better scalability and composability, among other aspects.
These aspects are even more valuable for developers who work with the framework.
Versions of the Angular framework have improved both the user and developer
experiences, and more enhancements will continue to be added in future versions.

---

## This chapter covers

 Our expectations of and goals for reading
this book
 A general overview of common problems in
previous versions of Angular apps
 New solutions for those problems provided
by recent versions of Angular
-- 21 of 306 --
2 	C HAPTER 1 Welcome to modern Angular
With this goal in mind, the Angular team has delivered several important updates
in recent versions (starting in v13 and v14), which have become essential break-
throughs, putting Angular on a path of almost revolutionary changes. By the time this
book is in print, Angular v19 will be live as the latest iteration of Angular, packed with
an arsenal of modern tools built for various problems. We will cover all features, how-
ever minor, in recent releases (v12–v18) in rigorous depth, with examples, practical
guides, and exercises.
1.1 	What to expect
Before discussing what’s new in Angular, let’s first define who this book might be use-
ful for, what skills and knowledge will be minimally required to grasp the concepts
fully, and how the book is structured. Let’s begin with the learning subjects.
1.1.1 	Who will benefit from reading this book?
In light of the recent changes to Angular, several groups of developers who will need
to understand the new features will find this book very useful:
 New adopters of Angular—Developers may either come from other frameworks or
just have adopted Angular and want to learn about the latest features in more
detail (assuming a base level of expertise)
 Seasoned Angular developers—Even the most experienced Angular developers can
benefit from this book, as it provides a comprehensive overview of all the new
features and changes introduced in Angular v12–v18.
 Developers using an older version of Angular—This book can help those using an
older version of Angular to understand the benefits of upgrading to the latest
version—and how to do it quickly and smoothly. In addition to covering the
new features and changes introduced in recent versions, we’ll discuss other rel-
evant topics, such as changes that have been backported.
1.1.2 	What do we need to know before getting started?
Certain knowledge is required to maximize the amount of information digested from
this book. It is important to understand that this book is not an Angular tutorial, which
would explain everything from scratch, but rather a guidebook of new features for
developers already familiar with Angular and seeking more in-depth knowledge of mod-
ern approaches and tools. If you are unfamiliar with some concepts, see Pro Angular 16
by Adam Freeman (Manning, 2024; https://www.manning.com/books/pro-angular-16),
which follows a tutorial-based approach and has helpful explanations of more basic
concepts. You can keep Pro Angular 16 as a reference for this one; sometimes, I will ref-
erence it to help explain some concepts.
This book will explain (albeit briefly) some more advanced concepts necessary for
the narration. Besides those explanations, the book assumes basic-to-intermediate
knowledge of A

---

## Recruitment

Figure 1.1 The relations between different parts of the application, with arrows representing relations between
different modules, like shared components or services
-- 26 of 306 --
7	1.3 	Let’s start a modern Angular app
1.3 	Let’s start a modern Angular app
There are different ways of starting a new project with Angular, including different
custom and third-party builders, bundlers, and other tools. However, those tools,
while doubtlessly useful, are out of scope for this book; be mindful that through the
entire course of the book, we are going to use the official Angular CLI and the official
Angular CLI only.
If you do not have the Angular CLI on your machine, use the official Angular doc-
umentation page (https://mng.bz/PNEY) for proper installation; if you have an older
version of Angular CLI, please install at least v16.0.0; if you have already done those
steps, then proceed with this chapter, as we explore what a modern Angular applica-
tion looks like.
1.3.1 	Using the Angular CLI
The Angular CLI has a bunch of different commands and custom schematics. In this
book, we will gradually encounter different (some quite new) scripts that would allow
us to build using specific settings, generate environment files, migrate existing code,
and so on. For now, we will focus on the probably most well-known command, ng new,
which is used to create new projects.
ng new has several customization options for a newly created project, and the dedi-
cated section of the Angular documentation explains them quite well. Here, however,
we will focus on six of them, as outlined in table 1.2.
Table 1.2 	Important parameters for creating a new Angular project
Parameter 	Description Default
value
--strict 	Enables strict type-checking in both templates and TypeScript files 	True
--inline-
template
Makes component templates inline by default. With the rise of stand-
alone components, this approach has become very popular. Throughout
the book, we will show whole components with inline templates to
ensure maximum readability, but this is not considered either a good or
bad practice and depends on developer preference.

---

## False

--package-
manager
Allows us to select which package manager to use (if we do not like npm
for whatever reason) in the project. Angular CLI commands like ng add
or ng update will use this option under the hood to install and update
dependencies. We will stick to the default in this book, but you are wel-
come to explore other options.
npm
--standalone 	This option is the most important for us, as it creates an application
without NgModules by default, as it does with modern-day Angular apps.
We will use this one outright.

---

## True

-- 27 of 306 --
8 	C HAPTER 1 Welcome to modern Angular
1.3.2 	Creating a new project
Now, as we have familiarized ourselves with several command options, let us go for-
ward and finally create a new application. If you are using Angular v16, you will have
to manually specify that you want a standalone component-based application. In v17
and higher, you can skip this parameter.
Navigate to a folder/directory of your preference and run the following command:
ng new hrms --defaults --standalone --routing
NOTE 	Depending on your CLI version (v16 or lower), you might see a warn-
ing that says, “Standalone application structure is new and not yet supported
by many existing 'ng add' and 'ng update' integrations with community librar-
ies.” This statement mostly applies to using third-party libraries and is not very
relevant to our application, so you can safely ignore it.
After all the installations are done, we should be able to see our new project. Let’s
open it with our chosen editor and explore the folder structure first. Most probably,
the application looks something like this:
└── hrms/
├── src/
├── angular.json
├── package.json
├── tsconfig.app.json
├── tsconfig.json
└── tsconfig.spec.json
Note that there can be several other files not mentioned here, like Git-related files,
editor-specific autogenerated files, a README.md file, or more.
Let's pay attention to three important changes, as opposed to what we used to have
in older versions:
 No environments folder—Environment files are used to store application configu-
ration data like API URLs or third-party API configurations that might differ
from environment to environment. Starting from Angular v15, environment
files are not generated by default and can be added via a separate command.
We will talk more about environments and builds/deployments in chapter 9.
 No explicit polyfills.ts file —Polyfills are used to support older browsers like IE11
or prior. Previously, an Angular project had this file by default from the very
–defaults 	Skips the prompt questions and uses default values without asking.
For example, it will generate an Angular routing, use CSS for styles,
and so on.

---

## False

Table 1.2 	Important parameters for creating a new Angular project (continued)
Parameter 	Description Default
value
-- 28 of 306 --
9	1.3 	Let’s start a modern Angular app
beginning of the project, but now it is no longer autogenerated. This can also
be added manually if necessary to support older browsers.
 If we open the angular.json file, we will notice it is far shorter than we used to
have in older projects.
1.3.3 	What changed?
Now, let us open the most interesting folder, src, and see what it contains:
.
└── hrms/
└── src/
├── app/
│ 	├── app.component.css
│ 	├── app.component.html
│ 	├── app.component.spec.ts
│ 	├── app.component.ts
│ 	├── app.config.ts
│ 	└── app.routes.ts
├── assets/
├── index.html
├── main.ts
└── styles.css
Here, we can see another three differences from what we are used to:
 No app.module.ts file—The application is fully standalone and does not utilize
modules for its architecture
 app.routes.ts file instead of app.routing.module.ts—This is again because we chose
standalone
 app.config.ts file—This file will contain global configurations for our app, like
providers, routing initialization, and more.
Now, let’s start exploring the file contents themselves. app.component.html contains a
predefined welcome page, app.component.spec.ts contains some boilerplate unit
tests, and app.component.css is empty, so we will skip them. Let us now review the con-
tents of app.component.ts.
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
@Component({
selector: 'app-root',
standalone: true,
imports: [CommonModule, RouterOutlet],
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']
})
Listing 1.1 	AppComponent, the root component of the project
-- 29 of 306 --
10 	C HAPTER 1 Welcome to modern Angular
export class AppComponent {
title = 'hrms';
}
This code looks like a fairly common Angular component, but it has two important
distinctions:
 standalone: true marks this component as standalone and not belonging to
any NgModule
 The imports array is used to import dependencies, like other modules and
standalone components/directives/pipes, as this component is standalone and
does not rely on an NgModule to locate its dependencies and instead imports
them directly. Note that in v16 it imports CommonModule, to be able to use built-
in directives and pipes, but those things are now also standalone and can be
imported directly. That is, we can write NgIf in the imports array and import
only itself instead of bringing the entire CommonModule. In v17+, CommonModule
is not imported by default.
This is how a standalone component typically looks like, but of course, there is much
more to it, as we will discuss in the next chapter. Now let's see the app.routes.ts file.
import { Routes } from '@angular/router';
export const routes: Routes = [];
We can see that it is also simpler, as it does not use the RouterModule to register
routes. In

---

## An idea arrives

The idea is explored.
An RFC document is compiled.
The draft is initially shared internally.
The draft is reviewed.
The RFC goes public.
Comments and feedback are gathered.
The feature is added into a release.
If the change is too revolutionary, the feature is marked as developer preview.
If the feature is successful, it is marked as stable.
Either as a GitHub
issue or an idea
from the team itself
The Angular team
privately experiments
with it and finds viable
implementations.

---

## The core team discourages

the developers from using the
feature in production codebases,
instead expecting developers to
“play” with it. Usually developer
preview features appear in major
releases.
Figure 1.2 	The process of integration of new features into Angular
-- 32 of 306 --
13	1.4 	What’s new in Angular?
After those things are gathered, discussions are often started, where contributors
and users can vote on issues they find particularly appealing to them; this is yet
another instance of democratic decision-making in the framework and yet another
proof of how Angular is very feedback-driven and does, very often, listen to the devel-
oper community and adapt to new challenges.
However, it is very important to know that though the democratic process drives a
lot of innovation in Angular, the core team still makes the ultimate decisions. Some-
times a highly requested feature may not be implemented, mainly because it conflicts
with some core values the team has (e.g., backward compatibility, nonalignment with
Web standards, and others we already discussed). Keeping all of this in mind, let us
see the way Angular forges its path into the future.
1.4.3 	Current goals
An important source of information on how Angular chooses its direction is the offi-
cial Angular road map (https://angular.io/guide/roadmap), a detailed list of the fea-
tures Angular is going to address in future releases. We can see a large number of
topics there, but we are not going to explore any of them right now, as most of them
are speculative anyway. However, familiarizing ourselves with the road map can give us
an understanding of what we might expect in the future.
Instead, we will explore some current core goals—significant short-term changes
that either improved the developer experience or laid a foundation for more radical
changes. Those changes will reflect something already existing in the newer versions
of Angular and are not speculative. We will examine those goals in the context of the
previously mentioned HRMS enterprise application to understand what parts of such
an application might improve.
E ASE OF ADOPTION
Another famous (and at least partially correct) stereotype about Angular is that it is
hard to learn or switch to. This is mainly related to the sheer number of features
that Angular provides out of the box, including a very specific template syntax and
other purely Angular-related concepts that the framework introduced like directives,
pipes, and so on. Another important goal for the core team is to make the framework
newcomer-friendly, either through improved documentation or directly by simplify-
ing core concepts.
INCREASED COMPOSABILITY / REUSABILITY
Some Angular building blocks can be hard to reuse or repurpose. For instance, we
can have multiple routing guards or interceptors that essentially do the same thing
(like checking for certain roles or permissions, as mentioned) in different contexts
and have problems being generalized, which can result in loads of copy-pasting a

---

## Possibly

v19
A let keyword
for templates
This new keyword will allow developers to declare variables inside tem-
plates, simplifying the addition of complex logic to templates. These
variables will only be available inside templates.

---

## Possibly

v18.1
-- 37 of 306 --
18 	C HAPTER 1 Welcome to modern Angular
1.4.6 	The learning process
As we saw, each chapter of this book will revolve around one (or more) new concepts
and will explore their real-life applications. In this context, each chapter will be
loosely structured according to the paradigm we set out earlier: exploring a topic and
the theory behind the changes, applying it with code examples, and then challenging
the reader to code. All the solutions will be included in the GitHub repository, but I
recommend they be implemented manually to increase the reader’s skill proficiency.
I hope that this process will be both entertaining and informative and that the
abundance of practical coding will help cement your knowledge of Angular. So, start-
ing here, we begin our deep dive to explore each new feature one by one while build-
ing our modern Angular application.

---

## Summary

 Angular has a rich history and keeps evolving.
 The community has identified a number of outstanding problems with the
framework.
 The core team constantly proposes and implements new approaches to address
those problems.
 A huge set of new concepts has already arrived, such as new dependency injec-
tion, standalone building blocks, signals, type-safe forms, functional building
blocks, and more.
 New projects are now created using a standalone approach.
-- 38 of 306 --
19
A standalone future
In the previous chapter, we learned about recent developments in Angular and laid
out a learning plan for this book. We also created a project and already encoun-
tered standalone components. Now it is the time to explore one of the new capabil-
ities of modern Angular, building applications without NgModules, colloquially
known as standalones, and understand both the benefits and shortcomings of this
approach. To do so, we first need to examine the reasons why teams are making a
switch away from NgModules in a more profound way.

---

## This chapter covers

 Using Angular components, directives, and
pipes without NgModules
 Structuring applications without NgModules
 Routing and lazy-loading of standalone
components
 Migrating existing applications to standalone
-- 39 of 306 --
20 	C HAPTER 2 A standalone future
2.1 	Why abandon NgModules?
As we know, before Angular v14, all Angular applications used NgModules to be able to
run. It was the very first Angular concept new developers learned about, and it was the
glue that held Angular applications together; components, in contrast, were specifi-
cally not that glue. In this context, NgModules were a fundamental part of the frame-
work. So what changed? Why change so drastically? It turns out not everyone was
happy with NgModules.
Before we move on, we need to understand several key points about both modules
and standalones:
 NgModules still exist and are supported, and they have not deprecated. Actually,
deprecation is yet to be discussed.
 Standalone building blocks interop with NgModules just fine; you can have a
module-based project with some standalone components in it, or vice versa, and
you can use NgModules inside your standalone components.
 The goal is to make NgModules optional rather than getting rid of them com-
pletely (at least for now).
 Developers seem to love standalone setups, and it becomes more and more likely
that we, as developers, will encounter more standalone projects in the future.
 The core team itself seems to favor standalones, which makes future depreca-
tion more likely.
Now, let’s cover all the reasons why developers do not like NgModules.
2.1.1 	Hard to learn, hard to explain
NgModules are difficult, both to learn for yourself and to teach or explain to others. To
understand this argument, let’s imagine two scenarios: one in which we are a new
adopter of Angular and another in which we are maintaining an Angular project
onboarding a new member.
LEARNING ANGULAR
We are students of Angular: we just finished learning JavaScript, read some things
about TypeScript, and are now ready to take the Angular world by storm! Here comes
the very first lesson: a concept called NgModules. What are they? Well, the official
explanation from the documentation states: “NgModules configure the injector and
the compiler and help organize related things together” (https://angular.io/guide/
ngmodules).
Not super helpful. What’s an injector? What compiler? It turns out that to under-
stand NgModules, we first need to learn a bunch of other concepts that are considered
(rightfully so) pretty complex for a beginner. So what now? We can examine the
main.ts file, which is apparently the first entry point of our application, and see roughly
what is shown in the following listing.
-- 40 of 306 --
21	2.1 	Why abandon NgModules?
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/en

---

## We can only bootstrap

an NgModule, not the
AppComponent directly;
only then the module will
create the component.
-- 41 of 306 --
22 	C HAPTER 2 A standalone future
Of course, many other questions may arise. We spend a lot of time managing NgModules,
and each team working on a different project has its own view on how NgModules
should be structured, whether there should be a shared module, etc. These nuances
all become quite tedious to explain to a newcomer, and every time someone switches
to a new (existing) Angular project, it feels like a very new experience where things
need to be explained all over again.
We also have another layer of confusion, as TypeScript and JavaScript already have
a concept of a module: we call files that export something a module; in NodeJS, we
write module.exports, and in TypeScript, we use export and import statements to use
functions, classes, and variables from other files. Why have a module concept on top
of this? What’s the difference between those concepts?
In Angular, NgModules are used to group functionality and hold all the dependen-
cies (like pipes, directives, and other components) together in a place called the com-
pilation context. The claim is that NgModules simplify this process and help us structure
our applications, but it is important to understand that this can be done in other ways,
too—ways that do not involve a high-level framework concept and can result in poorly
structured code anyway.
As we can see, this discussion comes into the scope of one of the main goals of the
Angular team—to make Angular and projects built with it more approachable. If we
remember that this was one of Angular’s main goals, the scenarios in this chapter
alone would be reason enough to make the idea of at least optional NgModules very
appealing to both the core team and the wider community. But wait, there’s more!
2.1.2 	Indirectness and boilerplate
When we write code, we tend to split it into different parts and then assemble them
as needed. For instance, we can split a large function into smaller ones, name them
appropriately, and call them whenever necessary in the larger one, making the latter
much more readable. This method also allows for the reuse of the same functionality.
In Angular, we split code into its brand building blocks: components, directives,
pipes, and injectable services. Because injectable services are not related to the tem-
plate, we will focus on the first three. Each building block usually lives in its own sep-
arate file to keep things nice and clean. So, to use, say, a child component in another
component, we need to import it. However, the import process is not direct (e.g., just
importing another component into our component’s file) and involves a more com-
plex mental model.
Let’s see an example of a component from our HRMS application that uses a child
component in its template on a use case of a list of employees that renders individual
employee tiles.
import { Component, Input } from '@angular/core';
impor

---

## Imports another

component via its
own SCAM module
The SCAM module of
the parent component
-- 46 of 306 --
27	2.3 	Developing apps without NgModules
 Easier to migrate to standalone—A new hidden benefit of SCAMs emerged with
the rise of standalone building blocks and the introduction of a migration sche-
matic, which we will discuss in the subsequent sections of this chapter; in short,
SCAMs make it very easy to run the schematic and get a fully standalone appli-
cation without any problems.
Of course, these are very nice benefits, but some of the downsides of NgModules still
remain:
 Extra boilerplate code—While the mental overhead of understanding the applica-
tion structure is reduced, boilerplate code actually goes up; we now have an
NgModule for everything.
 Still somewhat hard to explain and approach—Newcomers would still have to learn
about NgModules, and onboarding into a project will be a bit more complicated
if the new developer is unaware of the SCAM pattern.
 Other modules can still be large—For instance, we would still need to import the
CommonModule to use directives like *ngIf or [ngClass] and possibly add lots of
references to our bundles we do not use.
With all of these benefits and downsides in mind, developers were waiting for the
opportunity to try to get rid of NgModules. Next, let’s finally discuss the new standalone
approach of authoring Angular building blocks.
2.3 	Developing apps without NgModules
Before we begin, let’s briefly examine what standalone will offer when we start devel-
oping with this approach:
 It is possible to build applications completely standalone, as with our new ver-
sion of the HRMS app we initialized in the previous chapter. We will learn how
all this functions without NgModules
 The standalone approach is backward compatible, so NgModules and standalone
components can (and often do) coexist in the same codebase
 Many third-party tools and libraries still have not migrated away from NgMod-
ules, so there is full interoperability between standalone and modules. We will
learn how to handle the connection between them.
We will start with building standalone components in a brand-new project, as we already
have the standalone app in place, and then move over to show how this application is
still fully compatible with other NgModules and how older tools that do not have stand-
alone APIs can be integrated with standalone building blocks. Let’s get started!
2.3.1 	Creating our first standalone component
In every enterprise application (and a number of non-enterprise ones), the user’s jour-
ney begins at one starting point: the proverbial login page. Let’s build one for our
HRMS application. We’ll use template-driven forms (as they are fairly simple) and make
an HTTP call if the form is deemed valid. First, let us create the component itself.
-- 47 of 306 --
28 	C HAPTER 2 A standalone future
CREATING THE COMPONENT
Let’s start by creating a folder named pages inside the src/app directory, so we can
put our routed 

---

## Please fill in all the required fields

</span>
</div>
`,
IMPORTING STANDALONE DIRECTIVES INTO STANDALONE COMPONENTS
Now, we need a way to tell our component what *ngIf is. Of course, we could just add
the CommonModule, which, as we know, contains the NgIf directive, to the imports
array of our component, as we did with FormsModule, and it will certainly work. But
this will cause the import of all other components and directives that CommonModule
contains, like JsonPipe, or NgClass, and we do not need them in this component.
Listing 2.8 	Using *ngIf in a standalone component

---

## Uses the

ngModel
directive
Imports the FormsModule
directly into the component
via its own metadata
-- 49 of 306 --
30 	C HAPTER 2 A standalone future
So how can we fix this problem? Well, the Angular team has us covered: from v15,
all entities from the CommonModule are standalone, so we can dispose of the module
and import whatever we need directly into our components. Let’s bring the NgIf
directive into the login component:
imports: [FormsModule, NgIf],
Now, our component will know what *ngIf means, match with the directive selector,
and let it run, displaying the warning until the user fills in the necessary data. If we
recall what we learned in the previous section about the SCAM approach, this can feel
eerily similar. Essentially, we do what we did with the SCAM module, but with the
added capability of just writing the previously module-related metadata directly into
the component. This is why we mention that having SCAMs in place makes it super
easy to migrate to standalone automatically.
P ROVIDING SERVICES IN STANDALONE COMPONENTS
Now we move to our final concern: let’s make the component a real login component
by adding an HTTP call to an authentication API. For this purpose, we’ll create a ser-
vices folder under the app directory and add an auth.service.ts file in it, as shown in
the following listing.
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable()
export class AuthService {
constructor(private http: HttpClient) { }
login(credentials: { email: string, password: string }) {
return this.http.post('/api/auth/login', credentials);
}
}
This is pretty self-explanatory; the question is, how do we let the login component
know about this service? As with NgModules, we can add this service to the providers
array of the standalone component and then just use it. The following listing provides
the full component code with the HTTP call in place.
import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
@Component({
selector: 'app-login',
Listing 2.9 	Authentication service
Listing 2.10 	Final version of the standalone LoginComponent
-- 50 of 306 --
31	2.3 	Developing apps without NgModules
template: `
<div class="login-container">
<h1>Login</h1>
<form>
<input type="text" name="email" placeholder="Email"
[(ngModel)]="credentials.email">
<input type="password" name="password"
placeholder="Password" [(ngModel)]="credentials.password">
<button type="submit" (click)="submit()">Login</button>
</form>
<span class="warning" *ngIf="!credentials.email ||
!credentials.password">

---

## Please fill in all the required fields

</span>
</div>
`,
standalone: true,
imports: [FormsModule, NgIf],
providers: [AuthService],
})
export class LoginComponent {
credentials = { email: '', password: '' };
constructor(private authService: AuthService) {}
submit() {
if (this.credentials.email && this.credentials.password) {
this.authService.login(this.credentials).subscribe();
}
}
}
We might notice that while the component is functional, it doesn’t do much, as it is
not routed or connected from anywhere to the application; it just exists by itself. Next,
let’s connect it to our application via routing and see it live.
2.3.2 	Routing standalone components and providing dependencies
We already discussed how routing used to work with NgModules and discovered how it
is supposed to be defined in a standalone setup. Now, let’s figure out how to connect
our injection dependencies (DIs) and make our component routable.
Let’s begin by remembering how DI works in Angular. We will not dive too deep, as
the next chapter is already dedicated to fully understanding DI, but we will examine
the two core principles: how a dependency is provided and how it is injected. We need
to start with the latter to better comprehend the process.
Injecting a dependency in Angular comes down to defining a token of some-
thing and telling the framework we want it somewhere. As shown in listing 2.10, we
define what we want by adding a constructor parameter: private authService:
AuthService. Upon seeing this, Angular will (somehow) fetch us an instance of that
service.
-- 51 of 306 --
32 	C HAPTER 2 A standalone future
But how will it know where to find the actual instance? Listing 2.9 shows that Auth-
Service is essentially just a class and can easily have multiple instances. It also receives
an instance of Angular’s HttpClient, so how will that class now know where to get that
instance? Well, here is where the second part of the equation comes into play: provid-
ers. Providers allow us to define the values for entities that can be injected. Essentially,
they are places where we say, “Dear Angular, if you see this token (for instance, Auth-
Service as in our example), please inject this value (that particular instance).”
When working with Angular v13 or prior, we know of two ways to provide those values:
by adding to some NgModules’ or components’ providers array or by marking a service
as providedIn: 'root'. In listing 2.10, we added the AuthService directly to the Login-
Component’s providers, and we’re done with it. It is truly the simplest approach here, but
it is meant to work only for now, not when the app grows. It also raises several questions
with not very favorable answers in the case of modular apps, as outlined in table 2.1.
In the Answer with Standalone APIs column, we defined the concept of “existing stand-
alone APIs” and a function named importProvidersFrom. Let’s find out what that
means by trying to provide the HttpClient for our app. We can remember that those
dependencies resided in the @angular/c

---

## Either this or mark the service

as providedIn: 'root'.
We can use a standalone API
if one is provided.
How do I import services that are
provided in other modules (without
special standalone APIs)?

---

## Import the module directly into

the component.
Use the importProviders-
From function in the applica-
tion main.ts file.
How do I import built-in Angular
dependencies?
Import the whole module. 	Use existing standalone APIs.
Listing 2.11 	Adding providers from other modules
-- 52 of 306 --
33	2.3 	Developing apps without NgModules
The importProvidersFrom function takes a module (or several modules; we can pro-
vide more than one), extracts their providers, and transports them to wherever we
want to use them. This function is very simple in the sense that it only exists to provide
interoperability between standalone and NgModules.
It is important to understand this method only works in the application injection
context, either in the bootstrapApplication function or some route providers (we
will talk more about route providers in the next section). Next, we should realize this
works with any NgModule; so, if we are using some third-party Angular library that has
not itself migrated to standalone, we can still use importProvidersFrom to continue
using that library in full capacity. Lastly, we can actually ditch the importProviders-
From when dealing with some built-in Angular modules. We should emphasize the
word some as not all Angular built-in APIs have moved away from NgModules. But, as we
saw with the routing (the provideRouter function), a bunch of Angular modules have
already migrated to standalone APIs, including HttpClient. Here is how we really
want to provide HttpClient in our applications, inside the app.config.ts file:
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
export const appConfig: ApplicationConfig = {
providers: [
provideRouter(routes),
provideHttpClient(),
]
};
We can note the naming convention of provideSomething. This pattern is now widely
adopted by many library authors, so we want to be prepared and recognize such func-
tions when encountering them in various codebases. Also, if we author a library, it is
considered a good practice to export providers in a similar fashion.
So, how do we provide the AuthService? Well, we could just add it to this root-level
providers array, but instead, we are going to simply mark it as providedIn: root, so
that the app.config.ts file remains intact.
Finally, we need to create a route for our login component so that it has the first
functioning feature of our application. We will quickly discover that essentially noth-
ing has changed regarding this.
import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login.component';
Listing 2.12 	Adding providers from other modules
Listing 2.13 	Using HttpClient standalone API
-- 53 of 306 --
34 	C HAPTER 2 A standalone future
export const routes: Routes = [
{ path: '/login', component: LoginComponent },
];
Of course, this simple registration of a routed standalone component only works
when we have a straightf

---

## Loads

its routes
User 	Angular 	EmployeesRoutingModule	EmployeesModule
User 	Angular 	EmployeesRoutingModule	EmployeesModule
Finds a route that matches the URL
Figure 2.2 Steps to lazy-load a component with NgModules
-- 54 of 306 --
35	2.4 	Lazy-loading components
As we can see, this is a fairly complicated process, which can be made even more difficult
if, for instance, EmployeesRoutingModule actually lazy-loaded yet another NgModule, and
so on. In addition, even if we have one component we want to lazy-load, we would
need to create a module for it (if it does not logically belong in one of our existing
feature modules). Using the SCAM approach would alleviate this problem, but we
would be pretty much constrained in other scenarios. And, of course, either way, we
end up with a bunch of boilerplate code we would like to avoid.
2.4.2 	Lazy-loading a single standalone component
Now, we will explore how the same process works for standalone components.
Let’s create a registration component and make it routed. In the src/app/pages
directory, let’s create a file named registration.component.ts and add an empty
RegistrationComponent. We want to show the login page when the user first navi-
gates to our application and also have a separate /register route that will load the
RegistrationComponent lazily. The following listing provides the code we need to
accomplish this.
export const routes: Routes = [
{ path: 'login', component: LoginComponent },
{ path: 'registration', loadComponent: () => {
return import('./pages/registration.component').then(
(m) => m.RegistrationComponent
);
} },
];
Note the addition of a specific loadComponent option on the route object. This option
will take a function that will import the module (in this case, by module, I mean the file
that contains the code, not NgModule) and load that particular component. In this sce-
nario, the process is much simpler than what figure 2.3 describes, mainly by entirely
skipping loading any NgModules.
There are two important points to note:
 No changes have been made to the components themselves—The new routing approach
does not in any way affect how we author components. Essentially, when we
migrate a routed component to standalone, we only need to change its code to
mark it as standalone: true.
 The routing object is not changed either—Other than using the new loadComponent
option, nothing is different from how we defined a route previously; we can add
guards, resolvers, route or query parameters, and so on
So far, we have lazy-loaded a single component. Although it’s a valid use case, in real life,
we might want to lazy-load a block of components, which was previously accomplished
Listing 2.14 	Lazy-loading a component directly
-- 55 of 306 --
36 	C HAPTER 2 A standalone future
by lazy-loading an entire NgModule with all of its routed components. Let us see how
we can accomplish the same thing without NgModules.
2.4.3 	Lazy-loading several standalone components
Before we start, let us understan

---

## This was previously readily accomplished because those components most likely

already belonged to one feature NgModule and were lazy-loaded together. With
standalone, they can be anywhere and loaded in different ways.
 And last but not least, we also might want our folder structure to better reflect
the hierarchies within both our routing and the application in general and thus
require several routes.ts files that exist in subfolders that contain some specific
feature-related code. Yet again, standalone provides answers to all those con-
cerns without the need to resort to NgModules.
Let’s now create our first feature module and cover the Employees section of our
application. As mentioned, it will contain components that allow the user to view the
list of employees and a detailed overview of a specific employee, as well as create and
edit employees.
User 	Angular
Navigates to "/registration”
Matches the URL to "RegistrationComponent"
Lazy-loads RegistrationComponent

---

## Renders the matched component to the user

RegistrationComponent
User 	Angular 	RegistrationComponent
Figure 2.3 Steps to lazy load a standalone component
-- 56 of 306 --
37	2.4 	Lazy-loading components
In the src/app/pages folder, we are going to create a directory named employees,
and this directory will contain all the code related to employees. In this folder, we’ll
create all the components we mentioned. Those components are not yet routable, as
we do not want to put them inside app.routes.ts and, instead, want to have a separate
routing configuration file for them. Let’s create a file named employees.routes.ts file
in the same directory and put the code in the following listing inside it.
export const routes: Routes = [
{ path: 'list', component: EmployeeListComponent },
{ path: 'details/:id', component: EmployeeDetailsComponent },
{ path: 'create', component: CreateEmployeeComponent },
{ path: 'edit', component: EditEmployeeComponent },
];
As we can see, there is absolutely no difference between adding such feature or child
routes and just having them in app.routes.ts. However, these routes are not yet con-
nected to our root routing. We can accomplish this by adding a route with load-
Children in the root routing file but importing the routes directly without any
intermediary NgModule.
export const routes: Routes = [
{ path: 'login', component: LoginComponent },
{ path: 'registration', loadComponent: () => {
return import('./pages/registration.component').then(
(m) => m.RegistrationComponent
);
} },
{ path: 'employees', loadChildren: () => {
return import('./pages/employees/employees.routes').then(
(m) => m.routes,
);
} },
];
Again, the only key difference compared to NgModule setup is that the loadChildren
function imports the route instead of importing a module that imports a routing mod-
ule. The loadChildren function works in the same fashion as previously discussed and
accomplishes the same result, just in a more direct way. The mental model of this pro-
cess is also simpler than using NgModules.
Finally, the last thing we want to tackle is being able to provide some dependencies
only to certain routes. So, for example, EmployeeService is only available in compo-
nents related to the employees feature of our application.
Listing 2.15 	Adding feature level routing
Listing 2.16 	Lazy-loading both single and multiple standalone components
-- 57 of 306 --
38 	C HAPTER 2 A standalone future
2.4.4 	Providing dependencies only to certain routes
With NgModules, we can provide certain services and other DI tokens in specific lazy-
loaded modules by adding them to the providers array of that particular NgModule.
This method provided us with two benefits: being able to also lazy-load services, mak-
ing the app even more granular, and having different instances of some service for dif-
ferent modules (routes). The last point was especially useful for developers who use
some state management libraries like NgRx and NgXS, allowing them to provide cer-
tain pieces of application state only 

---

## Renders the matched component to the user

employees.routes.ts 	Component
Figure 2.4 Loading a standalone component from a set of multiple lazy-loaded routes
-- 58 of 306 --
39	2.4 	Lazy-loading components
{
path: 'employees',
providers: [EmployeeService],
loadChildren: () => {
return import('./pages/employees/employees.routes').then(
(m) => m.routes,
);
},
},
This code will make the EmployeeService only available in the routes inside employ-
ees.routes.ts, meaning only components routed in that configuration file will have
access to this particular instance of EmployeeService. We can easily check it by navi-
gating to LoginComponent, for instance, and injecting the EmployeeService into it
via the constructor. If we check the application in the browser, we will surely see the
following error "NullInjectorError: No provider for EmployeeService!" with
some more explanatory details. We have now accomplished isolating this service
into a subset of our routing.
2.4.5 	Lazy-loading a component into another component
So far, we have discussed lazy-loading components via routing (e.g., having a route
that would load its component only when the user navigates to it). But what if we
want to go even more granular? Let’s imagine the following scenario: we are build-
ing the EmployeeListComponent and put a table of employees there, which will con-
tain data about each employee like full name, age, position, and so on, and an
Actions column that would allow us to edit the employee or delete them. When the
user clicks the Delete button, we want to present them with a confirmation dialog
that asks them if they are sure they want to delete that employee. But here’s the
catch: the confirmation dialog is going to be a separate, reusable component (we
might want to have such confirmation logic on multiple pages), and we do not want
the application to download that component’s code until the user clicks Delete.
After all, the component is invisible anyway, and there is no point in having that
code until the very moment it should be used.
In this case, we cannot rely on lazy loading through routing. We can in a sense,
accomplish this with named router outlets (https://mng.bz/yowp) and secondary routes
(https://mng.bz/M1nQ). Here, however, we do not want a separate routed compo-
nent; we just want another component that can be loaded and displayed purely on
demand. This task can be accomplished fairly easily, especially with standalone com-
ponents. Let’s first create the EmployeeListComponent. Add the code in listing 2.18 to
the src/app/pages/employees/employee-list.component.ts file.
Listing 2.17 	Adding providers to a lazy-loaded route
-- 59 of 306 --
40 	C HAPTER 2 A standalone future
@Component({
selector: 'app-employee-list',
template: `
<h2>Employee List</h2>
<table>
<thead>
<tr>
<th>Full Name</th>
<th>Position</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
<tr *ngFor="let employee of employees$ | async">
<td>{{ employee.firstName }} {{ employee.lastName }}</td>
<td>{{ employee.position }}</td>
<td>
<butto

---

## Summary

 NgModules have outstanding problems like boilerplate, increased complexity,
and a steep learning curve.
 Single Component Angular Modules (SCAMs) can mitigate those problems in
NgModule-based applications
 From v14, standalone Angular components, directives, and pipes are available,
marked as standalone: true in their metadata.
 Applications can now be built completely without NgModules using the special
bootstrapApplication function in the main.ts file.
 Standalone components, pipes, and directives can import other standalone
building blocks via an imports array in their metadata.
 Standalone building blocks can fully interop with NgModules by either importing
the module directly into components or via the importProvidersFrom function.
 Lazy-loading routes directly is now possible for standalone components instead
of whole modules.
 Existing applications can migrate to standalone either by hand or using the
schematic provided by the Angular team; the SCAM approach greatly simplifies
this process.
-- 66 of 306 --
47

---

## Revitalized

dependency injection
Dependency injection (DI) is famously the most loved and stable feature that
Angular provides as a framework. DI is used extensively in every single Angular
project, and it is hard to imagine a flexible and maintainable codebase without its
advantages. So what changed, and importantly, why, if it was already so stable? This
question will be our subject of exploration in this chapter, which, funny enough,
actually revolves around one single function, inject (actually not even a new func-
tion!), which, almost accidentally, made a minor revolution in Angular projects all
over the community.

---

## This chapter covers

 How the dependency injection mechanism
works under the hood
 Injection contexts
 Using the inject function instead of constructor-
based dependency injection and the benefits of
this approach
 Using the inject function to convert class-based
guards/resolvers/interceptors to functional ones
-- 67 of 306 --
48 	C HAPTER 3 Revitalized dependency injection
3.1 	How does dependency injection work?
Let’s start our exploration by diving into the DI mechanism to understand how it
works and how we can utilize it to build more flexible codebases. But first, let’s briefly
discuss what, in general, DI is and what it is not.
3.1.1 	Why do we need DI?
When writing software, we often use other software in the process. For instance, we
use built-in objects in a browser to access and manipulate the DOM tree, or in the case
of Angular, we use existing directives to render content conditionally. Usually, we do it
by importing some token, most probably an object or instance of a class, and then
using its methods. In this case, that token becomes a dependency of the code we are
authoring. For instance, a class (component, directive, pipe, service, etc.) we write
may want to use Angular’s HttpClient to make HTTP calls, and HttpClient is a whole
separate class, so we want to import that one into our file. But then there is another
level: we do not just want the HttpClient class but an instance of it. Sure enough, we
can write new HttpClient() and create a new instance, but we face two problems in
this scenario.
First, HttpClient has some dependencies it receives via its own constructor, and if
we try to provide them, too, it will become apparent they also have their own depen-
dencies, and so on. Of course, we could go on writing that sort of thing, but that
would result in more boilerplate code (writing all those constructor arguments every
time we need the HttpClient is very tedious) and reduced maintainability. If some of
the dependencies down the line are changed to depend on one more thing, we would
face a nightmare of refactoring.
Second, just making a new instance will mean that we will have a dedicated
instance of a service we use in every building block where it is used, meaning if five
components make HTTP calls, we have five instances of HttpClient. This setup is
redundant memory-wise and limiting from the perspective of shared state; if there is
any data inside our service, we cannot change it and reflect it somewhere else because
each service consumer will have a copy of the data. This limitation can be a serious
concern when building software meant to share state between components of an
application, like state management libraries, which are an important part of modern
frontend applications.
A functioning DI system can efficiently solve this problem. Such a system would
take tokens we want to receive references to and return the actual references without
duplicating instances and without the need to specify the entire dependency tree
manually. It ca

---

## Provides a method that

allows for registering
dependencies, essentially
just adding a token to the
map with the provided
value; returns the token so
we can then retrieve the
value when needed

---

## Inject method that

allows for retrieving
the value; receives the
token and returns the
corresponding value
from the map of
dependencies

---

## Creates an

injector
-- 69 of 306 --
50 	C HAPTER 3 Revitalized dependency injection
return fetch(url);
}
}
const httpToken = injector.provide(new HttpClient());
class UserService {
http = injector.inject(httpToken)
getUsers() {
return this.http.get('https://example.com/api/users');
}
}
const userServiceToken = injector.provide(new UserService());
const userService = injector.inject(userServiceToken);
userService.getUsers();
As we can see, this code does not look in any way like what we are used to in Angu-
lar, but the mechanism is the same: in some places, we provide a dependency
(either in an NgModule providers array or by tagging it as providedIn: 'root'),
then in another place, we inject it and get the value. Notice that while we called new
HttpClient() and new UserService() in our example, we did not need to provide
them any dependencies via the constructor because they injected their own depen-
dencies using our DI mechanism. But now, a question will surely come to mind:
“Wait, doesn’t Angular require us to put dependencies in the constructor?” The
answer is, “kind of.” Let’s dive deep and see how this mechanism we just imple-
mented works in Angular.
3.1.3 	Dependency injection the Angular way
Angular uses a special abstraction called Injector (the same we named our own DI
class) to handle dependency injection. This injector keeps the registry of dependen-
cies (the map we created) and allows the retrieval of values via tokens. In our previous
example, notice this line:
const injector = new Injector();
This line implies we can have multiple injectors. Each would have its own registry of
dependencies and its own inject function. So does Angular! Angular creates special
injectors when our application runs, provides dependencies, and then injects them
into components (directives, pipes, etc.) implicitly. When I say implicitly, I mean there
is no special code that does this: we just list our dependencies as constructor parame-
ters, and Angular then deduces when to inject what. It’s pretty simple and nice, but it
can feel like magic, and it limits us to using it only in classes, as we need constructor
functions to trigger DI. Later in this chapter, we will discuss how to overcome this lim-
itation, but for now, it is sufficient to know it is caused by having the injector.

---

## Uses a method from an

injected class instance
-- 70 of 306 --
51	3.1 	How does dependency injection work?
Any Angular application has at least one injector, known as the root injector, which is
globally created for our application at the very beginning. The services marked with
providedIn: 'root' are provided here.
Of course, when the application gets more complex, Angular spawns more injectors.
Prior to standalone, ElementInjector and ModuleInjector were used to find depen-
dencies. ElementInjectors are injectors created for each DOM node; for example,
when we render a component somewhere in a template, it gets an ElementInjector,
which is empty by default unless something is added to that component’s providers
array. ModuleInjectors, on the other hand, were created for NgModule-level DI and
were used when ElementInjectors failed to find a dependency in their registry.
This lookup for a dependency works hierarchically. In standalone, which we
explored in the previous chapters, we do not have ModuleInjectors, unless our stand-
alone components import some NgModules. In the case of a fully standalone app, DI
probably only uses ElementInjectors until it reaches a provider registered on a route
or the main.ts file configurations.
In the previous chapter, we created an EmployeeListComponent, which injected
EmployeeService (see figure 2.16). Let’s consider figure 3.1 and go step by step to see
how the component will receive the reference of the EmployeeService.
This process will repeat every time an EmployeeListComponent is created; for
example, if we run an *ngFor loop and render five EmployeeListComponents, five
ElementInjectors will be created for those component instances, and this process will
run five times. We use the example of components, but it is similarly true for direc-
tives, with each directive instance having a dedicated ElementInjector and running
through these steps.
We can notice that this process looks like a property lookup on a JavaScript
Object’s prototype chain. When we access a property of an object, we first look at the
object itself, and if we don’t see the property there, we run to its prototype and look it
up there, and then its prototype, and on and on, until we reach the root Object. After
that, there is one more step because Object’s prototype is null; because it does not
have any properties, it will throw an error. The same is true for Angular’s DI lookup:
when we reach the root injector, there is one more level called the NullInjector,
which is the parent of the root injector. NullInjector is special, as it always throws an
error when we attempt a dependency lookup on it. This is what we see when we get
the NullInjectorError: No provider for Something! message. It means that Angu-
lar attempted to look up a dependency, reached the root level, didn’t find it there,
then went one level up to the NullInjector, and, as always, threw an error.
All of this sounds nice; however, one question remains: Why do we need this com-
plex process? Why can

---

## Angular attempts to create the instance of the

EmployeeListComponent class.
Angular realizes that the component depends on Employeeservice.
Angular looks in this new injector for the EmployeeListComponent
and sees that EmployeeService is not there.
It goes up the parent injector, which is the one created for the
RouterOutlet that created this route.
There, in the providers array, we can see the EmployeeService,
which means this injector can give us this dependency.
The user navigates to the "employees/list" URL
Angular matches it with the EmployeeListComponent and starts
the process of its instantiation.
There we can see the provideHttpClient() line, which adds all
the providers necessary for an HttpClient instance.
The same process is repeated for the HttpClient, and an
instance, either new or existing, is returned.
Angular creates the EmployeeService.
If the instance does not exist.

---

## Angular passes the instance to the newly

created EmployeeListComponent.
Figure 3.1 The process of injecting dependencies into a component
-- 72 of 306 --
53	3.1 	How does dependency injection work?
we write a directive, we will very likely need the reference to the element on which the
directive is called. We do this by injecting the ElementRef, which, in turn, is provided
on the ElementInjector of this particular directive instance. The same directive can
be applied in many different parts of the application, so the ElementRef instance will
be different each time and determined by its own injector. Essentially, we have a tree
of dependencies/injectors in which the instances of the same token can be different.
Let us see this concept in a diagram, as shown in figure 3.2.
Here, we can clearly see both the relations of injectors and the path that Angular will tra-
verse to retrieve the reference to EmployeeService for the EmployeeListComponent.
This tree is incomplete: each component here has a template that renders its own
injector. For instance, we used an *ngFor directive in EmployeeListComponent, mean-
ing an injector was created specifically for that instance of the directive, and so on.

---

## Nullinjector

Root Injector
App Component
RouterOutlet - Employee Routes
EmployeeListComponent 	CreateEmployeeComponent 	EditEmployeeComponent 	EmployeeDetailsComponent
HttpClient
ElementInjector

---

## Provided in

ElementInjector 	ElementInjector 	ElementInjector	ElementInjector
EmployeeService
Figure 3.2 Diagram illustrating the hierarchy of injectors and dependencies
-- 73 of 306 --
54 	C HAPTER 3 Revitalized dependency injection
Later in this chapter, we will learn how we can manipulate this lookup process to latch
onto specific instances of some services or values. We need to understand one final
concept before learning about the inject function.
3.1.4 	Injection contexts
We already mentioned in passing that we rely on class constructors to inject depen-
dencies in Angular; another necessary parameter is a class decorated by one of Angu-
lar’s decorators, like Component, Directive, Pipe, or Injectable. This further limits
our ability to use DI with anything other than Angular building blocks; for instance,
we can’t write a UserModel class and use some UtilityService in it to perform some
calculations. If we want to do that, we cannot decorate the class as Injectable because
we are not going to inject that class anywhere; we want to instantiate it with new User-
Model(), meaning we again will have to pass all the dependencies. This can work on
some level, but it will become too tedious to type whenever we need the class. So why
does this limitation exist?
In every programming language or framework, the code that we run is executed in
some sort of context; for instance, the scope of variables in JavaScript means we can
only reference variables that have been declared, and when they are available, just
naming them will help the program to access the information stored in them. In the
previous chapter, I mentioned the compilation context, meaning all the directives and
components that a certain component has access to (via being in the same module,
importing their module, or importing standalone directives/components directly into
itself). If we try to use something outside this context (i.e., not imported by this com-
ponent in any way), we will get an error.
Angular’s dependency injection works in a similar fashion. As we have seen, the
DI happens when we try to make an instance of a component or directive, and that
instantiation may happen under different circumstances. Thus, each time when DI
is invoked, there is a different context in which this will happen: this is how we are
able to use different injectors under the hood so we can get different references
while requesting the same token (as in the ElementRef example from the previous
section).
These contexts, unsurprisingly, are called “injection contexts” and are the culprits
of all the limitations we mentioned previously. Angular injection contexts are very spe-
cific, so let’s explore all of them and when they happen:
 Creation of a class that is instantiated by the DI system—Using Injectable, Component,
etc. (as opposed to just using the new keyword). We have already encountered
this scenario—it’s how all explicit DI worked before v14, via writing parameters
in the constructor.
 Initializer fi

---

## Uses the inject

function
No need for a constructor;
we can write other methods.
-- 75 of 306 --
56 	C HAPTER 3 Revitalized dependency injection
This listing looks mildly different from constructor injection. We want to focus our
attention on a few things:
 This approach could save us one or two lines if we have multiple dependencies
listed in a constructor.
 There is no need to write an empty constructor method only for the purpose of
injecting a dependency.
 We can also drop access modifiers with the inject function. With the construc-
tor, we need to add public, private, or protected to the name of the property
in the constructor so that it is stored as a class property rather than just a con-
structor argument. In this scenario, we can drop it, and it will be inferred as
public (although it is a good practice to still mark services and dependencies as
private readonly to prevent them from being accidentally overwritten or
accessed in the wrong place).
The inject function gives us some minor nice things, but I wouldn’t have dedicated
an entire chapter to it if that was it. Further, let’s discuss how we can use this function
to escape our dependence on classes for DI.
3.2.2 	Injecting dependencies outside classes
In our very first encounter with the inject function, we used it to inject Employee-
Service and get a list of employees. You might think that this scenario is common,
but in real life, it would not make sense to start wrapping all method calls in functions
just to skip one line of code in components. However, it can be useful in some scenar-
ios. For instance, imagine we want to have a way of checking whether the user is
authenticated and getting notified if they log in/out of our application. We could cre-
ate a BehaviorSubject in our AuthService and flip it when this happens. Now, it
would make sense to be able to expose that BehaviorSubject to components that might
want to consume it, but those components probably won’t need the entire package of
the AuthService. We can mitigate this problem by wrapping BehaviorSubject into a
function. First, let’s add that BehaviorSubject to our AuthService.
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable()
export class AuthService {
private readonly http = inject(HttpClient);
isAuth$ = new BehaviorSubject(false);
login(credentials: { email: string, password: string }) {
return this.http.post('/api/auth/login', credentials).pipe(
Listing 3.4 	Showing user’s authentication status

---

## The authentication

BehaviorSubject
-- 76 of 306 --
57	3.2 	The inject function
tap(() => this.isAuth$.next(true)),
);
}
logout() {
return this.http.post('/api/auth/logout', {}).pipe(
tap(() => this.isAuth$.next(false)) ,
);
}
}
Now, as we have the BehaviorSubject in place, we can inject the service anywhere and
use it. To simplify it a bit, let’s write a function that returns BehaviorSubject, so that
components can consume it directly. We will create a functions folder under the
shared directory and, in there, an auth.ts file.
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
export function isAuth() {
const authService = inject(AuthService);
return authService.isAuth$.asObservable();
}
As we can see, we injected the AuthService into the function without a constructor.
We also encapsulated the isAuth$ BehaviorSubject by exposing it as an Observable
so that everyone can read it, but only AuthService can modify it. Now, we can just as
easily use it in any component.
To illustrate, let’s create a FooterComponent, which will show some links related to
the HRMS product and legal info. However, we want to show the legal information
only to users who are not logged in and might be seeking to use the product, as
logged-in users are members of companies who are already customers of the HRMS
application. In the src/app/shared/components directory, create a new file named
footer.component.ts and put a component that uses our new function to perform con-
ditional logic in its template inside.
@Component({
selector: 'app-footer',
template: `
<div>
<h2>HRMS</h2>
<p>Welcome to HRMS platform!</p>
<div class="links">
Follow us on social media:
<a href="https://linkedin.com" target="_blank">Linkedin</a>
<a href="https://x.com" target="_blank">X (former Twitter)</a>
</div>
Listing 3.5 	Function that returns a value from an injected service
Listing 3.6 	Component using a function to inject a value from another service

---

## Reverses when

the user logs out
-- 77 of 306 --
58 	C HAPTER 3 Revitalized dependency injection
<div *ngIf="isAuth$ | async" class="legal">
<a routerLink="/terms">Terms of Service</a>
<a routerLink="/privacy">Privacy Policy</a>
<a routerLink="/cookies">Cookies Policy</a>
</div>
</div>
`,
standalone: true,
imports: [AsyncPipe, RouterLink, NgIf],
})
export class FooterComponent {
isAuth$ = isAuth();
}
We can then use this component in the AppComponent to render the footer content on
all pages. As we can see, we no longer need to import and inject AuthService and
extract the conditional property from it; we can retrieve it directly via a function. This
can become very handy in situations where some complex logic related to a service is
duplicated in multiple places in an Angular application.
We can use it almost anywhere. In section 3.1.4, where we discussed injection con-
texts, I mentioned that even without classes, the DI must happen in such a context.
The same is true for the inject function: we can use it to initialize fields, we can use it
in the body of a constructor, and we can use it in functions that are going to be called
in class constructors. We cannot call those functions in arbitrary places. For instance,
doing the following would result in an error:
export class FooterComponent implements OnInit {
isAuth$: Observable<boolean>;
ngOnInit() {
this.isAuth$ = isAuth();
}
}
The error occurs because ngOnInit (and all class methods but the constructor) is not
being run in an injection context, so injecting dependencies there is impossible.
Essentially, when those methods run, the class instance is already created, and DI has
already happened. Despite this limitation, inject provides us with a variety of new
capabilities outside classes and some benefits even if we ditch the constructor in com-
ponents in its favor. Later in this chapter, we will discuss those new capabilities; for
now, let us focus on the immediate benefits when we switch to inject.
3.2.3 	Why we should always use inject
This function is new, and as we have seen, it does not look very different from the con-
structor DI. However, it provides a multitude of less obvious improvements. Let’s
investigate them one by one.
-- 78 of 306 --
59	3.2 	The inject function
IMPROVED REUSABILITY
We have already encountered the topic of improved reusability. We have seen that we
can now use DI inside functions, meaning we can extend service functionality to
places where it would not have been possible previously. Functions are known to be
better for composability (we can, for instance, return new functions from existing
ones), and adding DI to them can be a huge win for large, interconnected applica-
tions. Also, some Angular building blocks that previously needed to be classes to have
DI are now free to be written as functions. We will discuss this in detail in the next sec-
tion of this chapter.
TYPE INFERENCE OF INJECTION TOKENS
Not all dependencies are services; sometimes, we need to be able to injec

---

## Injection token factory

that returns the value
Provides the InjectionToken in the
root (i.e., the entire application)
-- 79 of 306 --
60 	C HAPTER 3 Revitalized dependency injection
will still correctly inject the Constants InjectionToken, resulting in an incorrect typ-
ing of the property and possibly bugs down the line. This problem, however, is nonex-
istent with the inject function:
export class MyComponent {
constants = inject(Constants);
}
constants will now correctly infer the type of the property without any need to type it
out manually.
E ASIER COMPONENT INHERITANCE
In general, inheriting components is not considered a best practice; however, there
are scenarios where it can be useful, or we might be dealing with some legacy code
that already has such component inheritance. With constructor DI, we have to rede-
clare all the dependencies in the child class and pass it back to the parent constructor.
This task can be quite tedious, as, for example, in the following:
export class ParentClass {
constructor(
private router: Router,
) {}
}
@Component({
...
})
export class ChildComponent extends ParentClass {
constructor(
private router: Router,
private http: HttpClient,
) {
super(router);
}
}
Passing dependencies to a parent component class will grow even worse if we have a
component that extends from another one that is already a child class, making this
code even more complicated. This scenario is even more popular in the case of ser-
vices, where inheritance has more accepted usage than in components. With the
inject function, however, none of these problems occur:
export class ParentClass {
private router = inject(Router);
}
@Component({
...
})
export class ChildComponent extends ParentClass {
private http = inject(HttpClient);
}

---

## The child class injects

something else, again with
no constructor; the parent
dependency (router) is also
available in the child.
-- 80 of 306 --
61	3.2 	The inject function
We already discussed some of the benefits related to DI usage in classes. Another ben-
efit is outside of the realm of OOP.
CUSTOM R X JS OPERATORS
More complex Angular applications tend to rely heavily on RxJS, and in some advanced
scenarios, developers also create their own custom RxJS operators. Those operators
often need a dependency from the DI tree—for instance, a utility service to help per-
form a mapping on some emitted value. In this case, before the introduction of the
inject function, the only option was to pass the reference as a parameter to the cus-
tom operator. Now, we can just inject the dependency directly in the operator and use
it (but carefully—always run it in an injection context). We will talk about such custom
operators in detail in chapter 5.
DITCHING THE CONSTRUCTOR ALTOGETHER
Almost every component we write has some initialization logic. For instance, the
EmployeeListComponent we created previously loaded the list of employees as soon as
it was created. In our example, we wrote it as a field initializer. Sometimes, developers
write that sort of code in the ngOnInit method based on when exactly they want to
load that data. What does not happen often is developers putting that sort of code in
the constructor method itself. In the vast majority of the scenarios, the constructor
function is empty and exists only to inject dependencies. It is so widespread that lots
of automatic tools (even the Angular CLI) generate component classes with empty
constructors by default. With the inject function, as we have seen, it became possible
to get by without the constructor method entirely.
3.2.4 	What about the drawbacks?
So far, I have only sung praise for the inject function, but in real life, all solutions
come with some tradeoffs, and our new favorite function is no exception. Let’s see
when we might encounter problems with it.
CONFUSING USAGE
As I repeatedly mentioned, the function does not change the way the DI mechanism
functions, meaning that it still needs to be called in an injection context. For less
experienced developers, this can be a source of confusion when it is not entirely clear
why something is not working as expected. More senior developers need to pay atten-
tion to such situations to avoid bugs and blockers.
P ROBLEMS WITH UNIT TESTING
The inject function generally works well with unit testing in Angular if we use default
tools like TestBed. However, especially in the case of services, developers often forgo
using TestBed when creating instances of the building blocks they want to test. Doing
so creates a problem, as just calling new MyService() is not running in an injection
context. This problem, however, can be mitigated with other tools, which we will dis-
cuss at length in chapter 8, where we will dive deep into unit testing.
-- 81 of 306 --
62 	C HAPTER 3 R

---

## Inject dependencies

with the inject function
CanActivateFn forces our function to return a Boolean,
an observable of Boolean, or UrlTree for redirects,
same as the CanActivate interface.
The actual business logic is unchanged.
-- 83 of 306 --
64 	C HAPTER 3 Revitalized dependency injection
So far, we have only created the guard but have not added it to any routes. Let’s go to
app.routes.ts and make the 'employees' path only accessible when the user is logged
in. This method works in exactly the same way as it used to with class-based guards.
{
path: 'employees',
providers: [EmployeeService],
canActivate: [authGuard] ,
loadChildren: () => {
return import('./pages/employees/employees.routes').then(
(m) => m.routes,
);
},
},
Now, let us move forward and tackle the next routing-related building block, which
was also revolutionized by the inject function.
3.3.2 	Building an EmployeeResolver
Another common task when developing complex web apps is ensuring some data is
loaded via an HTTP request before rendering the component that requires that data.
In the case of our HRMS application, we already have a list of employees. We now
want to build an EmployeeDetailsComponent; the user will be able to navigate it from
the list of employees. When the user navigates, we want to first load the employee
details via HTTP and only then the component itself to avoid a flickering UI or a situ-
ation where the call results in an error and we end up with a blank page. We can
accomplish this task using Angular’s Resolvers, which, just like guards, have also
been implemented with classes. We will skip the class implementation and write the
resolver as a function outright, utilizing the inject function.
First, let us create a new file at src/app/infrastructure/types/employee.ts and put
the employee type definition there:
export type Employee = {
id: number;
firstName: string;
lastName: string;
email: string;
position: 'Developer' | 'Designer' | 'QA' | 'Manager';
level: 'Junior' | 'Middle' | 'Senior' | 'Lead';
isAvailable: boolean;
profilePicture: string;
}
Next, we will create a resolvers folder next to the guards folder in the shared directory
and add an employee-details.resolver.ts file there. The implementation is going to be
very straightforward and, in some ways, mimic what we did with AuthGuard.
Listing 3.10 	Registering a functional route guard

---

## We put the function in

the canActivate array.
-- 84 of 306 --
65	3.3 	Functional guards, resolvers, and interceptors
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Employee } from 'src/app/infrastructure/types/employee';
import { EmployeeService } from 'src/app/services/employee.service';
export const employeeDetailsResolver: ResolveFn<Employee> = (
route: ActivatedRouteSnapshot,
) => {
const employeeService = inject(EmployeeService);
const id = +(route.paramMap.get('id') ?? 0);
return employeeService.getEmployee(id);
}
Next, we want to register the resolver on the appropriate route. Again, we use the
same method as we used with class-based resolvers.
{
path: 'details/:id',
component: EmployeeDetailsComponent,
resolve: { employee: employeeDetailsResolver },
},
Finally, we can inject the route data into our component and get access to the
resolved data.
@Component({
selector: 'app-employee-details',
template: `
<h2>Employee Details</h2>
<div>
<label>First Name: </label>{{ employee.firstName }}
<label>Last Name: </label>{{ employee.lastName }}
<label>Position: </label>{{ employee.position }}
</div>
`,
standalone: true,
})
export class EmployeeDetailsComponent {
employee = inject(ActivatedRoute).snapshot.data['employee'] as Employee;
}
Listing 3.11 	Functional resolver
Listing 3.12 	Registering a functional resolver
Listing 3.13 	Using resolved data in a component
The function has to implement a generic ResolveFn interface, which
receives a type argument. Via this type argument, we explain what
type of data we will return from the resolver.

---

## We take the id param

from the route and
convert it to a number.
In this case, we do not
handle null, but in real
life, it would need
separate logic.
In the end, we return the
result of our service’s HTTP call.
-- 85 of 306 --
66 	C HAPTER 3 Revitalized dependency injection
Again, it all comes down to injecting the relevant data where it is needed. The process
is simplified, boilerplate code is reduced, and getting the data inside the component
is achieved via just one line of code. Now, as we covered tasks related to routing, let’s
move to another Angular building block that turned functional in the wake of the
introduction of the inject function.
3.3.3 	Adding tokens to HTTP requests
Another common need is the ability to modify HTTP requests or responses on the fly.
Almost all enterprise applications introduce this sort of logic somewhere in their
codebase. The most common scenario is adding authentication tokens to HTTP request
headers so that the API can verify the user’s identity and permissions. Of course, we
could write out the HTTP headers every time we make an HTTP call, but large appli-
cations can potentially have up to thousands of different HTTP requests, and copy-
pasting that code everywhere we need results in unmaintainable code. To avoid this,
Angular has previously introduced the concept of an interceptor, which acts as a
middleware for HTTP calls. As with resolvers and guards, inceptors were also previ-
ously a class-based solution, but now they have become functional, too.
Let’s go on and create our authentication interceptor, which will add the user’s
token to all HTTP requests. We will assume that the token is stored in localStorage
(for the sake of simplicity; in real life, it would probably involve some more complex
steps) and can be retrieved via a getToken method on our AuthService. To build our
interceptor, let’s create an interceptors folder in the shared directory and add a file
named auth.interceptor.ts.
import { HttpHandlerFn, HttpRequest, HttpInterceptorFn } from
'@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
export const authInterceptor: HttpInterceptorFn = (
req: HttpRequest<any>,
next: HttpHandlerFn,
) => {
const authService = inject(AuthService);
const token = authService.getToken();
const newReq = req.clone({setHeaders: {
'Authorization': `Bearer ${token}`,
}});
return next(newReq);
}
With this step out of our way, the last thing we need to do is register this interceptor
so that Angular knows to invoke it when an HTTP call is made. In a standalone
Listing 3.14 	Authentication interceptor

---

## Adds the token to the cloned request

Passes the new,
modified request
to the next
handler
-- 86 of 306 --
67	3.3 	Functional guards, resolvers, and interceptors
setup like ours, we can use the provideHttpClient function and a special helper
called withInterceptors in the app.config.ts file.
export const appConfig: ApplicationConfig = {
providers: [
provideRouter(routes),
provideHttpClient(
withInterceptors([authInterceptor]),
),
],
};
As we can see, we are able to add multiple interceptors, all of which will work when
any HTTP call is made in our application.
So far, we have discussed these changes in the context of standalone applications,
where we just created those functions from scratch. However, a similarly important
scenario is where developers want to migrate their existing, class-based building
blocks to functional ones. Let’s discuss what steps can be taken to accomplish that.
3.3.4 	Migrating to functional guards/resolvers/interceptors
In real life, lots of developers are still dealing with projects that have all these building
blocks as classes. If we consider a project that uses, let’s say, Angular v12, upgrading to
v15 or v16 will involve some refactoring. Class-based guards/resolvers/interceptors are
deprecated as per v15 in favor of functional ones. So, we need to think about ditching
the previous versions of those building blocks and switching to functions. Of course, as
with anything, we can manually change the codebase to reflect this change; migrating a
single resolver, let’s say, would probably not take too much time. However, refactoring
dozens of them in one go will probably result in problems, especially if we have unit tests
that also have to be refactored. Thankfully, Angular provides some utilities we can use to
provide backward compatibility until we change all the guards/resolvers/interceptors.
MIGRATING GUARDS AND RESOLVERS
Class-based building blocks related to routing can be converted to functions with a spe-
cial set of utility functions named in a convention of mapTo<name of guard/resolver
type>. For instance, if we already had our AuthGuard as a class and wanted to use it as a
function on a route’s canActivate option, we could use the mapToCanActivate func-
tion to achieve this. The following listing shows how it looks in the code.
{
path: 'employees',
providers: [EmployeeService],
canActivate: mapToCanActivate([AuthGuard]),
loadChildren: () => {
Listing 3.15 	Registering an interceptor
Listing 3.16 	Registering a class-based guard in a functional setup
-- 87 of 306 --
68 	C HAPTER 3 Revitalized dependency injection
return import('./pages/employees/employees.routes').then(
(m) => m.routes,
);
},
},
The mapToCanActivate function will convert the array of class-based guards to an
array of CanActivateFn functions, which keeps them compatible with the new API.
We can then manually change those class-based guards to functional ones one by one
at our convenience. This function, as mentioned, is also available in other flavors to
support guards for other s

---

## Flexibility is provided

only via an Input,
providing reusability
on an element level.
After the view is initialized, the
directive will change the text
content of the target element.

---

## Injecting it back

into the directive
-- 91 of 306 --
72 	C HAPTER 3 Revitalized dependency injection
ngAfterViewInit() {
this.elRef.nativeElement.textContent =
this.elRef.nativeElement.textContent.slice(
0,
this.limit,
);
}
}
As we can see, we used the optional flag and the ?? operator combined with an Input
to achieve all the requirements we set. If an input value is not provided, we try to inject
the globally provided limit value; if that is not provided either, we use a default value.
This also makes it possible to use components for which the value of the character
limit is entirely different from the rest of the application by manually providing that
value in the providers array of that component.
Now that we have deeply familiarized ourselves with Angular’s modern depen-
dency injection mechanism, we can test it out on practical examples.
3.5 	Exercises for the reader
After this chapter, you should create services, components, and directives utilizing the
inject function:
 Create an InterviewService for the Recruitment feature of the HRMS applica-
tion and use it in relevant components.
 Write a higher-order permission guard—a function that will return another
function that is a guard (complies with CanActivateFn). The parent function
receives the name of the user permission as a string and uses the closure to
create a guard that is specific to that permission and will not allow the user
without that permission to access certain pages. It will be used with route defi-
nition, securing multiple permissions in different places: canActivate: [has-
Permission('CreateEmployee') and hasPermission('DeleteEmployee')].
This way, we won’t be compelled to create multiple guard functions for each
permission.
 Try switching DI in some of your existing Angular codebases to use the inject
function.

---

## Summary

 The inject function has been publicly available since Angular v14.
 The inject function will take any dependency token and return its provided value.
 The inject function can be used to inject dependencies and services into func-
tions, as opposed to only classes.
 The inject function is now commonly preferred over the constructor DI.
 Guards/resolvers/interceptors have now switched to being fully functional.
-- 92 of 306 --
73	Summary
 Legacy class-based guards/resolvers can still be used with helper functions.
 Legacy interceptors can still be used with the withInterceptorsFromDi function.
 Legacy class-based guards, etc. can be migrated to functional incrementally.
 The inject function supports dependency lookup modifiers like host, optional,
self, and skipSelf.
-- 93 of 306 --
74

---

## This chapter covers

 Supercharging input properties to make them
required, transform their values, or bind them
to routing parameters
 Using host directives to compose new directives
from existing ones
 Switching to type-safe reactive forms to ensure
the best interaction with TypeScript and improved
developer experience, coupled with other
improvements to forms
 Improving image load time by using the new
NgOptimizedImage directive
 Using fetch-based backend instead of XHR in
HTTP requests
-- 94 of 306 --
75	4.1 	Powerful inputs
ourselves with some improvements that aim at reducing boilerplate and improving per-
formance, as well as bettering our code quality on a more local magnitude.
For the purpose of learning, we will continue building our HRMS application. This
time, we will cover the “Work” feature of this application and build several compo-
nents and directives in it. This feature is related to the projects that a given organiza-
tion using the app will want to add and view. The user will be able to view the list of
projects, and their details, and see employees on days-off. In chapter 2, you were
encouraged to create those pages and the respective routes as an exercise; if you have
not done so, and still want to code along with the book, you can create only the pages
mentioned in this chapter.
Now, as everything is set, let’s embark on a new journey and see how we can
improve reusable components that receive data through inputs.
4.1 	Powerful inputs
When learning Angular, one of the very first lessons is about component interactions,
mainly how a parent component can manipulate the behavior of its child. This plays well
with the concept of having reusable components, where a component can receive data
from parents and render its UI based on that data. This is, as is commonly known,
achieved through inputs, special properties marked with the @Input decorator, which
allow us to pass data from the parent component to a child in the template similar to
HTML attributes. Such input properties have been used widely in the Angular developer
community, resulting in the discovery of several approaches and some pitfalls that we
might encounter. Starting from v15 and v16, the Angular framework acquired several new
capabilities for input properties, and this is what we are going to discuss in this section.
4.1.1 	Required inputs
To understand our use case, let us start with building pages related to the “Work” fea-
ture of our application. Namely, we want a page in which the user can browse all the
projects that their company is working on. This “project list” page will contain small
snippets of data about projects but without in-depth detail. As there are not that many
projects running at any given time in a given company, it would be better from the
user experience perspective to have them displayed as a list of cards or tiles, with the
project logo and some superficial information about it.
However, before we start implementing this component, we can analyze our 

---

## Input marked with

{required: true}, so we
can safely put ! in front of
the property name as we
know it is guaranteed not
to be null or undefined
-- 97 of 306 --
78 	C HAPTER 4 	New capabilities of Angular building blocks
imports: [NgFor, ProjectCardComponent, AsyncPipe]
})
export class ProjectListComponent {
private readonly projectService = inject(ProjectService);
projects$ = this.projectService.getProjects();
}
Immediately in our code editor, we will see an error with the following text: Required
input 'projectId' from component ProjectCardComponent must be specified.ngtsc.
The error message is quite clear: the ProjectCardComponent has way less code and
focuses more on the business logic rather than implementation details and is more
readable. Next, let us discuss another scenario related to the boilerplate caused by
input properties.
4.1.2 	Transforming input values
To get a grasp of what we want to achieve here, let us build another reusable compo-
nent. Our HRMS application is an enterprise, business-heavy application. So it is not
hard to imagine it has features related to document exchange. For instance, the
recruitment section will need the capability of uploading a candidate’s CV file, and
the user will probably want to be able to upload their profile picture to be recogniz-
able on the platform. For this purpose, we want a component that handles various
things related to uploading a file so that we can reuse it in multiple places. This com-
ponent will render a button that will allow the user to select a file, validate the selected
file, and emit an event when files are selected so the parent component can handle
the files as it sees fit. Let’s make a quick implementation; again, in the src/shared/
components folder, we will add a new file, file-upload.component.ts, with the func-
tionality shown in the following listing.
@Component({
selector: 'app-file-upload',
template: `
<div class="file-upload">
<label for="upload">{{ label }}</label>
<input type="file" id="upload" (change)="onFileSelected($event)"
/>
<span class="error" *ngIf="errorMessage">
{{ errorMessage }}
Only the following file types are permitted:
<ul>
<li *ngFor="let type of acceptArray">
{{ type }}
</li>
</ul>
</span>
</div>
`,
standalone: true,
Listing 4.4 	FileUploadComponent with an “accept” input

---

## Uses a property that

is different from
“accept” to get its
values as an array
-- 98 of 306 --
79	4.1 	Powerful inputs
imports: [NgIf, NgFor],
})
export class FileUploadComponent {
@Input({required: true}) label!: string;
@Input() accept = '';
@Output() selected = new EventEmitter<FileList>();
errorMessage = '';
get acceptArray() {
return this.accept.split(',');
}
onFileSelected(event: any) {
const files: FileList = event.target.files;
this.errorMessage = Array.from(files)
.every(f => this.acceptArray.includes(f.type))
? '' : 'Invalid file type';
if (this.errorMessage === '') {
this.selected.emit(files);
}
}
}
As we can see, we are doing quite an operation here to ensure we both receive the
input value as a string and use it as an array, like the following example:
<app-file-upload label="Upload profile picture"
accept="image/jpeg,image/png"></app-file-upload>
Of course, we could argue that we can just accept an array straightaway, but that would
place an unnecessary strain on the parent component, which now will need to declare
an array binding, and also restrict our component from being dynamic. For instance,
we could receive a list of acceptable file types from the backend in some scenario, and
it probably can come just as a string list, so the approach we adopted could work bet-
ter in this case. However, it has some downsides: for instance, the readability will suf-
fer, as the getter and the actual property that it transforms can be located far from
each other in the code, and also this will trigger change detection multiple times as we
are using the getter, which is essentially a function, in the template. We will talk more
about such side effects in chapter 10; for now, it suffices to say this is not the most opti-
mal approach. So how can we remedy this?
Thankfully, starting from Angular v16.1 we have the ability to define a transformer
function on a component/directive input. This will apply a function of our choice to
the received value and set that calculated value, which this function returns as the
actual value of our input property. Let us refactor our component.
export class FileUploadComponent {
@Input({required: true}) label!: string;
Listing 4.5 	FileUploadComponent with a transformed “accept” input

---

## Uses the array

of accepted file
types to validate
files selected by
the user
-- 99 of 306 --
80 	C HAPTER 4 	New capabilities of Angular building blocks
@Input({
transform: (value: string) => value.split(','),
})
accept: string[] = [];
@Output() selected = new EventEmitter<FileList>();
errorMessage = '';
onFileSelected(event: any) {
const files: FileList = event.target.files;
this.errorMessage = Array.from(files)
.every(f => this.accept.includes(f.type))
? '' : 'Invalid file type';
if (this.errorMessage === '') {
this.selected.emit(files);
}
}
}
This approach allows us to be way more flexible and to reap multiple benefits:
 There is no more getter function with a separate name; we use the property
as declared.
 Reading the property definition itself gives us all the information necessary to
understand its behavior.
 The transformation logic is applied every time the input property is changed,
instead of the getter being triggered on each change detection cycle, resulting
in better performance.
 Refactoring inputs gets easier: there is no need to redefine how they are passed
from the parent components.
A lot of scenarios with transforming input properties involve casting a string to a num-
ber, or a string to a Boolean. For instance, when we define a numerical input but put it
as a conventional attribute instead of an Angular binding (like <some-component
numberProperty="10"></some-component>), we will see that Angular will read and
pass on the number provided as a string (no matter what type we specified in the com-
ponent’s TypeScript file). Of course, we can use the transform option when defining
an input and provide a function that does this type-casting properly. However, the
Angular team predicted the popularity of these scenarios and added two built-in trans-
former functions specifically for those: numberAttribute and booleanAttribute.
Now we can just import them and add to any inputs and the transformation will hap-
pen automatically:
@Input({transform: booleanAttribute}) booleanProperty = false;
@Input({transform: numberAttribute}) numberProperty = 0;
Next, we can freely use them in any template without binding unnecessarily:
<some-component numberProperty="12" booleanProperty="true"></some-component>

---

## Uses the

transformed
input directly
-- 100 of 306 --
81	4.1 	Powerful inputs
Let us now discuss how we can use inputs as means of getting data into the component
other than what was passed from the templates. Let’s see if we can simplify the logic of
dealing with routing parameters and data using Angular inputs.
4.1.3 	Binding routing parameters to input properties
When building user interfaces for showing data, we usually have a page that shows a
list of items, like our ProjectListComponent, and we have a specific “details” page for
each item, where we can comfortably show more data. This usually involves having a
route parameter, like an id, which we can use to make the specific HTTP call. Let us
build the ProjectDetailsComponent and see what challenges may arise and how we
can use component inputs to overcome them.
We want our component to take the id of a particular project and make an HTTP
call to retrieve the relevant data. Additionally, we want to display the list of subprojects,
but there is a catch: the user can navigate to the subprojects, meaning they will navigate
“back” to the same component but with a different id and, thus, different data. Of
course, we do not want to reload the entire page: we want to just react to the id change
and simply make the same HTTP call with the new id and then display the new data. Let
us build this component using conventional tools Angular provides and then see how
new input capabilities can help us simplify this component. Under the src/pages/work
directory let’s add a new file named project-details.component.ts, create a Project
DetailsComponent inside it, and add it to the work.routes.ts file with a parameter:
{ path: 'projects/:id', component: ProjectDetailsComponent }
Next, let’s write the actual implementation of the component.
@Component({
selector: 'app-project-details',
template: `
<div class="project-details">
<h3>Project Details</h3>
<div *ngIf="project$ | async as project">
<span>Project Name: {{ project.name }}</span>
<span>Project Description: {{ project.description }}</span>
<span>Logo: {{ project.image }}</span>
<div class="subprojects">
<span>Subprojects:</span>
<app-project-card
*ngFor="let subProjectId of project.subProjectIds"
[projectId]="subProjectId"
>
</app-project-card>
</div>
</div>
</div>
`,
standalone: true,
Listing 4.6 	Component using a routing parameter to load data

---

## Renders

a list of
subprojects
-- 101 of 306 --
82 	C HAPTER 4 	New capabilities of Angular building blocks
imports: [NgIf, NgFor, AsyncPipe, ProjectCardComponent],
})
export class ProjectDetailsComponent implements OnInit, OnDestroy {
private readonly route = inject(ActivatedRoute);
private readonly projectService = inject(ProjectService);
project$: Observable<Project> | null = null;
destroy$ = new Subject<void>();
ngOnInit(): void {
this.route.paramMap.pipe(
takeUntil(this.destroy$),
).subscribe((params) => {
this.project$ = this.projectService.getProject(
+params.get('id')!,
);
});
}
ngOnDestroy(): void {
this.destroy$.next();
}
}
As we can see, this implementation is quite wordy and contains many implementation
details that are not exactly related to the business logic (e.g., unsubscribing from the
Observable). Another downside is that we just subscribed to the router parameter
Observables but did not store the value; we would need another property for this if
we want to use the id elsewhere in the TypeScript code. Additionally, we need to cast
the parameter from a string (all route parameters are strings by default) to a number
so we can pass it to the ProjectService for the HTTP call. Let’s now see how Angular
proposes to mitigate all these problems. To do this, let’s visit the app.config.ts file
once more and change how we register our routing:
provideRouter(routes, withComponentInputBinding()),
The withComponentInputBinding option became available in Angular v16, and it auto-
matically passes the value of route parameters to the respective component if that com-
ponent has an input property that has the same name as the parameter—for instance,
when we previously added the ProjectDetailsComponent to our routing with a parame-
ter :id. With this option, if we have an input property on ProjectDetailsComponent
named id, Angular will automatically pass the value of the parameter to this property!
This means we can cut a lot of boilerplate from our component code. The following
listing shows how.
export class ProjectDetailsComponent implements OnChanges {
@Input({transform: numberAttribute}) id!: number;
Listing 4.7 	Component using inputs bound to routing parameters to load data

---

## Unsubscribes from the

router parameter stream
when the component is
removed from the UI
The input with the name “id” automatically receives the route
path parameter and is transformed into a number in place
-- 102 of 306 --
83	4.1 	Powerful inputs
private readonly projectService = inject(ProjectService);
project$: Observable<Project> | null = null;
ngOnChanges(changes: SimpleChanges): void {
if (changes['id']) {
this.project$ = this.projectService.getProject(this.id);
}
}
}
The advantages of this approach are pretty clear: we inject one fewer class and we have
direct access to the id property if we need it somewhere else, no Observables and
unsubscription logic, and less boilerplate code; the component is now only focused
on the business logic. The following are several important things we need to know
about component-routing input binding:
 The binding also works with resolved data and optional query parameters.
 If there is a naming clash (e.g., if a query parameter and a path parameter have
the same name), Angular will resolve it by using the following precedence: first,
it will match the resolved data, then the path parameter, and finally, if the first two
did not match, the query parameter.
 The binding only works for routed components. If a component is rendered via
the template of another one, rather than routing, the automatic binding will
not work, and we will have to instead rely on other means of passing that infor-
mation down (most commonly, just a “usual” input that gets the data from the
template of the parent).
 It is now quickly becoming the suggested way to use this approach instead of
ActivatedRoute.
Next, let us see how input properties can work with components created programmat-
ically, rather than from the template.
4.1.4 	Inputs for dynamic components
Sometimes we want to create components dynamically, rather than just spelling them
out in the template. We already encountered such a scenario in section 2.4.5, when we
lazy-loaded and then dynamically opened a confirmation popup. There are many other
scenarios—for example, rendering child components from directives when dealing with
structural directives. We haven’t discussed how we can pass inputs to those dynamic com-
ponents, as we do not invoke that component in a template to spell out a binding.
Let us examine the following scenario: we are building a loader component, which
receives some content and, if an input property indicates so, displays a custom spin-
ning loader over it to signal to users that they should wait. Let’s first implement this
component in a new src/app/shared/components/loader.component.ts file.
@Component({
selector: 'app-loader',
Listing 4.8 	Loader component with an input and projected content
If the id has changed, just repeats
the HTTP call with the new id
-- 103 of 306 --
84 	C HAPTER 4 	New capabilities of Angular building blocks
template: `
<div class="loading-container">
<ng-content></ng-content>
<div *ngIf="loading" class="blocker">
spinner
</div>
</div>`,


---

## The actual

input
-- 104 of 306 --
85	4.1 	Powerful inputs
This is not very beautiful. However, we can remedy this by writing a structural directive
that will dynamically create the LoaderComponent and pass the input value to it, wrapping
its template inside it. Let’s create a new file named loader.directive.ts in the
src/app/shared/directives folder and implement this directive, so we can see it in action
and familiarize ourselves with the way we can pass the component’s input dynamically.
@Directive({
selector: '[loading]',
standalone: true,
})
export class LoaderDirective implements OnInit, OnChanges {
private readonly templateRef = inject(TemplateRef);
private readonly vcRef = inject(ViewContainerRef);
@Input() loading = false;
templateView: EmbeddedViewRef<any>;
loaderRef: ComponentRef<LoaderComponent>;
ngOnInit() {
this.templateView = this.templateRef.createEmbeddedView({});
this.loaderRef = this.vcRef.createComponent(
LoaderComponent,
{
injector: this.vcRef.injector,
projectableNodes: [this.templateView.rootNodes],
},
);
this.loaderRef.setInput('loading', this.loading);
}
ngOnChanges() {
this.loaderRef?.setInput('loading', this.loading);
}
}
Now we can use this directive if we want to apply dynamic loading anywhere instead of
nesting the original component:
<p *loading="isSomeContentLoading">

---

## Even more content

</p>
</p>
This reduces the complexity of the template significantly and improves readability.
Now one might ask: why don’t we just write this.loaderRef.instance.loading =
this.isContentLoading;? Well, in this manner, we would set the property of the
Listing 4.9 	Directive that dynamically renders projected content

---

## The most important

part: passing the input
property “loading” to
the LoaderComponent
-- 105 of 306 --
86 	C HAPTER 4 	New capabilities of Angular building blocks
instance class, but it won’t immediately trigger a change detection run and also will work
outside of the component life cycle, meaning if, for instance, the LoaderComponent
implemented the ngOnChanges method, it would not have been called. The setInput
method mitigates this problem and is a powerful tool when dealing with dynamic
components.
Finally, let us talk about passing inputs to dynamic components in the template.
Let’s review a scenario in the “recruitment” feature: we have a list of candidates for
hiring that the user can see and then navigate to the details page of a given candidate.
On that page, they can see the general information about the candidate, their CV, and
so on. The candidate has a status, which can be “Pending CV review,” “Pending inter-
view,” “Pending evaluation,” “Rejected,” or “Waiting for onboarding.” For each of
these scenarios, under the candidate’s general information, we can see a different sec-
tion; for instance, for “Pending CV review,” we will see an EvaluateCVComponent
where we can write a description and approve or reject for an interview, for “Pending
Interview” we can see an InterviewPreparationComponent where we can add ques-
tions we want to ask during the interview, for “Rejected” we can see a RejectionLetter
component where we can detail reasons for rejection, and so on.
Also, in some cases, we might not only depend on the status of the candidate but
some other information; for example, in the case of an “Approved” status we might also
want to check if the candidate also accepted the company’s offer and only then show the
OnboardingPreparationComponent and so on. This logic might be a bit too complicated
for a simple *ngSwitch in the template, so we prefer to use the *ngComponentOutlet
directive and dynamically choose the component we want in the TypeScript code of the
CandidateDetailsComponent. Let’s see how that works in action.
@Component({
selector: 'app-candidate-details',
template: `
<div class="candidate-details">
<div>
<h2>{{ candidate.firstName }} {{ candidate.lastName }}</h2>
<p>Email: {{ candidate.email }}</p>
<p>{{ candidate.position }}</p>
</div>
<ng-container *ngComponentOutlet="actionsSection">
</ng-container>
</div>
`,
standalone: true,
imports: [NgComponentOutlet],
})
export class CandidateDetailsComponent implements OnChanges {
@Input() candidate!: Candidate;
actionsSection: Type<any> | null = null;
ngOnChanges(changes: SimpleChanges): void {
Listing 4.10 	Dynamic component via NgComponentOutlet

---

## The reference to the component

we will choose to render
-- 106 of 306 --
87	4.1 	Powerful inputs
if (changes['candidate']) {
this.actionsSection =
this.selectActionsComponent();
}
}
private selectActionsComponent(): Type<any> {
switch (this.candidate.status) {
case 'CV evaluation':
return CvEvaluationComponent;
case 'Interview preparation':
return InterviewPreparationComponent;
case 'Interview Feedback':
return InterviewFeedbackComponent;
case 'Rejected':
return RejectionLetterComponent;
case 'Approved':
return this.candidate.offerAccepted
? OnboardingPreparationComponent
: CandidateFinalizationComponent;
default:
throw new Error(`Unknown candidate status:
${this.candidate.status}`);
}
}
}
As we can see, this is something we already did in chapter 2. However, there is a new
concern: how will this component know which candidate they are working with? We
need a way to send the reference to it to the child component, but as we rendered it
dynamically, without explicitly calling them in the template, it seems like this is impos-
sible! However, from Angular v16.2, there is a new way of passing inputs to compo-
nents dynamically rendered using *ngComponentOutlet. Let’s see how we can amend
this; in our case, all of the components that can be rendered receive an input called
candidateId. We can do this by passing a record as a second parameter for the
*ngComponentOutlet directive named inputs:
<ng-container *ngComponentOutlet="actionsSection; inputs: {candidateId:
candidate.id}"></ng-container>
Using this, we can easily pass any data we need from parent to child, even if the com-
ponent is rendered dynamically. Note that right now the implementation is not type-
safe, so it fully relies on spelling the inputs out correctly, but other than that, we see
no downsides and a new, improved way of intercomponent communication.
We have seen component inputs grow to become more robust and cover many
more cases and components become simpler and more powerful than ever because
of this. Now it is time to address the second most important building block in
Angular, the directives, and see how they improved and what new capabilities they
have acquired.

---

## Actual logic of

determining which
component to render
-- 107 of 306 --
88 	C HAPTER 4 	New capabilities of Angular building blocks
4.2 	Host directives
New adopters of Angular often hear a phrase like this: “A component is a directive
that has a template.” If we take this as a given (which it is, to an extent), we can say the
converse is also true to an extent: “A directive is a component without a template.”
This makes perfect sense, as directives are intended to work with individual DOM
nodes and do not require a template, so the absence of the template does not exactly
sound like a problem. However, if we analyze how we write components and try to
apply the same to directives, we will see that the absence of the template in the case of
directives poses a certain limitation.
With components, we can use the template to invoke other components, meaning
we can compose simpler components into larger ones. With directives, we can add a
piece of template wherever the directive was called or manipulate the DOM in the
case of structural directives, but if we want to add some other directives when our
directive is called, we run out of options. Sometimes several directives are often used
together, and it makes perfect sense to us to be able to create a parent directive that
will call the other ones, instead of constantly spelling them out, or if we have a direc-
tive that uses the functionality of another directive while adding some of its own; but
again, there was no real and official way of doing this.
The good news is, starting from Angular v15, a new concept of host directives has
been added to the framework that allows us to add directives to another directive
when the latter is applied. Let us see it in action.
4.2.1 	Extending existing directives
Let us consider the following scenario: on many pages, we show links to individual
employees’ details page. We want to provide lots of information in a meaningful
way. So we think it would be nice if the user knows beforehand if the employee is
currently available or is, say, on vacation. Maybe links to employees that are not
available are grayed out, indicating we probably should not bother them. Of course,
we can write a global CSS class, say, .not-available, which will gray out the text,
and use the ngClass directive to switch it on and off depending on the employee’s
availability status.
This sounds good, but this solution is not very scalable. First, we would need to
find all links (<a> tags with a [routerLink]) in our applications that point to the
employee details page, then pull the employee data in the parent component, and
finally apply the ngClass directive to it with the relevant class. This means lots of
manual work, but even worse, we would need to keep doing this any time we put a
link to an employee’s page somewhere. This has the potential for lots of problems
down the line. To avoid this, we will use the host directives feature to automatically
add the ngClass directive and pass the inputs to it. Let us

---

## Adds or removes the class based

on the employee’s status
-- 109 of 306 --
90 	C HAPTER 4 	New capabilities of Angular building blocks
Of course, we could declare an optional tooltip input on our EmployeeNotAvailable
Directive and then implement an ngOnChanges method on it and pass the input
down the line using the tooltipRef. This approach, however, is very tedious and in
the case of multiple inputs will quickly become unmanageable. But what if we could
just tell Angular to pass the input from the EmployeeNotAvailableDirective
directly to the TooltipDirective? It turns out there is a special syntax to achieve
precisely that:
hostDirectives: [NgClass, {directive: TooltipDirective, inputs:
['tooltip']}],
Instead of manually doing all the work of passing the data through, we can just
declare that we are using the input from the TooltipDirective, and Angular will act
as if EmployeeNotAvailableDirective itself has that input and will pass the value to
TooltipDirective automatically. Also, notice that, despite the “magic strings,” this is
safe and Angular will not allow using properties that do not exist on the Tooltip-
Directive or are not marked as inputs. The same approach can be used to automati-
cally pass directive outputs the opposite way. Now let us go a level deeper and learn
what caveats to expect when dealing with host directives.
4.2.3 	Things to know when using host directives
As we have seen, host directives are pretty simple, but there are several things we need
to consider when using them. Let’s examine those next.
USAGE SPECIFICS
Host directives can be used only when the hosted directives in question are stand-
alone. The child directives themselves need to be declared as standalone and cannot
be a part of a NgModule. The directive that hosts, however, does not have the same con-
straint and can be either standalone or not. This is a big limitation if we work with
applications that have not yet transitioned to standalone. Currently, there is no way to
mitigate this other than to convert the directives to standalone.
Another thing to keep in mind is that we can host directives not only on other
directives but also on components (which also need to be standalone). Any compo-
nent will be able to have a hostDirectives option in its metadata. In case of adding
host directives to a component, the directives will be automatically applied to the host
element of the components, as follows:
<my-component hostDirective1 hostDirective2></my-component>
Note that this is just a visualization; in reality, Angular does not explicitly put the direc-
tive name and just executes the functionality of it, ignoring the selectors of the host
directives. Everything else will work in the same fashion as with applying host direc-
tives to another directive.
-- 110 of 306 --
91	4.2 	Host directives
HIERARCHY AND EXECUTION ORDER
To understand how this whole thing functions, we first need to keep in mind that host
directives are applied during compile-time, not run-time, meaning they are static

---

## Notice we intentionally

made a typo.
-- 112 of 306 --
93	4.3 	Type-safe reactive forms
This becomes more tedious if we have nested forms. For example, if we create the
AddProjectComponent, in it our form will have a FormArray of subprojects, which in
turn are FormGroups, meaning accessing them will become something like the following:
form.controls['subprojects].at(i).controls['name']
To amend this, Angular introduced the get method, which allows us to express
these forms of control access in the following way:
form.get('subprojects.' + i + '.name')
This solves the problem, but it still looks a bit ugly and relies on magic strings again.
Moreover, as this.form.value returns any, it also overlooks the fact that, even with
validations, we cannot guarantee that all fields are filled in—a fact that developers
often overlook, resulting in more hard-to-find bugs. So what’s the solution?
4.3.2 	Introducing type-safe forms
If we actually wrote the component in listing 4.12 in our HRMS application, we
would immediately notice many errors. This is because, from Angular v14, reactive
forms infer the type of the value they have, meaning the form controls we declared
when creating our forms get represented as an actual TypeScript type, rather than
any, with all the fields like name, position, and so on in place. For instance, in this
very example, if we get back to the reality of Angular v16+, we will immediately get
an error:
Argument of type 'Partial<{ firstName: string | null; lastName: string |
null; emali: string | null; position: string | null; level: string | null;
}>' is not assignable to parameter of type 'Employee'.
Type 'Partial<{ firstName: string | null; lastName: string | null; emali:
string | null; position: string | null; level: string | null; }>' is
missing the following properties from type 'Employee': id, email,
isAvailable
While this seems somewhat confusing, in reality this error just notifies us that the reac-
tive form’s value is only Partial, meaning TypeScript thinks that any of the fields
could possibly be absent. This makes sense because, even with validations, there is no
clear guarantee that the values will be there (we could theoretically access the form’s
value before the user fills in the necessary data). However, because we already checked
the form’s validity in the if statement and all the fields have “required” validators, we
can safely assume that all fields are present and just do the following:
submit() {
if (this.form.valid) {
const employee = this.form.value as Employee;
this.employeeService.createEmployee(employee);
}
}
We can type-cast the
form’s value because we
are sure it complies with
the “Employee” type.
-- 113 of 306 --
94 	C HAPTER 4 	New capabilities of Angular building blocks
Now we have a nice working thing, but what about the typo? We can type-cast to
Employee, and TypeScript will just go with it, but the problem is still there! It turns out
that when we try to use the fields in the template, we will get a nice error message:
<inp

---

## This directive

requires us to
provide width and
height for the image.
-- 117 of 306 --
98 	C HAPTER 4 	New capabilities of Angular building blocks
4.4.2 	Prioritizing image loading
Now let’s examine the next use case: as the user now has a profile picture, it will make
sense to also put it in the user’s details page, to which we can navigate from the
EmployeeListComponent. Again, we are going to use the NgOptimizedImage directive,
but this time, we have an important concern: there will be multiple images on the page
(for instance, all the logos of all the projects the user is enrolled in) and the one main
profile picture. We want the profile picture to load first, to show the users exactly what
the page is about. Thankfully, now we can achieve this in a very simple fashion:
<img [ngSrc]="employee.profilePicture" width="50" height="50"
[alt]="employee.firstName" priority />
The priority input property will tell the NgOptimizedImage to put a high fetchpriority
on this particular image, resulting in fast loading time and an improved LCP metric.
While we can possibly put the priority property on multiple images on one page,
doing so is discouraged, as it would result in performance tanking again. Instead, we
should try to determine which image(s) constitute our LCP and focus on improving
that specifically. For better dynamics, we do not even need to set the priority on “low”
for the ProjectCardComponent, so that those images definitely do not interfere with
LCP, because having one prioritized image will already tell the browser how to deter-
mine which to load first. If we want those images to be loaded immediately (even
when not in the viewport), we can just set the loading input:
<img [ngSrc]="project.image" width="100" height="100" loading="eager"/>
This way, the default lazy setting will be overridden. Now let’s see how we can further
optimize and customize the way our images are loaded.
4.4.3 	Srcsets and image loaders
Sometimes we want the websites we build to be better accessible on mobile devices.
For instance, with the HRMS tool, we want employees to be able to see the application
in a responsive way when they open it on mobile phones, without the need for down-
loading an additional dedicated app. While CSS helps us accomplish most of this,
images often stand in our way. On large pages, some images may look fine, but when
switching to mobile, they might distort, or only a (wrong) part of it may become visible.
A common practice to combat this problem is having multiple versions of the same
image, each fitting a specific viewport size, and letting the browser choose a version
that best fits the current viewport size. For instance, in the ProjectDetailsComponent,
we might want to display a large cover photo of the project with the logo and addi-
tional information and for smaller screens, only the logo. This can be done via the
srcset and sizes attributes, but with NgOptimizedDirective we can just put the sizes
we prefer and it will generate the srcset auto

---

## Error

at app.component.ts:18:11 at fetch (async) at (anonymous)
(app.component.ts:4)
at request (app.component.ts:4)
at (anonymous) (app.component.ts:17) at submit (app.component.ts:15)
at AppComponent_click_3_listener (app.component.html:4)
Now we can clearly see the sequence of steps that lead to the error, the event that
started it, the callback that handled the event, and the HTTP call that caused it in the
end. This is arguably one of the best “silent” improvements in Angular’s developer
experience and will save lots of time and energy when dealing with bugs.
4.6 	Exercises for the reader
 Build a UserBadgeComponent that displays a specific icon (admin, employee,
HR team) next to the user’s profile picture. It receives the user’s data as input
and transforms it into the CSS class of the corresponding icon.
 Build an UnlessDirective that hosts NgIf but uses a negated condition.
 Build a custom image loader that adds a specific “quality” query parameter
depending on the user’s preference (stored in localStorage). Quality can be
low, normal, high, or ultra.
 In an existing project (you can use our HRMS application if you have been cod-
ing along with the book), refactor the templates to use the self-closing compo-
nent tags.

---

## Summary

 We can now mark inputs as required, transform their values before setting on
component properties, and bind routing data (query parameters, path parame-
ters, resolved data) to them.
 It is now possible to compose directives using the new hostDirectives metadata
option, adding existing directives to new ones, and pass inputs/outputs to them.
 Angular reactive forms are now type-safe, where types could both be inferred
from the form definition or provided explicitly.
 A new NgOptimizedImage directive is available to boost image loading perfor-
mance, mark its priority, or seamlessly integrate with CDN providers.
 Angular now provides the ability to use the fetch function as basis for HTTP
calls rather than XMLHttpRequest.
 In templates, we can now use self-closing tags instead of writing out the closing
tag in its entirety.
-- 122 of 306 --
103
RxJS in modern Angular
So far in this book, we have built many features using the different tools that Angu-
lar provides. We have already interacted with RxJS several times, mainly when mak-
ing HTTP calls and handling them in interceptors. However, we can safely say that
this is only a tiny part of all the capabilities that RxJS can give us when we are devel-
oping frontend applications. In this chapter, we are going to learn about reactive
programming and explore RxJS, the first-choice tool for working in this paradigm,
its complex (and sometimes sadly overengineered) relationship with Angular, and
learn how new modern tools provided by the Angular team help us integrate RxJS
seamlessly into our Angular applications. First, let’s understand what RxJS is used
for, and what is this “reactive programming” we keep hearing about all the time.

---

## This chapter covers

 Reactive programming principles
 Using RxJS to build functionality that uses
reactive programming
 Unsubscribing from observables in a new way
 Using dependency injection in custom RxJS
operators
-- 123 of 306 --
104 	C HAPTER 5 RxJS in modern Angular
5.1 	What is reactive programming?
To understand reactive programming, let us first understand how frontend in general
works. With Angular, we know that an app is basically a collection of interconnected
components. Each of these components takes some data, renders some UI, and then
reacts to events from that UI (let’s emphasize the word “react” here). Take this most
basic of examples, a component that shows a counter, where we can increment or dec-
rement a number, shown in the following listing.
@Component({
selector: 'app-counter',
template: `
<button (click)="decrement()">-</button>
<span>{{ count }}</span>
<button (click)="increment()">+</button>
`,
})
export class CounterComponent {
count: number = 0;
increment() {
this.count++;
}
decrement() {
this.count--;
}
}
Here, the “data” is the count property, which can be changed
in the future. From now on, we refer to this data as “state,” as
this is the most popular naming convention when dealing
with this particular terminology. So the state is essentially all
the data we use to show the UI. The UI is the template we cre-
ated. Notice we used our state to display a part of this UI:
{{ count }}. Finally, we have event handlers like increment()
and decrement(), which we bound to “click” events. Thus the
life cycle of our component can be described with a very sim-
ple diagram, shown in figure 5.1.

---

## The dotted line in the figure indicates that events are what

change the state (which further triggers changes in the UI).
Notice that the state is the single source of truth here (to
change UI we need to change the state), and the state itself
can only be changed via (asynchronous) events. These desig-
nations are not very consequential for us right now but will become very important in
the future when we discuss change detection in Angular. What is actually important is
Listing 5.1 	Counter component example
UI

---

## Events

-- 124 of 306 --
105	5.2 	Why we (still) need RxJS
that we have a system where we react to changes in a “chaotic” manner, as we do not
call the methods we defined ourselves but rather pass them to event handlers so that
they can be called later, meaning we “react” to events. Let’s further explore this dis-
tinction and introduce two new (rather simple) terms. Take the following code, for
example:
const data = getData();
alert(data)
Now this isn’t very meaningful, but it does not have to be. We call a function, get a
result, and then alert it. This is what we would call a “pull” system; we need some data
that is “stored” elsewhere, so we call a function and pull this data. We, as developers,
get the data on demand, whenever we need it in the code, and then work with it. Now
let’s look at this piece of code:
document.addEventListener('click', event => alert(event))
Here, however, we can see something that is called a push system: we wrote some
code, but it will not execute until the event listener pushes an event in our direction
and calls the callback function we provided. In this scenario, we do not make any
demands for the data we (might) work with and rather wait for another actor (the
“click” events in this case) to send the data to us.
We might be tempted to equate pull-based systems to synchronous code and push-
based systems with asynchronous code, and in a vast number of scenarios this will be
the case, but practically, there is nothing that requires a system to be asynchronous to
be push-based or vice versa (we can write asynchronous code with the async keyword
and from the code perspective it will be a pull-based system). Again, right now this dis-
tinction might not seem very important to us, but in the next chapter, when we learn
about signals, we will see how large of a difference this makes.
So what does it have to do with reactive programming? Well, to keep everything
simple, reactive programming is essentially the parts of a codebase that work with
push-based systems, and instead of providing on-demand access to data, they handle
the data whenever it arrives. Essentially, if we go back to figure 5.1, for us reactive pro-
gramming represents the “events” part of the flow and how it affects the state and,
consequently, the UI.
Let us now dive deeper and see why Angular uses RxJS for this, what the problems
are, and what the team offers as solutions to those problems.
5.2 	Why we (still) need RxJS
As mentioned earlier (and as we probably already knew anyway), for Angular applica-
tions, the go-to solution for reactive programming problems is RxJS, the Reactive Exten-
sions library for JavaScript. This immensely popular library offers framework-agnostic
building blocks like observables, subjects, operators, and so on to work with streams of
-- 125 of 306 --
106 	C HAPTER 5 RxJS in modern Angular
events, which comes in handy when working on frontend applications. Angular uses
RxJS both internally (tools like the EventEmitter, for instan

---

## Sends a notification to all

observables to complete when
the component is removed
-- 128 of 306 --
109	5.3 	Unsubscribing from observables
Note one caveat: we want to limit the number of requests that we send to the
server because the user might be typing a lot of characters, and there is no need to
send a request each time the user hits a key on their keyboard; instead it makes
more sense to send one request when the user is done typing. We will achieve this by
creating a form control and then subscribing to its valueChanges observable while
utilizing the debounceTime operator, which is an operator that ignores emissions
until there are no more notifications in a given time period (in our case, say, if the
user stops typing for 500 milliseconds). The following listing shows an implementa-
tion with the unsubscription logic.
export class CandidatesListComponent implements OnInit, OnDestroy {
private readonly candidateService = inject(CandidateService);
candidates$ = this.candidateService.getCandidates();
searchControl = new FormControl('');
destroy$ = new Subject<void>();
search$ = this.searchControl.valueChanges.pipe(
debounceTime(500),
takeUntil(this.destroy$)
);
ngOnInit(): void {
this.search$.subscribe((value) => {
if (value) {
this.candidates$ = this.candidateService.getCandidatesByName(value);
} else {
this.candidates$ = this.candidateService.getCandidates();
}
});
}
ngOnDestroy(): void {
this.destroy$.next();
}
}
At this point, this is quite a clean implementation that does not really need much
improvement. However, soon we might realize that such search functionality (with
debouncing time and a form control) might be necessary in other places too—for
example, in the EmployeeListComponent.
We can, of course, copy-paste this solution to that place, and any other component,
but that will reduce the ability to refactor our code in the future. What if we decide the
debounce time in every component needs to be 700 milliseconds and not 500? So,
Listing 5.3 	Building candidate search with time delay

---

## Fires the destroy

subject to complete
all subscriptions
-- 129 of 306 --
110 	C HAPTER 5 RxJS in modern Angular
thinking of a solution, we might want to implement a function that takes a FormControl
and returns the search observable coupled with the debounce and unsubscription logic.
Immediately we can see a problem: how can we unsubscribe upon a component’s
destruction if we are writing code in a function not a component? It turns out, in
Angular 16, we can do this using a special token called DestroyRef. Let’s see it in
action when we implement our function. In the src/app/shared/functions folder let’s
create a file named create-search.ts and put our implementation there.
import { DestroyRef, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
export function createSearch<T>(control: FormControl<T>) {
const destroyRef = inject(DestroyRef);
const destroy$ = new Subject<void>();
destroyRef.onDestroy(() => destroy$.next());
return control.valueChanges.pipe(
debounceTime(500),
takeUntil(destroy$),
);
}
So what is this DestroyRef? Essentially, it is a reference to the destruction of the con-
text in which the function is invoked. For example, if we invoke the function in a com-
ponent, the DestroyRef will reference us that specific component’s destruction life
cycle, meaning the callback we provided to the onDestroy method will be invoked
when the component is destroyed as if we have written that callback inside that com-
ponent’s ngOnDestroy method. Now we can use this function anywhere; for instance,
the following listing shows how it will simplify the CandidateListComponent.
export class CandidatesListComponent implements OnInit {
private readonly candidateService = inject(CandidateService);
candidates$ = this.candidateService.getCandidates();
searchControl = new FormControl('');
search$ = createSearch(this.searchControl);
ngOnInit(): void {
this.search$.subscribe((value) => {
if (value) {
this.candidates$ = this.candidateService.getCandidatesByName(value);
} else {
this.candidates$ = this.candidateService.getCandidates();
}
});
}
}
Listing 5.4 	Reusable function for performing searches with time delay
Listing 5.5 	Candidate list component with the reusable search logic
-- 130 of 306 --
111	5.3 	Unsubscribing from observables
As we can see, there is no further need for an ngOnDestroy method here. Of course,
this is a specific (albeit very useful) scenario. But what about unsubscribing in general
from other observables in components or directives? It turns out we have an official
way of doing that now.
5.3.4 	The takeUntilDestroyed operator
We already covered in the previous two sections how using a subject that signals the
destruction of a component to unsubscribe from observables is the most popular and
clean way of dealing with the problem, and we also mentioned some downsides of this
approach. Starting from Angular v16, the core team has begun impl

---

## The actual employee

editing form
takeUntilDestroyed operator will
automatically unsubscribe from this
stream when the component is destroyed.
-- 132 of 306 --
113	5.3 	Unsubscribing from observables
if (!hasPermission) {
this.form.controls.firstName.disable();
this.form.controls.lastName.disable();
this.form.controls.email.disable();
} else {
this.form.controls.firstName.enable();
this.form.controls.lastName.enable();
this.form.controls.email.enable();
}
});
}
}
Now this is beautiful: we implemented our subscription and did everything we would
do anyway, and just in a single line of code we also took care of unsubscribing from
the stream we used! A real cherry on top is the fact we did not create any subjects to
signal about the destruction of the component and did not even implement the
ngOnDestroy method. This approach, besides being now the official way of unsub-
scribing, is also cleaner and easier to explain.
We previously mentioned several ways of unsubscribing from observables; one of
them is the signaling subject. With this new approach, it would be beneficial if we had
that approach implemented in our previous, existing projects: the subject approach
makes it way easier to migrate to the new official solution. All we have to do is remove
the destroy subjects, remove the ngOnDestroy method (unless it had other, unrelated
logic in it, so we have to be careful there), and use the takeUntilDestroyed custom
operator instead of RxJS’s takeUntil.
However, there is a small caveat that we need to discuss related to the takeUntil
Destroyed operator. Here we must dive a bit deeper and understand how it actually
works. For this, let’s go back to listing 5.4 and remember that we already used the
DestroyRef injectable to unsubscribe from an observable. There, the DestroyRef was
used to hook onto the event of the destruction of the component in which the func-
tion is called and to terminate the subscription. It turns out that takeUntilDestroyed
does the same thing; it utilizes the DestroyRef to learn about context destruction and
completes the observable on which we use it.
But here is a catch: in chapter 3, section 3.2.2, we learned that the inject function
only operates in an injection context; as the takeUntilDestroyed function uses it to
inject the DestroyRef, it means that the takeUntilDestroyed function can only be
used in similar injection contexts. In our example, we used that operator to subscribe
to an observable inside a component’s constructor, which works as expected; but what
if we wanted to subscribe to an observable inside, say, the ngOnInit method, or any
other method for that matter?
Thankfully, Angular has got us covered here. Because takeUntilDestroyed is a
function, it can accept an argument, so we can provide the relevant DestroyRef when-
ever we use the operator outside of an injection context. For instance, if we did the

---

## Logic we perform

on subscription
-- 133 of 306 --
114 	C HAPTER 5 RxJS in modern Angular
same thing in the ngOnInit method, the component code would be mostly the same,
with one notable exception, as shown in the following listing.
export class EditEmployeeComponent implements OnInit {
permissionsService = inject(PermissionsService);
destroyRef = inject(DestroyRef);
form = new FormGroup<EmployeeForm>({
firstName: new FormControl('', {
nonNullable: true,
validators: [Validators.required],
}),
lastName: new FormControl('', { nonNullable: true }),
email: new FormControl('', { nonNullable: true }),
position: new FormControl('', { nonNullable: true }),
level: new FormControl('', { nonNullable: true }),
});
ngOnInit() {
this.permissionsService.hasPermission('EditEmployeePrivateDetails').pipe(
takeUntilDestroyed(this.destroyRef),
).subscribe(hasPermission => {
if (!hasPermission) {
this.form.controls.firstName.disable();
this.form.controls.lastName.disable();
this.form.controls.email.disable();
} else {
this.form.controls.firstName.enable();
this.form.controls.lastName.enable();
this.form.controls.email.enable();
}
});
}
}
Now we can easily use the operator in any method we want, as long as we pass the
DestroyRef to it. One important observation here would be that, back in listing 5.4,
we also used the DestroyRef (and there other scenarios where we use that injectable
in functions) when writing our createSearch function, meaning that the function will
not work outside injection contexts too. So how can we work around this? Well, we can
make it work like takeUntilDestroyed—meaning, it can accept an optional reference
to the DestroyRef as an argument. The following listing shows a slightly revised ver-
sion of that function.
export function createSearch<T>(
control: FormControl<T>,
destroyRef = inject(DestroyRef),
) {
const destroy$ = new Subject<void>();
Listing 5.8 	Using takeUntilDestroyed outside injection context
Listing 5.9 	Passing the DestroyRef into a function as an argument
Injects the DestroyRef into the
component to pass it on to the
takeUntilDestroyed operator later

---

## Now subscribes

inside the ngOnInit
method instead of
the constructor
Passes the component’s
DestroyRef to the
takeUntilDestroyed operator
DestroyRef is now an optional
argument on the function and
can be passed from the code
that invokes it.
-- 134 of 306 --
115	5.4 	Writing our own custom RxJS operators
destroyRef.onDestroy(() => destroy$.next());
return control.valueChanges.pipe(debounceTime(500), takeUntil(destroy$));
}
Notice how the destroyRef still defaults to inject(DestroyRef), meaning our existing
code that uses the function without the parameter will continue working in the same
fashion. Also note that we could have used the takeUntilDestroyed operator here
instead (preferable), but we would still need to have the DestroyRef as an optional
argument to be able to pass that reference to the takeUntilDestroyed operator.
We have explored a new, built-in custom operator in Angular, which greatly
relieved our efforts when working with RxJS code and helped us remove lots of boiler-
plate from the project. Now let us dive deeper into this topic and see how we can write
our own custom RxJS operators and how the inject function greatly improves the
developer experience when dealing with them.
5.4 	Writing our own custom RxJS operators
RxJS operators are a great way of enhancing observables and providing new things
that we can do with them. There are more than 100 built-in RxJS operators, and the
nature of the library allows us to create our own operators, which can now also incor-
porate the business logic of our applications inside observables. First, let us see what
an RxJS operator is, and how a custom one can be created, and then focus on writing
an actually useful custom RxJS operator for our application. Let us start by under-
standing the nature of RxJS operators.
5.4.1 	What is an RxJS operator?
RxJS is rich with different functions that we can use to enhance our experience with
the library and achieve different behaviors. Some of those functions are the creation
functions: functions we can use to create observables with different predefined behav-
iors. For example, one such function is the of function, which takes some values and
returns an observable that emits those values in the specified order:
of(1, 2, 3);
This will emit 1, 2, 3. This function is especially useful for learning examples, as we
can directly show what values are going to be emitted, so we will use it often in this sec-
tion. Next, there are combining functions, that take several existing observables and
return a new observable that somehow combines the behavior of the source observ-
ables. For example, the merge operator will take several observables and emit when-
ever one of them emits something:
merge(of(1, 2, 3), of(4, 5));
This will emit 1, 2, 3, 4, 5. These sorts of functions will become very important in the
next two chapters when we learn about signals and how they can replicate functionality
similar to what we can achieve with these functions in RxJS. For now, the topic of 

---

## Here we declare an

optional parameter that
the operator can take.
-- 140 of 306 --
121	5.4 	Writing our own custom RxJS operators
tap(item => console.log(`${message ? message + ': ' : 	''}${item}`)),
);
}
}
Now we can use the operator with a custom message:
of(1, 2, 3).pipe(log('Number')).subscribe();
This will log Number: 1, Number: 2, Number: 3 to the console. Now we have an opera-
tor that is itself custom and can be further customized with a parameter. But can we
do something about the boilerplate code? It would be really nice if we could just write
the business logic directly, instead of all the same code we did here. It turns out RxJS
provides tools for building such custom operators out of the box. Let’s learn about the
MonoTypeOperatorFunction type and the pipe function.
First, let us briefly discuss the MonoTypeOperatorFunction. We already talked about
the OperatorFunction type, a generic type description of an RxJS operator. There,
OperatorFunction is a type that accepts two type parameters: one for the source observ-
able and one for the result. Note those can be different; for instance, the map operator
that we touched on in this chapter takes one type of an observable but can possibly
return another type (for instance, convert an observable of strings to numbers). The
MonoTypeOperatorFunction, on the contrary, is extended from OperatorFunction
but only takes one type parameter, because it represents an operator that does not
change the type of the source observable. For instance, the filter operator is an
example of a MonoTypeOperatorFunction, because it does not change the type (or the
value, for that matter) of emissions from the source and only restricts them on the
basis of the predicate function that we provided. Our custom log operator is also an
example of a MonoTypeOperatorFunction, as it only performs a side effect (logging to
the console) but does not interfere with the stream itself in any way.
The other tool we mentioned is the pipe function. Note that it is different from
the pipe method, as this one is an independent function, not a method on the
Observable class. Despite being different from the code’s perspective, this function
essentially does the same thing: pipes RxJS operators to create a new large operator.
We will now use this to rewrite our log operator without all the boilerplate.
function log<T>(
message: string = ''
): MonoTypeOperatorFunction<T> {
return pipe(
tap(item => console.log(`${message ? message + ': ' : 	''}${item}`)),
);
}
Listing 5.12 	Using RxJS built-in tools to create a custom operator

---

## We use the pipe function

to invoke other operators.
-- 141 of 306 --
122 	C HAPTER 5 RxJS in modern Angular
Note that in this scenario it would have been enough to just write return tap(item
=> console.log(`${message ? message + ': ' : ''}${item}`)), without the pipe
function, as we only used a single operator. But in general, we write custom RxJS oper-
ators to be able to combine several existing operators with a sprinkle of business logic,
so the pipe function is naturally used almost always.
Now, having familiarized ourselves with these powerful tools, let us use them to
build and test our permissions operator in action.
export function hasPermissions<T>(
permissions: Permissions[],
permissionsService = inject(PermissionsService),
): MonoTypeOperatorFunction<T> {
return pipe(
withLatestFrom(permissionsService.hasPermissions(permissions)),
filter(([, hasPermissions]) => hasPermissions),
map(([value]) => value)
);
}
As we can see, we did quite a lot of heavy lifting by just three to four lines of code. This
operator gets the list of permissions, injects the service, and uses it to check the exis-
tence of certain permissions, and then either allows the operator to proceed or not,
and finally, after proceeding, it returns the original emission. Let’s use this in an inter-
ceptor to see how it functions and disallow calls to employee-related APIs if the user
has no employee-related permissions. In the src/app/shared/interceptors folder, let’s
create a new file named employee-permissions.interceptor.ts and put the code in the
following listing there.
Listing 5.13 	Custom RxJS operator that uses dependency injection

---

## Yet again we inject the

service as a parameter with
a default value, so as to be
able to use the operator
outside of injection context
by providing the reference
to the PermissionsService
manually.
We use the withLatestFrom operator, which takes another stream and
adds its latest emission to the value of the current observable, making
the next emission a pair of the value of the source observable and
the latest value from the other observable.
Here we can see that the value emitted is a tuple, where the first element is the
item that the source observable has emitted, and the second one is a Boolean
returned by the hasPermissions method. We do not need the first item, as we
do not perform any logic on it, so we ignore it by putting a comma first. We
pick the second value and check if the permission is there.

---

## We map the value back to

whatever the source observable
has emitted originally so as to
not change anything from the
perspective of the developer
who uses this operator on some
observable of theirs.
-- 142 of 306 --
123	5.4 	Writing our own custom RxJS operators
export const employeePermissionsInterceptor: HttpInterceptorFn = (
req: HttpRequest<any>,
next: HttpHandlerFn
) => {
return next(req).pipe(
hasPermissions(['CreateEmployee', 'DeleteEmployee',
'EditEmployeeGeneralDetails', 'ViewEmployees']),
);
};
Here we make sure that no HTTP request made even by accident will pass through
unless the user does have the permissions; this also potentially makes the server’s life
easier, as we do not make calls that would result in, say, a “403 Forbidden” response.
Let’s visualize this with a marble diagram of our own making (see figure 5.5).
Note that this looks pretty much like the marble diagram for the filter operator (see
figure 5.6).
This is because our operator is essentially a multilayered wrapper around that opera-
tor, which is the one that performs the actual logic we want.
Furthermore, this can be used in other scenarios; for instance, we can add such pre-
ventions on observables that are not related to HTTP calls in any way; our implementa-
tion of the operator does not include any assumptions about the source observable that
Listing 5.14 	Using a custom RxJS operator in an Angular interceptor
hasPermissions(['ViewEmployees'])
a 	b 	c 	d 	e 	f
c 	d 	e 	f
Figure 5.5 Marble diagram of the hasPermissions custom operator. Initially, the user has
no permissions, but at some point in time before emission c, the permission has been granted.
filter(x => x > 10)
2 	30 	22 	1	5 	60
30 	22 	60
Figure 5.6 	Marble diagram of the filter operator
-- 143 of 306 --
124 	C HAPTER 5 RxJS in modern Angular
it will be used on. This can become very handy if we use state management libraries
like NgRx, which use RxJS observables extensively.
We also encountered a further use case for using the inject function as opposed to
the constructor DI. With the constructor approach, we would not be able to inject
dependencies and would be required to always pass them as a parameter to our custom
operators. With this added capability, writing custom RxJS operators (which in itself
was always possible) becomes more appealing, increasing the reusability of our Angu-
lar codebases and reducing code copy-pasting.
So far, we have extensively discussed the state of RxJS in Angular, what new tools we
have, and how we can improve our coding experience when using reactive program-
ming in Angular applications. The exciting news is that this journey is far from over:
for now, we have only covered RxJS coupled with Angular as it used to be prior to
version 16. In version 16, the introduction of signals—the new reactive primitive—
happened, bringing with it a host of new problems and solutions when dealing with
RxJS. In the next two chapters, we will talk in-depth about signals and also cover the
topic of how they

---

## Summary

 RxJS continues to be a vital part of Angular codebases.
 Reactive programming can be used to express a wide variety of scenarios devel-
opers encounter in frontend applications.
 Recent developers have added important tools that help make RxJS work with
Angular seamlessly.
 We can now inject the DestroyRef to access a component’s end-of-life event
from an outside context.
 Now we can use the takeUntilDestroyed operator to unsubscribe from RxJS
observables in Angular components.
 We can use the inject function to write custom RxJS operators that benefit
from dependency injection.
-- 144 of 306 --
125
Signals: A new approach
to reactive programming
In the previous chapter, we talked about reactive programming, how it is useful when
working with frontend applications, and how Angular’s commonly chosen library to
work with reactivity is RxJS. We covered new approaches and tools Angular provides
for working with RxJS, but we did not cover the problems that RxJS itself has that can-
not be mitigated simply by adding new tools into the arsenal of Angular developers.
In this chapter, let’s focus on these new changes and discuss signals: a new reactive
primitive introduced by the Angular core team into the framework itself, which
allows us to read values, subscribe to them, derive new values, and execute side effects
without having to deal with RxJS at all. Let us see why this new primitive will be help-
ful and allow us to mitigate various problems with reactivity.

---

## This chapter covers

 Problems developers face when working with
RxJS in Angular
 Introducing signals, Angular’s new reactive
primitive
 Creating new signals and side effects from
existing ones
 Signals interoperability with RxJS
-- 145 of 306 --
126 	C HAPTER 6 Signals: A new approach to reactive programming
6.1 	Why go beyond RxJS?
Previously, we described RxJS as a powerful, flexible, and very capable library for
working with reactivity-related logic. So if this library is so mighty, why do we need to
introduce another approach? It turns out the vast capabilities of RxJS might actually
be a part of the problem in this case. Let’s see what the problems are and then discuss
the solutions.
6.1.1 	What are the problems with RxJS?
Every Angular developer at some point has to start a phase of learning RxJS. Often,
the obstacles they encounter on their way are the same regardless of the application
they work on or the level of complexity of the problems they try to solve. So what are
those problems? Let us see.
A QUITE STEEP LEARNING CURVE
RxJS is hard, and that is no secret. In the previous chapter, we spent quite a bit of time
explaining the simplest, core concepts of RxJS like observables and operators. Lots of
stuff goes on under the hood too, like how observables work together and how to
combine them. Vertically it gets no better; when we understand how, say, operators
function, we then realize there are so many of them: RxJS has more than 120! No one
knows all of them by heart, but it makes sense to understand different “families” of
operators, which takes time. Often operators differ very, very slightly while offering
seemingly the same functionality. Observables have other related concepts like sched-
ulers, subscriptions, and so on. Learning and mastering all of those takes time and
effort that, in the case when we are not developing an extremely large application, might
be considered wasted. The Angular community long yearned for a simpler way to do
basic reactivity; hence, signals were introduced in v16.
THE STATELESS NATURE OF OBSERVABLES
To better understand this point, let us explore this simple component that uses RxJS.
@Component({
template: `
<div>
<h2>Data</h2>
<ul>
<li *ngFor="let item of data$ | async">
{{ item.name }}
<button (click)="deleteItem(item)>Delete item</button>
</li>
</ul>
</div>
`,
standalone: true,
})
Listing 6.1 	Subscribing to an observable for its latest value

---

## Displays the

data with the
async pipe
-- 146 of 306 --
127	6.1 	Why go beyond RxJS?
export class DataComponent implements OnInit {
private dataService = inject(DataService);
private permissionsService = inject(PermissionsService);
private destroyRef = inject(DestroyRef);
private dialogService = inject(DialogService);
data$ = this.dataService.getData();
permissions: Permission[] = [];
ngOnInit() {
this.permissionsService.hasPermissions(this.permissions).pipe(
takeUntilDestroyed(this.destroyRef),
).subscribe(permissions => {
this.permissions = permissions;
});
}
deleteItem(item: Item) {
if (!this.permissions.includes('DeleteItem')) {
return this.dialogService.open('You do not have permissions to
delete this item.');
}
this.dataService.deleteItem(item);
}
}
As we can see, the fact that permissions are represented by observables is a problem
here. We now need to write a bunch of boilerplate code to be able to access the latest
value of the permissions. In the case of the data, this problem is mitigated by the
async pipe and the fact that we only use it in the template. In the case of the permis-
sions, its value is not displayed anywhere in the template but rather is used by the com-
ponent’s code to perform a check.
In this case, we either need to somehow extract it in the template (even if it is not
really needed there) and pass it as an argument to the deleteItem method (which will
introduce even more complexity and confusion) or subscribe to it and extract to a
local property (what was done here). Another approach would be to convert the per-
missions observable to a BehaviorSubject so that we can access the latest valuer any
time we want, but that again would introduce some complexity, require unsubscrib-
ing under the hood, and make the component generally harder to explain to newly-
onboarded team members.
Thus, observables not being representative of a state, but rather events (as we dis-
cussed in the previous chapter), poses a significant problem when authoring Angular
components. Larger components can have dozens of lines of code filled with such
boilerplate subscriptions, which only exist to cover up an implementation detail and
have zero relation to the actual business logic of the component. Further in this chap-
ter, we will see how signals help us avoid such scenarios. Now, let us explore the last
major problem RxJS brings into the world of Angular applications.
Data is an observable.

---

## We cannot store permissions as

simply an observable, because we
need its value somewhere in the
component code, not the template.
A subscription that exists purely
to extract the value from the
permissions observable into a
component property to be able
to use it later

---

## Uses the latest value of the

permissions observable
-- 147 of 306 --
128 	C HAPTER 6 Signals: A new approach to reactive programming
ASYNC VS . SYNC AND GLITCHES
We mainly talked about RxJS observables in the context of asynchronous program-
ming, but we also mentioned that observables can be either synchronous or asynchro-
nous. Thus, when combining several observables into a single stream, we can run into
hard-to-debug problems, especially when the observables are of two different “sorts.”
Again, let us consider an example component to better see the problem.
@Component({
standalone: true,
imports: [AsyncPipe, ReactiveFormsModule, NgIf],
template: `
<input placeholder="Name" [formControl]="form.controls.name"/>
<label>Can have duplicates</label>
<input type="checkbox" [formControl]="form.controls.allowDuplicates"/>
<button>Save</button>
<button *ngIf="canSaveAsDuplicate$ | async">

---

## Save as duplicate

</button>
`,
})
export class App {
private readonly dataService = inject(DataService);
form = new FormGroup({
name: new FormControl(''),
allowDuplicates: new FormControl(false),
});
hasDuplicates$ = this.form.controls.name.valueChanges.pipe(
switchMap(
name => this.dataService.checkForDuplicates(name)
),
);
canSaveAsDuplicate$ = combineLatest([
this.form.controls.allowDuplicates.valueChanges,
this.hasDuplicates$,
]).pipe(
map(
([allowDuplicates, hasDuplicates]) =>
allowDuplicates || !hasDuplicates),
);
}
Now this is a solid, reactive implementation of a somewhat complex logical condition; it
is very concise and easy to read. However, it has one glaring problem: if we actually run
this code and click on the checkbox immediately, the “Save as duplicate” button will not
appear. So what is the problem here? The combineLatest operator takes several observ-
ables and emits whenever one of the source observables emits. However, it starts emitting
Listing 6.2 	Combining asynchronous and synchronous observables

---

## Combines the result of the

HTTP call with the local
checkbox’s value
The actual condition’s logic: either
the user allowed duplications via
the checkbox or duplicate names
do not exist anyway.
-- 148 of 306 --
129	6.1 	Why go beyond RxJS?
only when all of the source observables have emitted a value at least once (otherwise,
there would be nulls all over the place when the first emission occurs). But in our case,
the hasDuplicates$ observable is asynchronous (it is making an HTTP, and that is only
after the user actually inputs some characters in the name input), but the form.allow-
Duplicates.valueChanges observable is synchronous, meaning that its combination
might have to wait a while before it actually emits a value. Thus, even if the user has
clicked on the checkbox, the button will not appear until they input some characters.
This can be mitigated by using the startsWith operator and putting some default
value into the streams that we combine, but this introduces more complexity, and in a
large component such things can easily get overlooked only to then become bugs that
are really hard to trace and fix. This behavior of being able to be either sync or async can
also become a source of race conditions, when some data we anticipate earlier arrives
later, causing a bug, and further complicating things. Again, this all comes back to the
fact that observables represent events, but in Angular applications, developers very often
try to describe a state of things with them, rather than just streams of notifications.
Now that we have laid the main foundational problems with RxJS in Angular, let’s
focus on the solution and find out what we expect from such a potential solution for
this problem. Afterward, we will introduce signals and explore how they fix all the
problems we mentioned here.
6.1.2 	What must the solution look like?
Before we go forward and lay out the principles on which a potential solution will be
built, let’s also state that it is not possible to “fix” RxJS from inside Angular, meaning
there is no logic that the Angular core team could put, say, in the rxjs-interop package
that we mentioned in the previous chapter so that all these problems go away. The
problems are intrinsic either to RxJS itself (observables can be either sync or async,
and there’s nothing we can do about it) or to the way developers treat RxJS in Angular
apps (they are going to represent state as an observable, and we cannot expect to per-
suade everyone to stop doing this). With this in mind, let’s now set up our rules for
the new reactive primitive.
V ALUE CAN ALWAYS BE READ
This one is simple: we can access the latest value of the reactive primitive whenever we
want, without the need to “subscribe” to it. Value is read synchronously, it always has
some default value, and so on.
READING THE VALUE DOES NOT AFFECT THE APPLICATION IN ANY WAY
In RxJS, as we saw, reading the value means subscribing to it. Sometimes this entails
some other effect in the application. For instance, if we subscr

---

## To read the value

of a signal in the
template, we will
just invoke the
signal, same as
always.
-- 155 of 306 --
136 	C HAPTER 6 Signals: A new approach to reactive programming
<td>{{ request.employeeId }}</td>
<td>{{ request.startDate | date }}</td>
<td>{{ request.endDate | date }}</td>
<td>{{ request.type }}</td>
<td>{{ request.status }}</td>
<td>{{ request.comment }}</td>
<td>
<button *ngIf="request.status ===
'Pending'">Approve</button>
<button
*ngIf="request.status === 'Pending'">

---

## Reject

</button>
<button>Delete</button>
</td>
</tr>
</tbody>
</table>
`,
standalone: true,
imports: [NgFor, NgIf, DatePipe],
})
export class TimeOffManagementComponent {
requests = signal<TimeOffRequest[]>([
{
id: 1,
employeeId: 1,
startDate: new Date().toISOString(),
endDate: new Date().toISOString(),
type: 'Vacation',
status: 'Pending',
},
{
id: 2,
employeeId: 2,
startDate: new Date().toISOString(),
endDate: new Date().toISOString(),
type: 'Sick Leave',
status: 'Approved',
comment: 'Feeling pretty sick today :(',
},
]);
}
One question we might have is about the part where we invoke the signal in the tem-
plate like a function. We may have heard that calling functions in the template is a sort
of bad practice, so why do this here? Note that Angular will call the function each
time it suspects that there might have been a change in the data, which will need to
be reflected in the UI, meaning whatever computation the function does, it will be
re-executed. However, depending on a function, this might be something that is not
important at all or something that will take lots of (unnecessary) time to complete,
affecting performance. However, in the case of signals, this function call essentially

---

## Signal that represents the

array of time-off requests;
the data is added
manually for now.
-- 156 of 306 --
137	6.3 	Building Angular components with signals
immediately returns the value that is already there, meaning it is not something that will
affect performance (reading signal values does some other things too; we will learn
about them in the next chapter when we dive a bit deeper in their internal workings).
Next, let us practice our knowledge of updating signal values by creating the func-
tions that will approve or reject time-off requests.
6.3.2 	Handling signals in Angular components
Because we are working with arrays of objects, let us go forward and use the set and
update methods to handle the data changes.
export class TimeOffManagementComponent {
requests = signal<TimeOffRequest[]>([
{
id: 1,
employeeId: 1,
startDate: new Date().toISOString(),
endDate: new Date().toISOString(),
type: 'Vacation',
status: 'Pending',
},
{
id: 2,
employeeId: 2,
startDate: new Date().toISOString(),
endDate: new Date().toISOString(),
type: 'Sick Leave',
status: 'Approved',
comment: 'Feeling pretty sick today :(',
},
]);
approveRequest(request: TimeOffRequest) {
this.requests.update((requests) => {
const index = requests.findIndex((r) => r.id === request.id);
return requests.map(
(item, i) => i === index ? ({
...item,
status: 'Approved',
}) : item);
});
}
rejectRequest(request: TimeOffRequest) {
this.requests.update((requests) => {
const index = requests.findIndex((r) => r.id === request.id);
return requests.map(
(item, i) => i === index ? ({
...item,
status: Rejected',
Listing 6.5 	Changing signal values in a component

---

## We use update to approve a

time-off request. We do it by
mapping the existing array of
requests to a new array, in
which the exact request
(corresponding to the index)
is replaced by a new request
object whose status is
“Approved.”
We do the same (but
in reverse) when
rejecting a request.
-- 157 of 306 --
138 	C HAPTER 6 Signals: A new approach to reactive programming
}) : item);
});
}
deleteRequest(request: TimeOffRequest) {
this.requests.update((requests) =>
requests.filter((r) => r.id !== request.id)
);
}
}
Now we have ourselves a workable component with basic functionality, and if we run
this component, we will see how all of the UI gets updated when we click the buttons.
However, there is more that we want to do with this component. For instance, we want
to be able to search through requests by type, for example, and we also want to display
some text that shows how many pending requests are left, so an HR admin can track
their progress when reviewing multiple requests. Of course, those functionalities are
dependent on the time-off request items and should be derived from that signal. Let
us now see how it can be done.
6.4 	Computed signals
With RxJS, we covered how observables are immutable and we can only create new
observables from existing ones. With signals, we saw that they are mutable, but we
haven’t yet approached the topic of creating new signals from existing ones; so far, we
only created new signals manually from scratch. However, as we saw, it is very import-
ant to be able to derive new values from existing signals that will be updated as soon as
the source signal changes its value. With RxJS, we did it with a multitude of operators,
mainly the map operator. With signals, it is far easier, as we do this just using a single,
quite straightforward function called computed. Signals created with this function are
called computed signals. Let’s dive in and see how it works and how it improves our
code readability and the flow of data across applications.
6.4.1 	Creating computed signals
As mentioned, computed signals are created via the computed function. The function
is very simple; it takes a callback, which has no arguments; and the value that this call-
back returns becomes the value of the resulting signal. Then the computed function
returns that signal, which can be then used to read its value. Let us see it in action:
const count = signal(0);
const increment = () => count.update(value => value + 1);
const doubleCount = computed(() => count() * 2);
console.log(count());
console.log(doubleCount());
increment();
console.log(count());
console.log(doubleCount());
When deleting a request, we can use
the update method and just filter
out the request with a particular id.
-- 158 of 306 --
139	6.4 	Computed signals
The count signal we are already familiar with and also with the increment function.
Now what is new is the computed signal called doubleCount, which is defined as the
value of the count signal times 2. This code will output 0, 0, 1, 2 in the console
wh

---

## Other methods in the

component are also omitted.
-- 161 of 306 --
142 	C HAPTER 6 Signals: A new approach to reactive programming
cannot do this in v16 because [(ngModel)]="something" is actually syntactic sugar, a
shorthand syntax equivalent to [ngModel]="something" (ngModelChange)="something
= $event". However, with signals, we cannot just assign values to them and instead
need to call the set method, which is why we have to spell the logic out explicitly. In
Angular v17.3, this familiar way of binding signals to ngModel has been added, and we
can use it as we always did, but as of Angular v16, there is no signal NgModel way of
doing this, so, for now, we are going to use this syntax and will discuss the new
approach in chapter 10.
Second, we used the $any helper function, which in Angular templates type-casts a
value to type any. We do this because, while we explicitly stated all possible values of
selectedType (which was narrower than just string), the $event here could be any
string (from TypeScript’s perspective), so we cast it to type any to let TypeScript
know we understand what we are doing.
Now we have a signal that will update when the user changes the type from the
dropdown. Finally, we need a computed signal, which will calculate the filtered users
based on the selected type:
filteredRequests = computed(() => {
const type = this.selectedType();
return this.requests().filter(r => (type ? r.type === type : true));
});
Now we just check if some specific type is selected and return an array filtered based
on that. In the template, we can replace requests() (which represent all the requests,
without any filters) with the new filteredRequests computed signal:
<tr *ngFor="let request of filteredRequests()">
This will work the same way as with manually created signals. We can also compute
new signals using other computed signals. For instance, the resolvedRequests signals
can be modified to show the proportion of resolved requests among the ones filtered,
as opposed to the total number of signals:
resolvedRequests = computed(() =>
this.filteredRequests().filter((r) => r.status !== 'Pending')
);
Here the filteredRequests is treated like any other signal, so it is irrelevant whether
it is computed or created manually.
Now that we have learned performing complex operations with signals, let us set
up some basic rules and best practices:
 Always use computed signals instead of getter methods or functions for deriving
new values.
 Do not write to signals in a computed callback, meaning do not ever call another
signal’s set or update methods in that callback.
-- 162 of 306 --
143	6.5 	Effects
 Try to refer only to properties that themselves are signals in the computed call-
back unless absolutely necessary. While using nonsignal properties in a com-
puted callback can sometimes be unavoidable, most commonly it is a code
smell and can be a sign of deeper problems with the component’s structure.
Let us move on and discuss executing side effects based on changes to si

---

## Stops the effect from running using

the reference and the destroy method
-- 165 of 306 --
146 	C HAPTER 6 Signals: A new approach to reactive programming
But it is important to remember that this is a very rare case. In most scenarios, what
this means is that one signal is dependent on another one, meaning it probably can
be derived from it using a computed signal instead of an effect.
Next let us talk about why we should, for the most part, avoid using effects too
much and how to recognize scenarios where effects are really necessary.
6.5.3 	When to use effects
As the name “side effect” suggests, effects are most useful in scenarios where we want
to perform something that is out of the usual flow of a component. To better under-
stand this, let’s remember figure 5.1 from the previous chapter, which illustrated the
life cycle of the component. It postulates that the UI is rendered based on the compo-
nent’s state; then the UI sends events to the component, which in turn updates the
state, which again updates the UI, and so on. Thus, everything that falls out of this
nice circle can be considered a side effect. Let’s explore some examples.
WRITING TO EXTERNAL STORAGE
We already covered this example when we created an effect that stored a signal’s value
in localStorage. So local storage, session storage, cookies, indexed DB, and so on are
part of neither the UI nor the component’s state; thus we should use effects when
interacting with them.
CALLING THIRD- PARTY API S
We know that it is very common to work with reactive forms in Angular applications.
Reactive forms work as a wrapper around form values, and we use methods like
FormControl.setValue or FormControl.disable to handle the behaviors of our con-
trols. There can be scenarios when we need to, for example, disable a FormControl
based on a value from some signal. We cannot express this logic via a computed signal;
thus we have to employ effects to handle such functionality. Any other third-party API
that requires such interactions will be considered a side effect.
P ERFORMING UI UPDATES THAT CANNOT BE EXPRESSED VIA A NGULAR ’S TEMPLATE SYNTAX
The template syntax in Angular is very powerful and versatile, but there are still cases
where it is not enough to perform some operations. For instance, we might want to set
a dynamic title on the browser tab, and the only way to achieve this with Angular is by
using the Title injectable. If we want to set the title based on some signal, we would
need an effect.
export class SomeComponent {
name = signal('Tab name');
title = inject(Title);
constructor() {
effect(() => {
this.title.setTitle(this.name());
Listing 6.9 	Setting a tab title from a signal using an effect
-- 166 of 306 --
147	6.6 	RxJS and signals interoperability
});
}
}
Any other DOM-related operation like this, when depending on signal values, should
be implemented via an effect.
WORKING WITH CANVAS
Canvas provides a huge API to draw completely custom things outside of the usual
flow of the DOM. We might be employing a third-

---

## Rest of the component code

omitted for the sake of brevity
-- 168 of 306 --
149	6.6 	RxJS and signals interoperability
Because of this, we cannot just go assigning signals derived from observables to
properties wherever we like. For instance, we could modify the deleteRequest method
to update the requests array via an HTTP call:
deleteRequest(request: TimeOffRequest) {
this.requests = toSignal(
this.timeOffRequestService
.deleteRequest(request.id)
.pipe(switchMap(() => this.timeOffRequestService.getRequests())),
{ initialValue: this.requests(), injector: this.injector }
);
}
While this seems right, in reality it will cause all of our computed signals to break, as
we are reassigning the existing requests property to a brand-new signal derived
from another HTTP call observable. To avoid such scenarios, we need to build our
HTTP calls in a manner that will make the observable emit again (instead of com-
pleting after the response arrives) so that the signals derived from them update and
show fresh data right away. Behavior like this already exists in state management sys-
tems that are based on observables, like NgRx, but in plain old Angular this does
not work out of the box and needs to be implemented manually. However, this
requires significant rethinking of our approaches and an architectural shift; thus,
we will cover this topic in intricate detail in the next chapter, when we dive deep
into how signals work and how we should build application architecture around
them. For now, let’s move on and see the reverse scenario: creating new observables
from existing signals.
6.6.2 	Converting signals to observables
While the previous approach is very popular, converting signals to observables is a bit
less common as a development task. However, there are scenarios when this can be
necessary. For instance, we might have a combined stream created from multiple
observables and want to add another source only to discover that source is a signal,
not an observable. In such a scenario, it would make more sense to convert that signal
to an observable and just combine it with the rest of them, rather than convert the
other stream to a signal and use computed or effect.
With the rxjs-interop package, another function is available to us to perform such
a conversion: the toObservable function. This function operates as the reverse of the
toSignal function, taking a signal as an argument and producing an observable that
emits each new value of the source signal. The following is a basic example:
export class SomeComponent {
count = signal(0);
count$ = toObservable(this.count);
constructor() {
this.count$.subscribe(console.log);
-- 169 of 306 --
150 	C HAPTER 6 Signals: A new approach to reactive programming
setInterval(() => this.count.update(value => value + 1), 1_000);
}
}
Here count$ is an observable derived from the count signal. As the count signal is
incremented by 1 each second, the output in the console will be 0, 1, 2,. . . and so on
every second. Note that toObservable works simi

---

## Summary

 RxJS is very powerful but is not fully compatible to solving all reactive program-
ming tasks in Angular and comes with its own problems.
 The Angular core team proposed a new reactive primitive called a signal, which
can be used to handle reactivity in Angular applications without RxJS observables.
 Signals are simple wrappers around values that notify other subscribers about
their value updates.
 Signal values can be changed via Angular’s set and update methods.
 New signals can be derived from existing ones using the computed functions;
these new signals will be completely dependent on their source signals and won’t
be available for manual update.
 We can also register side effects as a callback that will be executed when signals
in the callback change
 In both cases, Angular will automatically track dependencies and dispose of the
subscriptions on the component’s destruction.
 Signals fully interoperate with RxJS, allowing the conversion of observables to
signals and vice versa.
-- 171 of 306 --
152
Signals: A deep dive
In the previous chapter, we learned about the basics of working with signals: how to
create them, change their value, derive new signals from existing ones, and make
them work with RxJS observables. Now, as advertised in the title of this chapter, we
will take a deep dive into the world of signals and learn about advanced options, best
practices, and ways to migrate existing applications to use signals. Let’s get started!
7.1 	Advanced options when dealing with signals
So far, we have learned that signals are wrappers around values, which also notify us
about the changes to those values. The process is pretty straightforward, accomplished

---

## This chapter covers

 Signal value equality and advanced manual
cleanup of effects
 The internal workings of signals
 State management across components
using signals
 Caveats of using signals with RxJS
 Migrating to signals
 The future of signals
-- 172 of 306 --
153	7.1 	Advanced options when dealing with signals
via either the computed or effect functions. However, the default logic behind
those computations is sometimes not enough to describe some complex processes
and requires modification. Let’s learn about those options and when we might want
to use them.
7.1.1 	Signal equality
In the previous chapter in section 6.4.1, we talked about computed signals and defined
them as signals derived from other signals, which get re-evaluated whenever the original
signal’s value changes. One question we did not ask is: what constitutes a change to the
signal’s value? While the question indeed sounds superficial, in reality, it can get quite
complex from time to time. Let’s consider the code in the following listing.
@Component({
selector: 'some-component,
standalone: true,
template: `
Full Name: {{ fullName() }}
<button (click)="changeUser()">Change User</button>
`,
})
export class SomeComponent {
user = signal({
id: 1,
firstName: 'Jon',
lastName: 'Snow',
age: 20,
})
fullName = computed(() => {
console.log('Re-evaluating');
return `${this.user().firstName} ${this.user().lastName}`;
});
changeUser() {
this.user.update(value => ({
...value,
age: 20,
}));
}
}
If we run this component, we can notice that the Re-evaluating text appears in the
console every time we click the button, despite the fact that we did not really change
anything in the original object, let alone the first or last names. This happens because
update, for instance, will set a new value onto an object and just propagate a notifica-
tion to all computed signals derived from the source.
In this case, the update method does in fact check for equality between the previous
and current value, but in the case of objects, it just uses referential equality; that is, if
Listing 7.1 	Signal re-evaluating a value without an actual change

---

## Uses a computed

signal in the
template 	The button will
change the signal’s
value when clicked.
A signal of an
object

---

## Notice we do not actually change

the value; this again sets the age
property’s value as 20.
-- 173 of 306 --
154 	C HAPTER 7 Signals: A deep dive
we provide a new object, even if data inside matches the original 100%, it will treat it
like a completely new one and propagate the changes.
So what do we do about this problem? It turns out Angular has us covered here: we
can provide an equality-checking function when creating new signals! For instance, we
might decide that a user is “changed” when its id property is mutated (a simplistic
approach but could work in some cases in real life). Let’s change our code a little so
we get it working in the most efficient manner.
export class SomeComponent {
user = signal({
id: 1,
firstName: 'Jon',
lastName: 'Snow',
age: 20,
}, {
equal: (previous, current) => {
return previous.id === current.id;
}
})
fullName = computed(() => {
console.log('Re-evaluating');
return `${this.user().firstName} ${this.user().lastName}`;
});
changeUser() {
this.user.update(value => ({
...value,
age: 20,
}));
}
}
Now if we run the code, the Re-evaluated text will appear only once in the console:
the very first time when the computed full name signal is evaluated.
This same logic can be applied to computed signals themselves, in case we are
deriving new computed signals from them in turn somewhere down the line. So when
we create new signals, we can define an equality comparison function to make sure we
don’t run costly computations too often. Next, let’s optimize even further by ensuring
computed signals only re-evaluate in the event of some of their dependency updates
(only the important ones) instead of all the signals inside of the callback.
7.1.2 	Untracking dependencies
In the previous chapter, we established that callbacks for computed and effect func-
tions will be re-executed when one of the signals read inside them changes its value.
This is great in and of itself, because we want the freshest available value, and this does
the job without any friction. However, there are scenarios where we want to execute
Listing 7.2 	Using equality comparison for signals

---

## The function will check if id is the same

for the new and previous values to
determine if the object has changed.
-- 174 of 306 --
155	7.1 	Advanced options when dealing with signals
the callback only when some of the signals have changed but not all of them. Let’s con-
sider the code in the following listing.
export class App {
user = signal({
id: 1,
firstName: 'Jon',
lastName: 'Snow',
age: 20,
});
dateTime = toSignal(interval(900).pipe(map(() => new Date())),
{initialValue: new Date()});
fullName = computed(() => {
const {firstName, lastName} = this.user();
return `${firstName} ${lastName}, last modified at
${this.dateTime().toString()}`;
});
changeUser() {
this.user.update(value => ({
...value,
age: 20,
}));
}
}
Now we use the dateTime signal to show when the computed fullName signal was last
updated, but we run into a problem: the “last updated” in the UI will show the current
date and time to the current second. This is because this new computed signal also
tracks (listens to) the changes on the dateTime signal, which in turn changes about
every second. So how do we explain to Angular that we only care about the changes on
the user signal and dateTime is only complimentary to it? It turns out that Angular has a
tool for this, called the untracked function. Here is how we can use it in our scenario:
fullName = computed(() => {
const {firstName, lastName} = this.user();
const dateTime = untracked(this.dateTime);
return `${firstName} ${lastName}, last modified at
${dateTime.toString()}`;
});
The untracked function will take a signal (important note: a signal, and not its value)
and return its value without tracking it as a dependency for the derived computed sig-
nal. Now if we run the code, every time we actually change the user object, the com-
puted signal will show the very “last modified time,” but it won’t change otherwise
even though the dateTime signal does in fact notify about its new values.
This function is especially useful in effects, where we might want to run entire
pieces of logic that interact with some signals, but only when a very specific signal
notifies. For instance, we might have a complex form that runs a significant risk of
Listing 7.3 	Computed signal updated each second by an interval

---

## Uses the date signal to show

when the user was last
updated
-- 175 of 306 --
156 	C HAPTER 7 Signals: A deep dive
users losing their progress if they spend too much time on it—for example, due to a
timeout; in this case, we want to run an effect that will automatically save the progress
every few minutes. However, because saving requires reading from the form signal, it
will mean that the effect will also run whenever the user changes the values of the
input fields, and we do not want that many re-executions. We can easily do this by pro-
viding a callback function to the untracked function, and whatever signals are read in
the callback will remain untracked:
constructor() {
effect(() => {
const dateTime = this.dateTime();
untracked(() => {
const formValues = this.form();
localStorage.setItem('formValues', JSON.stringify(formValues));
alert(`Your progress has been saved at ${dateTime}`)
});
});
}
As we can see, we can now run entire functions in an untracked environment, making
them independent from the effect in which they have been invoked. It is also a good
practice to wrap any calls to other functions in untracked, because they might possibly
read other signals in the future if someone changes them, causing hard-to-find bugs.
Finally, let us learn about the last advanced option signals have: the ability to manually
clean up effects or signals derived from observables.
7.1.3 	Manual cleanup
In section 6.5.2, we mentioned that we can manually end an effect cycle by storing it in a
class property and calling EffectRef.destroy(). This could be useful if we want to ter-
minate an effect way before the component that initiated it gets destroyed. However,
there is a caveat: what if we invoke some asynchronous logic inside this effect—for
example, something like a setTimeout? For example, let’s modify the logic of our previ-
ous example. Now, instead of saving every 3 minutes, we will react to the change of the
form, wait for a minute, and save it to localStorage. However, this effect will be can-
celed if the user clicks the Save button and outright saves their progress to the database.
Let’s see how this looks in the following listing.
constructor() {
effect(() => {
const formValues = this.form();
setTimeout(() => {
localStorage.setItem('formValues', JSON.stringify(formValues));
Listing 7.4 	Using untracked callbacks in effects
Listing 7.5 	Invoking asynchronous logic in effects
Reads the dateTime signal,
which notifies every 3 minutes,
so we know when to save
Runs our saving/alerting logic
in an untracked callback so
that we do not save to
localStorage every time the
form is updated but instead
only every 3 minutes
-- 176 of 306 --
157	7.1 	Advanced options when dealing with signals
}, 1_000);
})
}
In this case, we would run into another problem: when the user clicks “Save” and the
effect is destroyed, the callback will be executed one last time. While in this scenario
we may think “Not a big deal!”, in general, such cases can cause really hard-to-find and
hard-to-fix bugs. A

---

## Clears the

localStorage
-- 177 of 306 --
158 	C HAPTER 7 Signals: A deep dive
or bugs. A slightly more common scenario is wanting to terminate a signal created
from an observable before the component is destroyed. Again, the toSignal function
also accepts a manualCleanup option.
Note that both of these scenarios are extremely uncommon and might potentially
indicate a problem within the structure of the code itself. For this reason, we do not
provide a practical example here, as such use cases will arise from implementation
details of a particular feature, rather than from business requirements. If we find our-
selves in a situation where we want to use these options, the best course of action
would be to first reconsider the code itself that resulted in such a necessity and do our
best to avoid it. Next, let’s discuss two other advanced options that signals in Angular
provide before we move on to more in-depth knowledge.
7.1.4 	Readonly signals and synchronizing with RxJS
Right at the very beginning of our journey into signals, we learned about the differ-
ence between a Signal and a WritableSignal—namely that the former cannot be
modified, while the latter can. Sometimes we have a WritableSignal somewhere, usu-
ally in a service, which we want to be able to modify inside that class but not from the
outside; from the outside world (for example, a component that injects this service),
we want to be able to read only that signal’s value. This can be easily achieved via
exporting it as a readonly signal:
@Injectable({providedIn: 'root'})
export class SomeService {
readonly #data = signal<Data>({});
readonly data = this.#data.asReadonly();
}
NOTE 	Calling the asReadonly method on a WritableSignal will return a sig-
nal, which will always have the same value as the original WritableSignal but
can’t be modified. In the case of this service, internally we will use #data to be
able to modify the value, but other services or components will be able to read
only the value, never to modify. This might seem like something very specific,
but further in this chapter we will see how we can use it to our benefit when
building component interconnections with signals.
One final thing left to discuss is requiring observables to be synchronous when we
derive signals from them. In the previous chapter, we mentioned that if we do not pro-
vide an initial value to a signal created using the toSignal function, this signal can
probably be undefined, so we have to either provide a default value or check the value
every time we read it. This happens because observables can be asynchronous and not
have a value at the moment of this signal’s creation. However, if we are sure that the
observable is synchronous, we can use the requireSync option, which will immedi-
ately use the first synchronous value of the observable as the initial value of the signal:
someSignal = toSignal(of(1, 2, 3), {requireSync: true});
-- 178 of 306 --
159	7.2 	Signals under the hood
In this case, the type of th

---

## The callback is not executed until the computed signal is

read for the first time.
Figure 7.1 	Life cycle of a computed signal
-- 181 of 306 --
162 	C HAPTER 7 Signals: A deep dive
To conceptualize this, we have to have a very minimal understanding of the change
detection mechanism in Angular. In chapter 10 we will explore it in more depth, but
here it is sufficient to say that Angular runs a special algorithm to detect any changes
in components’ states (for instance, some property used to be equal to 6 and now it is
equal to 7) and then calls the special refreshView method to propagate those
changes to the UI (this is how Angular “magically” updates the UI when we change
component properties).
This change detection runs once when the component is created and then multi-
ple times throughout the component’s lifetime, usually on some asynchronous events,
until the component is destroyed and removed from the DOM. Figure 7.2 shows how
Angular effects are very closely bound to the change detection mechanism.
As we can see, the re-execution of effects, as opposed to computed signals, is closely
tied to the change detection mechanism. This means that the following code will pro-
duce only the latest value:
export class SomeComponent {
counter = signal(0);
An effect is registered.
The effect callback is executed for the first time.
Meanwhile, updates to the effect dependencies
arrive, possibly multiple times.
At some point, change detection runs again
and calls refreshView.
The effect callback is re-executed with the
latest values of dependencies.
Finally, the effect is destroyed either
manually or automatically.

---

## The effect now waits for future updates

and change detection.
The component is change-detected for the
first time.
Figure 7.2 	Life cycle of an effect
-- 182 of 306 --
163	7.3 	State management with signals
constructor() {
effect(() => {
console.log(`Value is ${this.counter()}`);
});
}
update() {
this.counter.set(7);
this.counter.set(11);
this.counter.set(20);
}
}
This code will log Value is 0 and then log Value is 20 when the update method is
called. This means we should be careful with multiple updates to a given signal in the
same method (unless another update is scheduled asynchronously—for example, via
setTimeout), as from Angular’s perspective this will not make much sense.
Now that we’ve covered the deep corners of signals, it is time to expand our
practice with them and build a custom state management approach using them.
Let’s dive in.
7.3 	State management with signals
So far, we have only used signals in the context of a single component. However, the
fact that signals are capable of notifying us of their updates lends us a powerful oppor-
tunity to build functionality that extends beyond a single component and allows us to
manage data that is related to multiple parts of our application. This practice of shar-
ing data and handling a global state of things in a frontend application is usually
referred to as state management. While there are multiple state management libraries
(some of which, like NgRx, we have already mentioned), for most of them, based on
RxJS, with signals, we can create lightweight state management solutions best tailored
to our application’s needs. Let’s build one!
7.3.1 	State management: The task
In the previous chapter, we introduced a page into our HRMS application that actu-
ally does handle some employee-related jobs—in this instance, time-off manage-
ment. In that scenario, an human resources employee will see lists of time-off
requests and handle them on a case-by-case basis. However, it would be useful if
employees in general receive notifications about tasks they have at hand. Of course,
one type of such notifications would be the time-off requests, but users will receive
other notifications too—for instance, their colleagues’ birthday reminders, applica-
tion maintenance notices, and more. Let’s make some ground rules for our notifica-
tions system:
 Notifications can be used in multiple components of our application; for exam-
ple, in the header we will see the list of all notifications with a counter, and in
the sidebar we could see the list of notifications regarding certain features of
-- 183 of 306 --
164 	C HAPTER 7 Signals: A deep dive
our app (like a counter of time-off related notification on the sidebar link that
navigates to the time-off management page).
 Notifications are real time, pushed from a server via a web socket connection.
We are not going to implement that particular functionality explicitly, as it is
out of the scope of this chapter, but we will assume a special SocketService that
handles that functionality and expos

---

## The list of notifications is

hydrated from localStorage.
Only a read-only
version of the
notifications signal
is exposed to
components to use.

---

## Methods to modify

signals without explicitly
changing them
-- 185 of 306 --
166 	C HAPTER 7 Signals: A deep dive
the notifications in a dialog when the “bell” button is clicked. In src/app/shared/
components, let us add a new file named header.component.ts and put in the code in
the following listing.
@Component({
selector: 'app-header',
template: `
<header>
<h2>HRMS</h2>
<button
(click)="notificationsOpen.set(true)"
title="View Notifications">
You have {{ unreadNotifications.length }} unread notifications
</button>
</header>
<dialog [open]="notificationsOpen()">
<h3>Notifications</h3>
<ul>
<li *ngFor="let notification of notifications()">
<h4>{{ notification.title }}</h4>
<span>{{ notification.message }}</span>
<button
*ngIf="!notification.read"
(click)="markAsRead(notification)"
>
Mark as Read
</button>
</li>
</ul>
<button (click)="notificationsOpen.set(false)">Close</button>
</dialog>
`,
standalone: true,
imports: [NgFor, NgIf],
})
export class HeaderComponent {
private readonly notificationService = inject(NotificationService);
notifications = this.notificationService.notifications;
unreadNotifications = this.notificationService.unreadNotifications;
notificationsOpen = signal(false);
markAsRead(notification: Notification) {
this.notificationService.markAsRead(notification);
}
}
In this scenario, the HeaderComponent is fully bound with the live data of the notifica-
tions, as in, if we update the notifications from somewhere, the result will immediately be
Listing 7.9 	Header component using signal-based state management
Uses a local signal to open/
close the notifications dialog

---

## Uses a signal from

the notification
service to show
the list of
notifications
If the notification is unread,
we can mark it as read, so
the counter will update.

---

## Extracts

the full list of
notifications and
the list of unread
notifications to
display in the UI
Updates a notification’s
read/unread status
-- 186 of 306 --
167	7.3 	State management with signals
visible in the HeaderComponent. Also, we can notice a local signal, notificationsOpen,
living in harmony with a signal extracted from another service. From the perspective
of the component, there is no difference between those two signals.
One important question that we might want to ask is: when are the signals from
the service created? In the case of the local signal, it is fairly obvious: we put it in the
constructor; that means whenever the component is created, its signals will be created
too. In the case of the service, it is the same, but what is missing for us is when the ser-
vice itself will be instantiated. We marked the service as providedIn: 'root', so this
means it will be created the first time the service is injected in a component that is
used somewhere in the UI. If we put the HeaderComponent in the AppComponent
(which makes sense, as the header might contain navigation that we want to be visible
on all pages), it will be created at the inception of the application itself.
However, this is not something that we would always want. In some scenarios, it
makes sense to move the creation of those signals somewhere down the application
structure. For example, the time-off request management feature we built in the previ-
ous chapter may need to have its own state management service (to share data only
between its own components and not the whole application). In this case, we may pro-
vide a hypothetical TimeOffManagementService in the providers of the time-off man-
agement feature’s routes, with the technique described in section 2.4.4, illustrated in
detail in listing 2.15.
Now let’s figure out how to make this connected to a socket service and what
problems could arise when we try to interoperate signals with RxJS observables “a
bit too much.”
7.3.3 	State management: The problems
In section 7.3.1, we mentioned that we are going to assume a service that handles the
web socket connection and not actually implement it. This service will expose several
observables that we can use to handle different socket connections. We will work with
the one related to notifications.
In listing 7.7, we created the service for notifications and read the notifications just
from localStorage. To make them real-time, we can use this socket service and derive
the data for notifications from the observable it exposes. We can simply use the
toSignal function to convert that observable to a signal, which we will then use (let’s
forget about the localStorage thing for now).
export class NotificationService {
private readonly socketService = inject(SocketService);
#notifications = toSignal(this.socketService.notifications$,
{requireSync: true});
}
Listing 7.10 	Using toSignal in a service

---

## Uses the observable as the source

for our notifications signal	Rest of the service’s code
omitted for brevity
-- 187 of 306 --
168 	C HAPTER 7 Signals: A deep dive
For now, this will work; however, such an approach can pose certain problems in the
long run. First, the toSignal will subscribe to the observable (remember: subscribing
is the only way of reading values from observables), which in turn might cause side
effects; for example, in our scenario, a web socket might be created as soon as we sub-
scribe to this observable.
Presently this is not a big deal (we want to receive notifications via the web socket
anyway). However, even if all the components that use notifications are destroyed, the
subscription will continue to be active. This means the web socket will continue to be
open, which will mean unnecessary load on both the user’s device (for mobile devices
this might mean a faster-draining battery) and the server (for maintainers it might
mean higher monthly costs).
Another concern is that we can never manually terminate this subscription. We can,
of course, expose the reference to the notifications signal (instead of it being private)
and mark it as manualCleanup: true, but even in this case, because multiple compo-
nents might be using it, there will be no way to truly tell when it is safe to terminate the
connection. The only way would be if every component set up its own subscription,
which would then be disposed of when it is destroyed, and when the last component
using this subscription is gone, the connection will be closed. How can we achieve this?
Let’s rework our NotificationService and add a method that does exactly this.
@Injectable({providedIn: 'root'})
export class NotificationService {
private readonly socketService = inject(
SocketService,
);
#notifications = signal<Notification[]>(
localStorage.getItem('notifications') ?
JSON.parse(localStorage.getItem('notifications')) : [],
);
notifications = this.#notifications.asReadonly();
readNotifications = computed(
() => this.#notifications().filter(
n => n.read,
),
);
unreadNotifications = computed(
() => this.#notifications().filter(
n => !n.read,
),
);
constructor() {
effect(() => {
localStorage.setItem('notifications',
JSON.stringify(this.#notifications()));
})
}
Listing 7.11 	Manually connecting a signal to an observable

---

## The notifications are

initially read from
localStorage; no direct
connection to the
socket/Observable here.
-- 188 of 306 --
169	7.3 	State management with signals
connect() {
return this.socketService.notifications$.pipe(
takeUntilDestroyed(),
).subscribe(notifications => {
this.#notifications.set(notifications);
});
}
addNotification(notification: Notification) {
this.#notifications.update(value => [...value, notification]);
}
markAsRead(notification: Notification) {
this.#notifications.update(
value => value.map(
n => n.id === notification.id ? {
...n,
read: true,
} : n),
);
}
markAllAsRead() {
this.#notifications.update(
value => value.map(
n => ({...n, read: true}),
),
);
}
}
We might notice that while we define the connect method, we never call it inside the
NotificationService itself. This is done on purpose, as we want consumers to man-
ually set up the subscription if they need to listen to notifications. This way, they
will be required to call the connect method in the constructor (otherwise the
takeUntilDestroyed operator will throw an error, as we purposefully did not provide
a DestroyRef), and then they will be able to store the subscription in a component
property (in case they want to unsubscribe manually), and finally when that compo-
nent is destroyed, this subscription will be automatically disposed of, resulting in the
exact scenario we wanted to achieve.
We could also store all the subscriptions in an array and add a method to manu-
ally terminate them all, but this is out of the scope of this chapter. In addition, the
notifications$ observable should be set up in a way that it shares the subscription
between multiple consumers (so new components subscribing to notifications does
not result in multiple web sockets being opened), but this is deep RxJS functionality
and is again out of the scope of this chapter, so we will not implement it here.
Finally, what is left here is to call the connect method in a component that uses
notifications; for instance, we can slightly modify our HeaderComponent.

---

## Manually sets the value of

the notifications as they
arrive via the websocket
-- 189 of 306 --
170 	C HAPTER 7 Signals: A deep dive
export class HeaderComponent {
private readonly notificationService = inject(
NotificationService,
);
notifications = this.notificationService.notifications;
unreadNotifications = this.notificationService.unreadNotifications;
notificationsOpen = signal(false);
markAsRead(notification: Notification) {
this.notificationService.markAsRead(notification);
}
constructor() {
this.notificationService.connect();
}
}
Now with all this complex knowledge in place, we are ready to fix one last outstand-
ing problem. In section 6.6.1, we discussed converting observables to signals and
used that in our TimeOffManagementComponent to make HTTP calls but with a prob-
lematic solution that included passing down an injector reference and reassigning
the signal itself (instead of its internal value). Let us now refactor that part with a
state management solution based on interoperability between signals and RxJS.
7.3.4 	Advanced interoperability with RxJS
Now we are going to build a state management service for time-off requests, which will
host the entire data related to time-off requests, and all their behavior, and make that
data flow only one way. This approach will have several benefits:
 Data can be easily shared with other components. For instance, we might have a
page for non-human resources employees where they can view their own time-
off requests, and that page can easily reuse this service.
 We can handle all asynchronous tasks inside this service.
 The components using this functionality will become incredibly simple. In the
next chapter we are going to talk about unit testing, and having simple compo-
nents is one of the best ways to make writing unit tests a pleasing activity.
Now let us take a look at this new state management service. It will use RxJS subjects to
represent events of deleting, rejecting, and approving a time-off request.
@Injectable({ providedIn: 'root' })
export class TimeOffManagementService {
private readonly timeOffRequestService = inject(TimeOffRequestService);
Listing 7.12 	connect method for signal/observable interop
Listing 7.13 	State management with advanced RxJS interoperability

---

## We just need to call

connect from the
constructor, and that is it.
-- 190 of 306 --
171	7.3 	State management with signals
deleteRequest$ = new Subject<TimeOffRequest>();
approveRequest$ = new Subject<TimeOffRequest>();
rejectRequest$ = new Subject<TimeOffRequest>();
selectedType = signal<
'Vacation' | 'Sick Leave' | 	'Maternity Leave' | 'Paternity Leave' |
'Other' | ''
>((localStorage.getItem('selectedType') as any) ??
'');
requests = toSignal(
merge(
toObservable(this.selectedType),
this.deleteRequest$.pipe(switchMap((r) =>
this.timeOffRequestService.deleteRequest(r.id))),
this.approveRequest$.pipe(switchMap((r) =>
this.timeOffRequestService.approveRequest(r.id))),
this.rejectRequest$.pipe(switchMap((r) =>
this.timeOffRequestService.rejectRequest(r.id))),
).pipe(
switchMap(() => {
return this.timeOffRequestService
.getRequestsByType(
this.selectedType(),
);
})
),
{
initialValue: [] as TimeOffRequest[],
}
);
resolvedRequests = computed(() =>
this.requests().filter((r) => r.status !== 'Pending')
);
constructor() {
effect(() => {
localStorage.setItem('selectedType', this.selectedType());
});
}
approveRequest(request: TimeOffRequest) {
this.approveRequest$.next(request);
}

---

## The merge function

is used to combine
all the events into
one (we do not care
about the nature of
the event here, only
that it happened).

---

## Regardless of

what the source
observables did,
when they are
finished, we will
refresh the data
on the page.

---

## The effect that stores the selected type

in localStorage is also moved here.
Now approving (rejecting,
deleting) a request is only a
matter of triggering an event
via the corresponding subject.
-- 191 of 306 --
172 	C HAPTER 7 Signals: A deep dive
rejectRequest(request: TimeOffRequest) {
this.rejectRequest$.next(request);
}
deleteRequest(request: TimeOffRequest) {
this.deleteRequest$.next(request);
}
}
This might seem a bit intimidating; however, at a second look, this actually encapsu-
lates the behavior we want to describe quite well. All we care about is the time-off
requests, and the very definition of the requests signal fully describes what that array
of requests is, what it is derived from, and what it can change. This also beautifully
explains the difference in signals and observables. Signals are a reactive state, and
observables are streams of events we can react to. Here, “the user decided to approve
a time-off request” is an event, and the requests signal is an array of time-off requests
that will react to that event; hence the first is an observable, and the latter is a signal
derived from that observable.
Now all that is left to do is modify the TimeOffManagementComponent and just use
this state management service. This will make our component super simple, and we
don’t even have to change the template!
export class TimeOffManagementComponent {
private readonly timeOffsService = inject(TimeOffManagementService);
requests = this.timeOffsService.requests;
resolvedRequests = this.timeOffsService.resolvedRequests;
selectedType = this.timeOffsService.selectedType;
approveRequest(request: TimeOffRequest) {
this.timeOffsService.approveRequest(request);
}
rejectRequest(request: TimeOffRequest) {
this.timeOffsService.rejectRequest(request);
}
deleteRequest(request: TimeOffRequest) {
this.timeOffsService.deleteRequest(request);
}
}
Here we do not even have that much to comment about: we just inject the state man-
agement service, assign the signal from there to some local properties to use in the
template, and define wrapper methods that delegate the functionality back to the ser-
vice. This component is short, very easy to explain and understand, and, as we will see
in the next chapter, extremely easy to test.
Listing 7.14 	State management with signals used in a component
-- 192 of 306 --
173	7.4 	Migrating to signals
As we covered essentially everything we currently need to know about signals quite
in depth, we can now explore the migration of existing applications towards using sig-
nals as their basic building block.
7.4 	Migrating to signals
Before we begin, let’s first briefly discuss how Angular applications handled reactivity
previously. Of course, RxJS was the only available solution for this kind of problem;
however, RxJS is not required by the Angular team (unless dealing with things that nat-
urally are observables, like HTTP requests), meaning that we have roughly two types
of Angular apps: the ones that already extensively use RxJS for reactivity and the ones
that do 

---

## Summary

 Signals have a multitude of customization options.
 We can change the logic of signal equality checking to prevent unnecessary
costly computations.
 We can untrack dependencies from computed signals and effects if we don’t
want to run updates on their changes.
 Effect and computed signal callbacks run in fundamentally different ways.
-- 196 of 306 --
177	Summary
 Computed signals are lazy before first read and then run on every new arriv-
ing update.
 Effects run eagerly, are tied in with Angular’s change detection, and will run
whenever Angular refreshes the UI.
 State management solutions can be built using signals.
 Converting observables to signals in services can have significant effects on
application performance, which can be mitigating by delegating the subscrip-
tion logic to consumer components.
 Existing RxJS-heavy Angular applications can be converted to use signals in rel-
atively easy steps.
-- 197 of 306 --
178

---

## Unit testing in

modern Angular
In previous chapters, we learned about all the modern code-level tools that Angular
now provides out of the box to make developing large frontend applications as
seamless as possible. All of those tools were confined to the code that we write itself,
helping to solve business requirement-related problems. But what about building
our applications, developer experience, deployment, search engine optimizations,
and so on? Now it is time to explore all of these topics. However, before we can
actually deploy our beautiful HRMS application, we need to ensure it works prop-
erly and is reasonably maintainable (as in “will not break easily when developers
add new changes”). And this is precisely what this chapter is about: unit testing.

---

## This chapter covers

 What unit tests are and how they work in Angular
 Setting up a unit testing environment
 Writing unit tests for Angular building blocks
 Unit testing classes that use the inject function
 Unit testing signals
 Third-party tools that facilitate unit testing of

---

## Angular applications

 AI tools to assist with unit testing
-- 198 of 306 --
179	8.1 	Unit testing: The what and the why
8.1 	Unit testing: The what and the why
Before we begin, let’s briefly discuss unit testing in more general terms, the reasons we
need it, and how to achieve it.
8.1.1 	Prerequisites
In chapter 1, we laid out some requirements for the reader, which included general
knowledge of Angular and its building blocks, basic knowledge of RxJS, and so on.
However, you might have noticed that we never mentioned unit testing or anything
related to it. This was done on purpose; despite the fact that in this chapter we will
focus more on the most modern tools that aid us in testing, we will still cover the
entire topic quite in depth, so we do not require any particular knowledge of unit test-
ing to unit testing of Angular applications specifically. Rest assured, this chapter is
designed to be pretty easy to consume.
The reason for this is that despite the fact that unit testing is a great way to ensure
an application’s stability, thousands upon thousands of Angular applications (as well
as applications generally) out in the world go on without it. Multiple factors contrib-
ute to this: often, projects are outsourced from other enterprises and the clients just
do not want to spend budget on it; young startup teams want to “move fast and break
things” and just deliver their product (such teams often make a promise to cover the
codebase with tests later, and then this promise is broken); teams do not believe in
automatic testing and leave everything for manual quality assurance. All of these stances
are understandable; however, in the next few paragraphs we will try to convince our-
selves that unit tests are, in general, quite useful and then move on to testing our
application. To do this, let’s first cover the basics.
8.1.2 	What is a unit test?
As the name suggests, a unit test is an automated test that checks the functionality of
some programming unit in isolation. What programming unit, we might wonder? Any
basic building block can be a unit. A very small instance of a unit test might be a test
that essentially checks the correctness of one single method of a class.
And what does “automated” mean, exactly? In this case, it means we will describe sce-
narios that might happen to our component/directive/service/etc. by, for instance,
calling its methods with certain data, expect some results, and clearly define which
results mean the functionality works as intended. All of this is done via functions that
we will soon become familiar with (if you are not already). After describing the sce-
nario, a special program can be called to execute those scenarios and ensure the pro-
gram we want to test works correctly.
Finally, we mentioned that a unit test is a test in isolation. How is it isolated? A unit
test kind of assumes that everything else in the world works fine, and we are just test-
ing this particular component (or anything else). This means that if, for i

---

## Has to spin up the browser itself and then run the

tests inside it, sometimes resulting in
slower performance
Runs as an independent JS program, with no
browser, and can be faster
No need to mock the browser’s built-in functionality,
as it already runs in a real browser
We can’t directly use browser APIs here, as Jest
runs in a NodeJS runtime; for instance, if our
component calls localStorage, we will have
to mock it for the tests to run correctly
Allows for cross-browser testing: if our application
uses APIs that might not exist in some older brows-
ers, we can configure Karma to use several different
browsers and see if the tests pass on all of them
No real cross-browser testing
-- 202 of 306 --
183	8.2 	Configuring a testing environment
Let’s see what it does. If we have not added or removed anything related to the tests in
the app, we should see an error:
AppComponent should create the app FAILED
NullInjectorError: R3InjectorError(Standalone[AppComponent])
[AuthService -> AuthService -> HttpClient -> HttpClient]:
NullInjectorError: No provider for HttpClient!
This is expected, as we developed some functionality in the AppComponent without updat-
ing their respective unit tests, which means the test has some problems creating an
instance of the AppComponent class. But why does it run tests for AppComponent anyway?
We surely have not written any tests, have we? Well, if we created the application without
the --minimal flag (see chapter 1, section 1.3.1, table 1.2), then Angular automatically
set up a default testing environment and some dummy tests for the AppComponent (the
only component that existed at the time of the application’s inception).
But how does Angular know where the tests are? Well, there is a specific configura-
tion file, called tsconfig.spec.json at the very root of the project, which tells it how to
function. The contents of the file are pretty simple, as shown in the following listing.
{
"extends": "./tsconfig.json",
"compilerOptions": {
"outDir": "./out-tsc/spec",
"types": [
"Jest"
]
},
"include": [
"src/**/*.spec.ts",
"src/**/*.d.ts"
]
}
As we can see, this config tells the test runner to grab all the files ending with .spec.ts
and run the tests inside them. In our application, only one such file exists, located at
src/app/app.component.spec.ts, which contains the tests that just failed when we first
ran ng test. However, before moving to fix this problem, let’s remember that this is
the default configuration of the testing environment, meaning it runs Karma, and we
have chosen to use Jest instead. Thankfully, this is an easy change. In the angular.json
file we will find a section dedicated to unit testing. We need to alter it a bit to use Jest,
so it will look like the following listing.
{
"projects": {
Listing 8.1 	Testing configuration file
Listing 8.2 	angular.json configuration to use Jest as test runner
This TypeScript configuration will
just use the same as the overall app
while adding some options.
We switch to Jest types instead of
Jasmine, which was the testing
f

---

## Rest of the file

omitted for brevity
-- 203 of 306 --
184 	C HAPTER 8 	Unit testing in modern Angular
"hrms": {
"projectType": "application",
"architect": {
"test": {
"builder": "@angular-devkit/build-angular:jest",
"options": {
"polyfills": [
"zone.js",
"zone.js/testing"
],
"tsConfig": "tsconfig.spec.json"
}
}
}
}
}
}
Now if we try to run ng test again, we will get a new error:
Jest is not installed, most likely you need to run
`npm install jest --save-dev` in your project.
Continuing this, we will get other errors, so to jump to the point where the Jest test
runner works, we need to run the following commands:
npm install jest --save-dev
npm install jest-environment-jsdom --save-dev
npm i --save-dev @types/jest
After, we can rerun ng test and see the same error (regarding the injection of
HttpClient) that we saw when running tests initially; however, notice that the tests
are now running with Jest (different format of reporting from the command). This
means we successfully switched to Jest.
One concern for us down the line is being able to configure some options for our
Jest test runner. To be able to do this, we need to provide a configuration file and a file
that will do our custom setup. First, let’s create a file named jest.config.ts at the root of
our project folder, and put the following code there:
module.exports = {
setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
};
When we run the tests, Jest will automatically scan the root directory searching for a
file named jest.config.ts, which we just created, and in it we tell Jest to look for a setup-
jest.ts file and run it to get the additional supporting configuration. Let us also create
this setup-jest.ts file at the root of our project and leave it empty for now (we will add
some configurations later).

---

## Karma config included other

options like “assets,” which
are not needed with Jest, so
we removed them.
-- 204 of 306 --
185	8.2 	Configuring a testing environment
We are almost done setting up our testing environment; however, before we begin
fixing the tests for the AppComponent, let us finalize our setup with the addition of
some third-party tools that will become useful in the process of writing the actual tests.
8.2.3 	Installing third-party tools
Angular provides many built-in tools for unit testing out of the box (as we shall soon
see when we start interacting with the unit tests for the AppComponent). However,
community-driven projects also provide a lot of functionality. Let’s explore these.
MOCKING DEPENDENCIES
As mentioned in section 8.1.2, in unit tests, we test functionality in isolation, so a com-
ponent is tested without actually testing the other components that it uses in its tem-
plate or services that it injects. But how can we accomplish this if the component, for
instance, calls a method from that service?
The way we do this is by mocking the dependencies of the particular class/function/
whatever we are testing. Mocking essentially means providing an empty, barebones
replacement for a dependency, which has the same API but does nothing and only
checks if our test subject calls the correct methods and properties of this “fake” depen-
dency in the correct order. For instance, if our component uses another component,
we can write a mock version of this component that has the same inputs and outputs
and test the original component that way.
We will discuss doing this in code in the next section, but first we need to under-
stand that this process can become quite cumbersome. A given component can use
multiple other components and inject lots of services, so we would need to provide
drop-in replacements for them both. In large projects, this can result in a huge amount
of boilerplate code.
To counter this, a community project called ng-mocks has been developed, which
provides functionality that allows to automatically mock existing services, compo-
nents, pipes, and other Angular building blocks for unit testing purposes. Let’s install
it so we can use it next:
npm install ng-mocks --save-dev
Now, as we have it in place, let’s discuss problems we may have when testing compo-
nents specifically and what community solutions we can use to address them.
TESTING A NGULAR COMPONENTS
Testing most of the Angular building blocks boils down to creating an instance of the
class we want to test (service, directive, pipe, and so on) and then playing with its
methods in various scenarios. However, components do stand apart a bit in this case:
they also have a template.
With Angular components, we don’t just want to call some of the class methods
and ensure they work properly but also to check if, say, some content has been ren-
dered properly in the UI or some event caused the proper handler method to be
-- 205 of 306 --
186 	C HAPTER 8 	Unit testing in modern Angular
cal

---

## An actual testing

expectation. Here we
expect the component
to be successfully
initialized.
-- 207 of 306 --
188 	C HAPTER 8 	Unit testing in modern Angular
8.3.2 	Providing mock dependencies
When we first ran ng test, we encountered an error that was related to dependency
injection, when our component tried to inject the HttpClient. However, if we take a
look at the component code, we can see that nowhere do we attempt any injection of
this service. So why this error?
Jest nds a spec.ts le and starts executing it.	fi 	fi
Jest finds the 	block.	describe
Jest runs the 	block before all the specs.	beforeAll
Jest finds and then executes the next spec.
Jest runs the 	block.	afterEach
All specs in a given le successfully executed.	fi
Jest runs the 	block.	afterAll
No new .spec.ts les are found. 	A test spec fails.	fi

---

## Moves to the next spec

Jest moves to the next .spec.ts le.	fi
Jest runs the 	block before each spec.	beforeEach
Figure 8.1 Execution of unit tests by the Jest test runner
-- 208 of 306 --
189	8.3 	Running Angular unit tests
If we open the src/app/app.component.html file, we can see that it contains a
simple template:
<app-header/>
<router-outlet></router-outlet>
<app-footer/>
Now, the FooterComponent resides in the src/app/shared/components/footer.com-
ponent.ts file (the one we created in chapter 3, section 3.2.2, listing 3.6), and is used
here. If we look inside that component, we will see that it calls a function named
isAuth, which in turn injects the AuthService, which finally injects the HttpClient,
which is not provided anywhere (remember we set up a testing module that is inde-
pendent of the applications itself, and it imports only the AppComponent at this point—
nothing else).
So what do we do about this? We could provide the HttpClient in the TestBed
.configureTestingModule command, but we do not really need to do this. It is suffi-
cient to remember that unit tests are tests in isolation, so we not only do not need the
HttpClient (it is already tested and trusted within the Angular framework), but we do
not even need the FooterComponent and HeaderComponent, as they will have their
own separate tests. Essentially, our component depends on these two components
and RouterOutlet.
We can fix the RouterOutlet problems by using the RouterTestingModule, a spe-
cific module that mocks router-related building blocks for unit-testing purposes and
the problem with the other two components using MockComponents, a special function
provided by the ng-mocks library. This function will take a list of components and pro-
vide mock replacements for them—essentially components without templates, with-
out injected dependencies, and with the same selectors and inputs/outputs as the
components we provided, so we can use them and not bother about their problems
when testing the AppComponent. Our tests will now look like the following listing.
import { TestBed } from '@angular/core/testing';
import {
RouterTestingModule,
} from '@angular/router/testing';
import { MockComponents } from 'ng-mocks';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/components/header.component';
import { FooterComponent } from './shared/components/footer.component';
describe('AppComponent', () => {
beforeEach(() =>
TestBed.configureTestingModule({
imports: [
AppComponent,
RouterTestingModule,
MockComponents(HeaderComponent, FooterComponent),
Listing 8.4 	Mocking dependencies to test AppComponent

---

## Mocking

components that
are used within
AppComponent
-- 209 of 306 --
190 	C HAPTER 8 	Unit testing in modern Angular
],
})
);
});
Hopefully, this will at least fix the first two specs. Indeed, if we run ng test again, we
will encounter a new error:
AppComponent
√ should create the app (83 ms)
√ should have the 'hrms' title (21 ms)
× should render title (19 ms)
● AppComponent › should render title
expect(received).toContain(expected) // indexOf
Matcher error: received value must not be null nor undefined
Received has value: undefined
As we can see, the first two specs did actually run successfully, and only the third one
failed for obvious reasons: the template now contains references to some components
and no text that reads “hrms app is running!” This is good news, as now we have a test-
ing expectation fail and not a problem with how we set up the test. Let’s move forward
and explore how we can fix this.
8.3.3 	Testing components
As mentioned previously, testing components is a bit different from other building
blocks, because it involves also testing the template. There is a debate within the
Angular community as to whether we should test the template of a component or not;
however, Angular provides the necessary tools, and the template itself is a very import-
ant part of the component (probably the most important), so in this book, we will
assume that the testing of the template is necessary.
TESTING COMPONENT TEMPLATE WITH ANGULAR ’S BUILT- IN TOOLS
AppComponent class itself has a very simple implementation (essentially it only imports
things to use in the template), so what is left for us is to test the template itself. The
template is just calling three other directives, so to make sure AppComponent works
properly, it should be sufficient to check if the proper components are rendered (only
calls to them, without actually rendering them, as we use their mocked versions
instead). Let’s do exactly that by removing the third spec and writing a new one that
checks the template.
it('should render header, footer and a router outlet', () => {
const fixture = TestBed.createComponent(AppComponent);
Listing 8.5 	Testing AppComponent’s template

---

## Rest of the tests

omitted for now
-- 210 of 306 --
191	8.3 	Running Angular unit tests
fixture.detectChanges();
const header = fixture.debugElement.query(
By.css('app-header'),
);
expect(header).toBeTruthy();
const footer = fixture.debugElement.query(
By.css('app-footer'),
);
expect(footer).toBeTruthy();
const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
expect(routerOutlet).toBeTruthy();
});
Now if we rerun our tests, we will see that all three execute successfully, meaning we
just completed unit testing our first component! Congratulations are in order.
However, we can see that this code is a bit too wordy. We use different tools—for
instance, the By object imported from @angular/platform-browser—to query the
rendered DOM by a CSS selector, we manually trigger change detection, and so on.
For now, we tested a routed component, which tends to be not so heavy on the tem-
plate, often calling other, more reusable components to do the actual rendering (as
in this case).
But what will happen when we test other components that accept inputs, call other
components again, and change data and output events? Are we doomed to repeat the
boilerplate code forever? It turns out, not really. Let’s test one of our reusable compo-
nents and see how the Angular Testing Library can help us reduce the noise and focus
on checking the produced DOM.
TESTING COMPONENT TEMPLATE WITH A NGULAR TESTING LIBRARY
Previously, we built a ProjectCardComponent in the src/app/shared/components/
project-card.component.ts file (see chapter 4, section 4.1.1, listing 4.1), which
received a projectId as an input and made an HTTP call via the ProjectService
to retrieve data about the given project and display it in the UI. The component itself
is not particularly complex, but it is somewhat template-heavy: it uses the NgOptimized-
Directive and injects a service that we built, so we need to learn to mock both and
use the tools provided by the Angular Testing Library to easily check the DOM.
Let’s see this unit test in action. In the src/app/shared/components directory, cre-
ate a file named project-card.component.spec.ts and put the test shown in the follow-
ing listing there.
import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RenderResult, render } from '@testing-library/angular';
import { MockDirective, MockProvider } from 'ng-mocks';
Listing 8.6 	Testing ProjectComponent’s template
Angular’s change detection does not work
automatically in unit tests, so whenever we want to
check for new templates rendered, we need to call it
manually using the fixture object.

---

## Repeats the same for

other components
-- 211 of 306 --
192 	C HAPTER 8 	Unit testing in modern Angular
import { ProjectService } from 'src/app/services/project.service';
import { ProjectCardComponent } from './project-card.component';
let component: RenderResult<ProjectCardComponent>;
describe('ProjectCardComponent', () => {
beforeEach(async () => {
component = await render(ProjectCardComponent, {
imports: [
AsyncPipe,
NgIf,
RouterTestingModule,
MockDirective(NgOptimizedImage),
],
providers: [MockProvider(ProjectService)],
});
});
it('should create', () => {
expect(component).toBeTruthy();
});
});
If we run the tests now, they will execute successfully; however, we haven’t yet tested
for much—we only set up our testing space. What we really need to check is whether
when the projectId property changes, the UI will update accordingly. To achieve this,
we need a bit smarter version of the ProjectService, which will have the method
getProject mocked separately and return some mock data for the UI to consume.
Let’s implement this in the following listing.
const mockProjects: Project[] = [
{
id: 1,
name: 'Project 1',
description: 'Project 1 description',
image: 'path-to-image1.png',
employees: [],
subProjectIds: [],
},
{
id: 2,
Listing 8.7 	Mocking a service method separately

---

## We can just mock the

NgOptimizedDirective as
we do not need to test its
functionality.
We use the MockProvider
function from the ng-mocks
library to mock the
ProjectService; now, our
component will receive a
dummy version of this service
with the same methods that
do nothing when called.

---

## An array of

mock “projects”
-- 212 of 306 --
193	8.3 	Running Angular unit tests
name: 'Project 2',
description: 'Project 2 description',
image: 'path-to-image2.png',
employees: [],
subProjectIds: [],
},
];
describe('ProjectCardComponent', () => {
beforeEach(async () => {
component = await render(ProjectCardComponent, {
imports: [
AsyncPipe,
NgIf,
RouterTestingModule,
MockDirective(NgOptimizedImage),
],
providers: [
MockProvider(ProjectService, {
getProject(id) {
return of(mockProjects.find((project) => project.id === id)!);
},
}),
],
});
});
});
Now we can imagine that an HTTP call is happening behind the scenes (which it is
not) and we get the observable of these mock projects. What is left here is to test for
the sequence of “id changed, then ProjectService was called, then the UI was
updated.” It turns out this complex scenario is pretty easy to implement with the
testing library. First, let’s create the component with an input given by default and
check the UI.
import { RenderResult, render, screen } from '@testing-library/angular';
let component: RenderResult<ProjectCardComponent>;
describe('ProjectCardComponent', () => {
beforeEach(async () => {
component = await render(ProjectCardComponent, {
imports: [
AsyncPipe,
NgIf,
RouterTestingModule,
MockDirective(NgOptimizedImage),
],
providers: [
MockProvider(ProjectService, {
Listing 8.8 	Testing component UI with the Angular Testing Library
MockProvider accepts a second
argument, with which we can
provide mock implementations of
any methods a given service has.

---

## Rest of the imports

and mock data
omitted
-- 213 of 306 --
194 	C HAPTER 8 	Unit testing in modern Angular
getProject(id) {
return of(mockProjects.find((project) => project.id === id)!);
},
}),
],
componentInputs: {
projectId: 1,
},
});
});
it('should render the project name', () => {
expect(screen.getByText('Project 1')).toBeInTheDocument();
});
});
As we can see, testing this scenario boiled down to just a single line of code, thanks to
the Angular Testing Library. However, this is the default scenario, and we also want to
check that if the input changes, the component successfully updates the UI using the
HTTP “call.” Let’s amend our test spec a bit.
it('should render the project name', () => {
expect(screen.getByText('Project 1')).toBeInTheDocument();
component.fixture.componentRef.setInput('projectId', 2);
component.fixture.detectChanges();
expect(screen.getByText('Project 2')).toBeInTheDocument();
});
With that we have a full scope of this component’s functionality. From now on, it
would be trivial to add checking for other cases (for instance, checking for an error).
Next, we will explore another addition to Angular unit testing by diving into the unit
testing process of Angular services.
8.3.4 	Testing services
At this point, we should be able to deduce that the testing of services is going to be a
simpler process than, say, components. After all, services do not have a template and
usually incorporate some straightforward functionality. Let’s now see in action what
potential problems we might face.
Let’s begin with a very foundational service in our application: AuthService. It is a
good candidate for exploring here because it is both very important and contains
some out-of-the-ordinary functionality like a BehaviorSubject that tracks the user’s
authentication status and also calls the localStorage object. We will begin by writing
a simple test that just creates the instance of the service, and then we can play with it.
Listing 8.9 	Testing component UI when inputs change

---

## Triggers change

detection so
that UI updates	Checks the UI for
the latest text
-- 214 of 306 --
195	8.3 	Running Angular unit tests
For this purpose, let’s create a new test file in the src/app/services directory
named auth.service.spec.ts and put the setup code from the following listing inside.
import { AuthService } from './auth.service';
let service: AuthService;
describe('AuthService', () => {
beforeEach(() => {
service = new AuthService();
});
it('should be successfully instantiated', () => {
expect(service).toBeTruthy();
});
});
While this code looks both familiar and very understandable if we run the tests now,
we will be confronted with an error:
NG0203: inject() must be called from an injection context
such as a constructor, a factory function,
a field initializer, or a function used
with `runInInjectionContext`.
Here we forgot that this service (as all others we authored in the project) uses the
inject function to get its dependencies, and chapter 3 taught us that this function
only works in specific places, so just calling new AuthService() will not work. What we
have to do is set up a testing module, provide dependencies, and then use a special
new method that allows us to run code in an injection context while unit testing.
Our service only uses the built-in HttpClient, but, as we mentioned previously, we
don’t really want to make HTTP calls inside unit tests, so it is better to mock it. For this
purpose, Angular provides a special testing controller that allows us to emulate HTTP
calls and check for the mocked data received. Let’s configure it.
import { HttpClientTestingModule, HttpTestingController } from
'@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
let service: AuthService;
let httpMock: HttpTestingController;
describe('AuthService', () => {
beforeEach(() => {
TestBed.configureTestingModule({
imports: [HttpClientTestingModule],
Listing 8.10 	Setup for the testing of a service
Listing 8.11 	Initializing a service in unit tests

---

## Configures a module

for mocked providers
Provides the HTTP testing
module so we do not make
real HTTP calls
-- 215 of 306 --
196 	C HAPTER 8 	Unit testing in modern Angular
});
TestBed.runInInjectionContext(() => {
service = new AuthService();
});
httpMock = TestBed.inject(
HttpTestingController,
);
});
it('should be successfully instantiated', () => {
expect(service).toBeTruthy();
});
});
Now we can see that our test here runs correctly, and the service is being initialized. Next,
let us add a unit test that checks some real functionality—namely the login method. For
this purpose, we have to send some mock token data via the HttpTestingController
(we will soon see how), check that it arrived successfully, and also check that the
isAuth$ BehaviorSubject has been switched to true. Here is how we are going to do
this in a new test spec, shown the following listing.
it('should log the user is', () => {
service.login({email: 'test', password: 'test'}).subscribe((res) => {
expect(res).toBe({token: 'mock token'});
expect(service.isAuth$.getValue()).toBe(true);
});
const request = httpMock.expectOne({
url: '/api/auth/login',
method: 'POST',
});
request.flush({token: 'mock token'});
});
Now we know how we can unit test a service that makes HTTP calls. There is one thing
left for us here to learn, and that is the getToken method of our service. We want to
check if it really does return a token from localStorage. However, if we just write
expect(service.getToken()).toBe('mock token');, we will be disappointed. Because
(as we mentioned), Jest runs in Node.js rather than a browser (as opposed to Karma),
localStorage doesn’t really exist in this context. localStorage also isn’t an Angular
Listing 8.12 	Testing an HTTP call
TestBed now supports calling some
functions in its own injection
context, which in our case allows for
the initialization of the AuthService.

---

## We use

HttpTestingController
to check if the
method we called
actually completed
the HTTP request.	We check if the URL is correct.
We also check if the method is correct.
Finally, we send the mock data that will
be checked in the “subscribe” callback.
-- 216 of 306 --
197	8.3 	Running Angular unit tests
construct, so we have to come up with a custom way of mocking it. We can do this by
utilizing some methods that Jest itself provides.
let localStorageMock: Pick<Storage, 'getItem'>;
describe('AuthService', () => {
beforeEach(() => {
TestBed.configureTestingModule({
imports: [HttpClientTestingModule],
});
TestBed.runInInjectionContext(() => {
service = new AuthService();
});
httpMock = TestBed.inject(HttpTestingController);
localStorageMock = {
getItem: jest
.fn()
.mockImplementation((arg) => 'mock token'),
};
Object.defineProperty(window, 'localStorage', {
value: localStorageMock,
});
});
it('should return the token', () => {
expect(service.getToken()).toBe('mock token');
});
});
Finally, we have the full arsenal of both modern and existing tools to help us test ser-
vices in Angular projects. Next, we are going to move to the biggest modern feature
Angular has, the signals, and see how we can unit-test them.
8.3.5 	Testing signals
Signals, as you remember, are a quite big topic (after all, we spent two chapters discuss-
ing them!). However, in this section, we will see that using signals actually simplifies the
testing process. We already did ourselves good by creating a TimeOffManagement-
Service in the src/app/services/time-off-management.service.ts file (we created it in

---

## chapter 7, section 7.3.4, listing 7.12), which acts as a state management service for

components related to the time-off feature. This both simplified the respective com-
ponent but also allowed us to encapsulate the logic in a service, which we already
know is easy to test.
The fact that we can always retrieve the value of a signal plays a major role in this
simplification: we can just call the value, then change it, then expect some new value,
and that’s it: our test is done! Let’s see this on the example of this very service, after
Listing 8.13 	Mocking localStorage

---

## Jest provides

utilities for mocking
functions, and
mockImplementation
allows us to run any
function when the
function we want to
mock is called.

---

## Rest of the

specs omitted
Finally, we check that
our method does, in
fact, return the mock
data from the mock
localStorage.
-- 217 of 306 --
198 	C HAPTER 8 	Unit testing in modern Angular
which we will also move on and show how this approach simplifies testing the Tim-
eOffManagementComponent.
This service uses another service that makes the HTTP calls that are related to time-
offs. As we already know how to test such services; we will just assume it is already cov-
ered by unit tests and works properly, and we only need to mock it in a specific way to
test the TimeOffManagementService. While this service looks a bit intimidating, we can
see that after mocking its dependent service, testing its own functionality will become
extremely easy. Let us see it in action. First, let’s mock the dependencies of the service.
const mockRequests: TimeOffRequest[] = [
{
id: 1,
type: 'Vacation',
status: 'Pending',
startDate: new Date().toISOString(),
endDate: new Date().toISOString(),
employeeId: 1,
},
{
id: 2,
type: 'Sick Leave',
status: 'Pending',
startDate: new Date().toISOString(),
endDate: new Date().toISOString(),
employeeId: 1,
},
];
const MockTimeOffRequestService: Partial<
TimeOffRequestService
> = {
getRequestsByType: jest.fn()
.mockReturnValue(
of(mockRequests),
),
approveRequest: jest.fn()
.mockImplementation(
(id) => {
const request = mockRequests
.find(
(r) =>
r.id === id
);
if (request) {
request.status = 'Approved';
}
return of({});
}),
rejectRequest: jest.fn().mockImplementation((id) => {
const request = mockRequests.find((r) => r.id === id);
if (request) {
Listing 8.14 	Mocking the dependencies of a service with signals

---

## We return an empty

observable in the end
for the service events
to work.
-- 218 of 306 --
199	8.3 	Running Angular unit tests
request.status = 'Rejected';
}
return of({});
}),
deleteRequest: jest.fn().mockImplementation((id) => {
const index = mockRequests.findIndex((r) => r.id === id);
if (index !== -1) {
mockRequests.splice(index, 1);
}
return of({});
}),
};
let localStorageMock: Pick<
Storage, 'getItem' | 'setItem'
>;
let selectedType = '';
let service: TimeOffManagementService;
describe('TimeOffManagementService', () => {
beforeEach(() => {
TestBed.configureTestingModule({
providers: [
MockProvider(
TimeOffRequestService,
MockTimeOffRequestService,
)
],
});
localStorageMock = {
getItem: jest.fn()
.mockReturnValue(
() => selectedType,
),
setItem: jest.fn().mockImplementation((key, value) => {
selectedType = value;
})
};
Object.defineProperty(window, 'localStorage', {
value: localStorageMock,
});
TestBed.runInInjectionContext(() => {
service = new TimeOffManagementService();
});
});
it('should be successfully instantiated', () => {
expect(service).toBeTruthy();
});
});
As we can see, while this seems a bit wordy, most of this code is pure boilerplate to set
up the actual test, which, as we promised, is going to be quite simple. We will test the
following scenarios:
Mocks localStorage
with a local variable
Getting from localStorage
should return that variable.

---

## Initialization of the service

will work fine now.
-- 219 of 306 --
200 	C HAPTER 8 	Unit testing in modern Angular
 Initial mock requests are loaded.
 Changing the selectedType results in updates to the requests.
 selectedType is stored in localStorage.
 Rejection/approval/deletion of a request results in updates to the requests
signal array.
However, when we implement the first test case, we will see that just doing
expect(service.requests()).toEqual(mockRequests); does not yield the result we
expect. So why is that? In the previous chapter, we learned that computed signals cre-
ated from observables and effects are tied in with Angular’s change detection, meaning
in this case we need to trigger change detection to see the results update. In tests, we
can only trigger change detection manually when we create a component to test, but
we do not have a component now—we are testing a service!
The solution to this is creating an empty component for our testing purposes
(such things are often called “stubs”), injecting our service into it, and triggering
change detection on it to test the service. It can be achieved pretty easily, as shown in
the following listing.
@Component({
selector: 'app-stub',
template: '',
standalone: true,
})
export class StubComponent {
constructor(private readonly service: TimeOffManagementService) {}
}
describe ('TimeOffManagementService', () => {
beforeEach(() => {
TestBed.configureTestingModule({
providers: [MockProvider(TimeOffRequestService,
MockTimeOffRequestService)],
imports: [StubComponent],
});
localStorageMock = {
getItem: jest.fn().mockReturnValue(() => selectedType),
setItem: jest.fn().mockImplementation((key, value) => {
selectedType = value;
})
};
Object.defineProperty(window, 'localStorage', {
value: localStorageMock,
});
service = TestBed.inject(
TimeOffManagementService,
);
});
Listing 8.15 	Using a stub component to test a service with signals

---

## We import the stub component

into the testing module.
We now use TestBed.inject to
get the reference to our service,
so that the component’s
reference to the service is that
same as the one we are testing.
-- 220 of 306 --
201	8.3 	Running Angular unit tests
it('should be successfully instantiated', () => {
expect(service).toBeTruthy();
});
it('should have all requests loaded initially, () => {
const fixture = TestBed.createComponent(StubComponent);
fixture.detectChanges();
expect(service.requests())
.toEqual(mockRequests);
});
});
As we can see, the only downside here is having to use the TestBed and manually trig-
gering change detection before checking. Otherwise, all the tests are very simple, and
we can just list them.
it('should be successfully instantiated', () => {
expect(service).toBeTruthy();
});
it('should have all requests loaded initially', () => {
const fixture = TestBed.createComponent(StubComponent);
fixture.detectChanges();
expect(service.requests()).toEqual(mockRequests);
});
it('should update requests when approved', () => {
const fixture = TestBed.createComponent(StubComponent);
service.approveRequest(mockRequests[0]);
fixture.detectChanges();
expect(service.requests()[0].status).toEqual('Approved');
});
it('should update requests when rejected', () => {
const fixture = TestBed.createComponent(StubComponent);
service.rejectRequest(mockRequests[0]);
fixture.detectChanges();
expect(service.requests()[0].status).toEqual('Rejected');
expect(service.resolvedRequests()).toEqual([mockRequests[0]]);
});
it(`should write the values in
localStorage when selectedType
has change`, () => {
const fixture = TestBed.createComponent(StubComponent);
service.selectedType.set('Vacation');
fixture.detectChanges();
expect(selectedType).toBe('Vacation');
});
These tests are so straightforward we don’t even need to dive that deep into them: we
call a method on our service, detect changes, and ensure the signals have changed
Listing 8.16 	Unit tests for a service with signals
We call detectChanges before
we check for the values in the
computed signal.
This finally works.
-- 221 of 306 --
202 	C HAPTER 8 	Unit testing in modern Angular
their values to whatever we expect them to be. As promised, other than the setup
phase (which as we saw was a bit boilerplate-y), testing services with signals is easy, and
there’s no need to worry about asynchronous code, promises, or observables.
Next let us see how this testing approach will work with the TimeOffManagement-
Component, which of course uses the service we just covered with tests. In that case, it will
be even simpler: we only have to mock the TimeOffManagementService with some
mock signal and then use the testing library to essentially test the DOM. For this pur-
pose, we will create a new test file in the src/app/pages/work directory named time-off-
management.component.spec.ts and put the tests shown in the following listing in it.
const MockTimeOffManagementService: any = {
requests: signal(mockRequests),
selectedType: signal(''

---

## We can implement

this signal here to do
the logic of filtration
internally instead of
making an HTTP call.
-- 222 of 306 --
203	8.3 	Running Angular unit tests
TimeOffManagementComponent,
{
providers: [
{
provide: TimeOffManagementService,
useValue:
MockTimeOffManagementService,
},
],
});
});
it('should render the component', () => {
expect(component).toBeTruthy();
});
it('should render the requests', () => {
expect(component.getAllByRole('row').length)
.toEqual(3);
});
it('should update the UI with new buttons if a request is approved', ()
=> {
const approveButton = component.getAllByText('Approve')[0];
fireEvent.click(approveButton);
expect(
component.getAllByText('Approve').length,
).toEqual(1);
expect(component.getAllByText('Reject').length).toEqual(1);
});
});
Evidently, with this state management approach and with the power of the Angular
Testing Library, testing components essentially boils down to mocking services and
checking for UI updates after simulated events. As we can see, the main problem for
us so far has been the boilerplate: writing tests requires a lot of typing. Although we
have finished covering the testing process of all the new features we explored in
this book, it would also be helpful to consider a tool that may remedy the afore-
mentioned tedium of writing tests. At the time of writing this book, AI tools have
started popping up everywhere; most people are finding ways to integrate these
tools into their workflow to make life easier and more productive. In the next sec-
tion, we discuss how we can utilize modern AI tools to significantly cut down on
some of the more laborious manual aspects of unit testing, which can cause us
stress and lost time.

---

## We can initially

check that we have
only three rows
(one for the table
column names +
two for our mock
requests).
We use the utility functions from the Angular Testing Library
to simulate a click on the first Approve Request button.

---

## We then expect the number of buttons to change

accordingly; previously we had two of both as we had two
pending requests, and now we have only one of each.
-- 223 of 306 --
204 	C HAPTER 8 	Unit testing in modern Angular
8.4 	Powers of AI with Angular unit tests
The beginning of the third decade of the 21st century is marked by a rapid increase in
the capabilities of AI-powered tools, ranging from text and image generation to
problem-solving and, of course, writing code. Various tools now exist that can help
developers, and, in the context of unit tests, we will soon see that those tools become
extremely useful when trying to make the unit testing experience enjoyable (let’s be
honest, no one likes mocking dependencies!).
A multitude of coding-related tools exist nowadays, both as plugins for editors and
as standalone tools; however, in this section, we will focus on two of the most popular—
ChatGPT and GitHub Copilot—and see how they can be specifically tailored to our
unit testing needs. Let’s begin with ChatGPT, which is the more “brute force” way of
writing unit tests.
8.4.1 	Unit testing Angular applications with ChatGPT
ChatGPT is an online, AI-powered chatbot that can be accessed on any browser
(https://chat.openai.com/). It has a very simple interface, where we can write any text
(generally referred to as a “prompt”) and ChatGPT will give us an answer. Prompts
can vary a lot, but in general, we can ask any question, including those related to soft-
ware development. ChatGPT can code in any programming language, but, of course,
the addition of a reference to the technology we use will help it generate a more rele-
vant response (i.e., “I am testing an Angular component, and …”). So how can we use
it? There are several approaches to it as related to unit tests.
MOCKING DATA
In listing 8.13, we wrote some mock time-off requests to unit-test our service. We wrote
only two, for the sake of simplicity, but in general, we might want to have more to be
able to exercise more testing scenarios. Typing that out (even when copy-pasting) is
a bit of a hassle, so it might make sense to ask ChatGPT to do it for us. Let’s craft a
small prompt, using the type definition of the request, and see how ChatGPT might
respond to us.

---

## The prompt is

Provide an array of objects that conform to the following TypeScript type:
type TimeOffRequest = {
id: number;
employeeId: number;
startDate: string;
endDate: string;
type: 'Vacation' | 'Sick Leave' | 'Maternity Leave' |
'Paternity Leave' | 'Other';
status: 'Pending' | 'Approved' | 'Rejected';
comment?: string;
};
-- 224 of 306 --
205	8.4 	Powers of AI with Angular unit tests
ChatGPT’s output is
const timeOffRequests: TimeOffRequest[] = [
{
id: 1,
employeeId: 101,
startDate: '2023-11-01',
endDate: '2023-11-03',
type: 'Vacation',
status: 'Approved',
comment: 'Going on a short vacation'
},
{
id: 2,
employeeId: 102,
startDate: '2023-11-05',
endDate: '2023-11-07',
type: 'Sick Leave',
status: 'Pending'
},
];
It actually provided some more text output (something along the lines of “here is the
array you wanted”) and yielded five objects in this array; however, we omitted the rest
for the sake of brevity. We can also indicate how many results we want—for instance,
“give me 10 objects like this.”
NOTE 	ChatGPT is a nondeterministic AI tool that generates responses based
on its own learning data, which changes constantly. Trying the same prompt
can (and most probably will) yield at least slightly different results.
Of course, saving time on mocking data is very valuable, but what else can we do?
MOCKING DEPENDENCIES
As we saw, we spent most time mocking, say, services rather than data (the latter is
mainly a mechanical job). On the contrary, mocking services involves some critical
thinking on our part, so let us see if ChatGPT can handle it on the mock of the
TimeOffRequestService we created in the same listing 8.13. The prompt is
Provide a mock object that mocks all of the methods in this service; use
Jest as the testing framework. Do not provide the tests, and do not make the
methods into spies, just provide mock implementations of the methods, and
use Observables
<the code of the service we want to mock goes here>
As we can see, we had to add some additional parameters to the prompt, asking it to
skip tests themselves and to use observables. Let’s see what we got in response (omit-
ting all but the essentials for brevity):
export class TimeOffRequestServiceMock {
getRequests(query = ''): Observable<TimeOffRequest[]> {
-- 225 of 306 --
206 	C HAPTER 8 	Unit testing in modern Angular
// Mock implementation of getRequests method
return of([]);
}
getRequestsByType(query = ''): Observable<TimeOffRequest[]> {
// Mock implementation of getRequestsByType method
return this.getRequests().pipe(
map(requests => {
return query === ''
? requests
: requests.filter(r => r.type === query);
})
);
}
rejectRequest(id: number): Observable<any> {
// Mock implementation of rejectRequest method
return of({});
}
approveRequest(id: number): Observable<any> {
// Mock implementation of approveRequest method
return of({});
}
deleteRequest(id: number): Observable<any> {
// Mock implementation of deleteRequest method
return of({});
}
}
Now we received something that is close to the

---

## Summary

 Unit tests are a great way to ensure the stability of Angular applications.
 Historically, Angular used Karma to run unit tests.
 Karma is deprecated, so Angular added experimental support for Jest.
 Libraries like ng-mocks and the Angular Testing Library can be a great asset
when unit testing.
 Services that use the inject function can use the new TestBed.runInInjection-
Context method to initialize.
 There are no serious differences in testing standalone and module-based
components.
 AI tools can be used and tailored to provide a better experience when writing
unit tests for Angular apps.
 The Angular team has announced future support of the Web Test Runner.
-- 230 of 306 --
211
Modern Angular
everywhere
Congratulations! During the previous eight chapters, we have successfully built an
enterprise Angular application and even covered it with unit tests to ensure its sta-
bility. Next, we are preparing to go into production, so our concerns are now with
building pipelines and application performance. Let’s see how we move our appli-
cation to a server and how we make it marketable.

---

## This chapter covers

 Server-side rendering
 Why server-side rendering can be necessary
and the performance benefits it provides
 Building a project from scratch with
server-side rendering
 Adding server-side rendering to an existing

---

## Angular application

 Configuring static site generation with
page prerendering
 Configuring application build to use ESBuild
for improved build time
-- 231 of 306 --
212 	C HAPTER 9 Modern Angular everywhere
9.1 	What is server-side rendering?
While the developers working on the HRMS project we have been building so far
rejoice in having completed a minimum viable product, the marketing team arrives
with a big new task before we can move the project into production.
The team gathers with the marketing reps, and they lay out their vision of how the
product will be promoted to potential buyers:
What we want is to have a separate, landing-page-style website that displays information
about the product, and also uses statistics from the app itself; for example, we would like
to have some banners that say that our product is used by X companies and has Y active
users; that data, of course, has to be correct and reflect the situation in our databases.
We might think, sure, it will be easy to throw around a new small Angular app that
makes some requests for statistical data and largely displays static content. But the
marketing team pushes on:
We also want lightning-fast performance. The performance of the HRMS product itself is
decent, but it has terrible initial load time; this is not a problem for the users, as this is an
enterprise tool used in offices; but for a landing page, we want almost instantaneous
interaction. We are going to promote the platform online, and potential buyers will
arrive at the landing page, possibly using mobile devices, so the initial load speed is of
paramount importance.
Then a discussion ensues, which inevitably ends with someone suggesting that the
landing page website is built using server-side rendering (SSR). Is Angular capable of
this? Well, it was capable of SSR for quite a long time with the separate Angular Uni-
versal package, but recently it received a powerful upgrade and got integrated with
other Angular packages itself. So before we begin building this landing page, let’s fig-
ure out what SSR is, what benefits it brings, and how it works in Angular.
9.1.1 	SSR: The what
When the internet first began, it mostly consisted of servers providing static pages to a
client’s browsers. It was a pretty simple schema, exchanging HTML documents between
computers, as figure 9.1 suggests.

---

## Time

Figure 9.1 	Serving static
HTML documents
-- 232 of 306 --
213	9.3 	Improving Angular SSR
When in this sequence the client receives the HTML document, it is ready for consump-
tion, and the browser renders the document and paints it as UI for the user to view.
Even today many websites use this very schema of just serving static content. However,
with time, both the server and the client sides became more and more dynamic.
First, a necessity arose for server-side dynamic pages; for instance, when a user nav-
igates to a certain URL, depending on whether they are logged in or not, they should
see different pages, meaning the server now has to “manually” generate an HTML
document and serve it, instead of just grabbing a readily available one. Figure 9.2
shows how it looked with that approach.
Now the “Renders a dynamic HTML document” part is what we usually refer to as
SSR. But what does it have to do with Angular? With the progress of rendering on the
server side, the client side also received new tools. At this point, JavaScript was used
almost everywhere to provide dynamic interactions in the browser (as continues to be
the case to this day), opening popups, tracking user activity, validating forms, and so
on. At some point, web developers figured we could just forgo the server part and ren-
der the page in the browser, with the backend only providing dynamic data as JSON.
This is what we have been doing with Angular so far, and this is how single-page appli-
cations (SPAs) were born. They provided a number of benefits:
 Websites could now feel like mobile applications for users.
 Navigating from one page to another no longer involved destroying the entire
previous page and repainting a new one.
 We could serve such single-page applications from static content servers like
content delivery networks (CDNs) instead of large servers.
 The server and the client became very decoupled.
With SPAs, the process from figure 9.2 became more complicated, as evidenced by
figure 9.3.
This approach ushered us into an era when all websites started looking like fully
fledged applications and provided very powerful interactions and instantaneous

---

## Time

Figure 9.2 Rendering HTML
documents on a server
-- 233 of 306 --
214 	C HAPTER 9 Modern Angular everywhere
feedback for the user (no need to “refresh” the page to deliver some data from a form
to the server, for example). So far, this approach seems like an obvious upgrade from
just SSR, so why are we discussing SSR in Angular in this chapter? Let’s discuss what
problems SPAs have.
9.1.2 	SSR: The why
Despite all the aforementioned benefits, SPAs carry with them several problems that
strike particularly painfully for websites intended to be accessed by millions that are
dealing with marketing or are mobile-heavy. Let’s discuss each of these in turn.
INFERIOR INITIAL LOAD TIME
If we take a closer look at figure 9.3, we will see that rendering the page now involves
several steps; first, we need to load a page, which will contain some bare-bones HTML
and links to relevant JavaScript files. In the case of Angular, applications by default are
single-page, so if we build and serve them, every time someone accesses them, they
will first receive this “initial” HTML. We can see this in action if we run ng serve, open
the page, and inspect its source code. We can do this with the HRMS application we
already have and will see the code shown in the following listing.
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
Listing 9.1 	index.html file of an Angular single-page application
Client 	CDN
Returns dynamic data as JSON

---

## Time

Figure 9.3 	Life cycle of the relation between a SPA and server/CDN
-- 234 of 306 --
215	9.3 	Improving Angular SSR
<title>Hrms</title>
<base href="/">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/x-icon" href="favicon.ico">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<app-root></app-root>
<script src="runtime.js" type="module"></script>
<script src="polyfills.js" type="module"></script>
<script src="styles.js" defer></script>
<script src="vendor.js" type="module"></script>
<script src="main.js" type="module"></script>
</body>
</html>
As we can see, the page is essentially empty, with just a reference to our root compo-
nent (AppComponent) and some scripts. To render the actual content, in the next step,
the browser will have to load those scripts (some of which contain the code for Angu-
lar itself). Finally, the browser will execute those scripts, which will in turn render the
page the user really wants to see.
Obviously, this process is far more resource-heavy than what we described as SSR,
as, instead of just getting some prepared HTML and rendering it, the browser will
have to go through all of those steps, download the JavaScript files, and execute them,
and only then will the rendering even begin.
Obviously, this affects a number of important metrics, one of which is Largest Con-
tentful Paint, which we discussed in relation to images in chapter 4, section 4.4. This
also makes the time-to-interactive (time that passes between the user navigating to a
page and them being able to trigger events like clicks in it) metric worsen by quite a
lot. Essentially, if we take any Angular SPA and run Chrome’s built-in Lighthouse per-
formance monitoring tool, we will see quite poor results.
All of these make Angular as a SPA an unappealing choice for websites aimed at
passing-by users. As we mentioned, for enterprise tools, such metrics can be not very
important (who cares how fast a page you load every day goes to interactive?), but for
websites like blogs, landing pages, marketing sites, and so on, poor performance in
such categories can mean reduced traffic, which in turn devolved into lost revenue.
However, such websites have an even bigger concern that is affected by SPAs.
WORSENED SEO
Search engine optimization (SEO) is a practice of making web pages more suitable
for search engines like Google, Bing, etc. Essentially, it means adding specific key-
words and building websites in such a way that search engine web crawlers can easily
find and index them.
Search engines use these special programs, called crawlers, to automatically go
around the web and find new pages, extract information from them, and make
-- 235 of 306 --
216 	C HAPTER 9 Modern Angular everywhere
them related to keywords for which users might potentially search in the future. For
instance, if we build a website for a legal company in Albuquerque, those web crawl-
ers can find pages inside them and index keywords fro

---

## This option indicates the file from

which the server must start running
to serve rendered Angular pages.
-- 238 of 306 --
219	9.3 	Improving Angular SSR
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import bootstrap from './src/main.server';
export function app(): express.Express {
const server = express();
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');
const commonEngine = new CommonEngine();
server.set('view engine', 'html');
server.set('views', browserDistFolder);
server.get('*.*', express.static(browserDistFolder, {
maxAge: '1y'
}));
server.get('*', (req, res, next) => {
const { protocol, originalUrl, baseUrl, headers } = req;
commonEngine
.render({
bootstrap,
documentFilePath: indexHtml,
url: `${protocol}://${headers.host}${originalUrl}`,
publicPath: browserDistFolder,
providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
})
.then((html) => res.send(html))
.catch((err) => next(err));
});
return server;
}
function run(): void {
const port = process.env['PORT'] || 4000;
const server = app();
server.listen(port, () => {
console.log(`Node Express server listening on http://localhost:${port}`);
});
}
run();
Listing 9.4 	Configuring the server to render the Angular pages
Base HREF for the files to load correctly The CommonEngine will
be used to render the
page on the server.

---

## Common engine is used to

render the HTML document.
A server is bootstrapped
and listens on a port.
-- 239 of 306 --
220 	C HAPTER 9 Modern Angular everywhere
While this file can seem a bit intimidating, the good news is we do not really need to
understand all of it, as it is preconfigured and will work well, unless we want to heavily
customize it. For the purpose of this chapter, we don’t need to know more about it
than we already covered, so we can move to explore the two main.ts files. The main.ts
file is completely the same as with a common SPA setup:
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
bootstrapApplication(AppComponent, appConfig)
.catch((err) => console.error(err));
We already encountered such a setup in chapter 1, when we initialized the HRMS
application itself, so we shouldn’t have any surprises here. The main.server.ts file, on
the other hand, has some minor differences:
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
const bootstrap = () => bootstrapApplication(AppComponent, config);
export default bootstrap;
As we can see, it is generally the same; however, it uses a different config than main.ts,
and also, instead of bootstrapping the application outright, it just exports a function
that does it. Again, this is done to help Angular run on any server environment, not
just Express (although Express is the default).
Finally, let us see how the configs are different before we build some components
and actually run the application. The app.config.ts configuration, unsurprisingly, is
almost unchanged:
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
export const appConfig: ApplicationConfig = {
providers: [provideRouter(routes), provideClientHydration()]
};
The provideClientHydration() option is a new SSR-related feature that we will
explore in more depth later in this chapter. As we can see, it is a best practice to use it,
as it is included in an SSR setup by default. Otherwise, this file is mostly the same as
the one we received when bootstrapping the HRMS application in chapter 1. Finally,
let’s see the app.config.server.ts file:
-- 240 of 306 --
221	9.3 	Improving Angular SSR
import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
const serverConfig: ApplicationConfig = {
providers: [
provideServerRendering()
]
};
export const config = mergeApplicationConfig(appConfig, serverConfig);
As we can see, this config provides SSR and merges itself with the normal config we
have in the other file. Nothing else of interest is going on here, so we

---

## Learn about our available subscriptions

<a routerLink="subscriptions">here</a>
</p>
Listing 9.8 	AppComponent with content
A large cover
picture
-- 244 of 306 --
225	9.3 	Improving Angular SSR
</div>
<div class="container">
<router-outlet />
</div>
<app-footer />
`,
styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
Now we have a workable component. As we have some content and a big cover pic-
ture, the page will get some scrolling on most desktop computers. What we want to do
is for the user to be able to scroll back to the top of the page quickly. For this reason,
let us implement a ScrollToTopComponent that will render a button that will become
visible when the user has scrolled some distance from the top of the page and will
scroll back when clicked. In the src/app folder let’s create a new folder named com-
ponents and put the scroll-to-top.component.ts file inside of it with the component
code shown in the following listing.
@Component({
selector: 'app-scroll-to-top',
template: `
<button *ngIf="isVisible" (click)="scrollToTop()">Scroll To Top</button>
`,
styles: [
`
button {
position: fixed;
bottom: 20px;
right: 20px;
z-index: 99;
font-size: 18px;
border: none;
outline: none;
background-color: #333;
color: #fff;
cursor: pointer;
padding: 15px;
border-radius: 4px;
}
`
],
standalone: true,
imports: [NgIf],
})
export class ScrollToTopComponent implements OnInit {
isVisible = false;
scrollToTop() {
window.scrollTo({ top: 0, behavior: 'smooth' });
}
Listing 9.9 	ScrollToTopComponent

---

## When the button is

clicked, the page will
be scrolled back to
the very top.
-- 245 of 306 --
226 	C HAPTER 9 Modern Angular everywhere
ngOnInit() {
window.addEventListener('scroll', () => {
if (window.scrollY > 100) {
this.isVisible = true;
} else {
this.isVisible = false;
}
});
}
}
Other than the styles to make the button more appealing, the component is pretty
straightforward: we listen to scroll events on the browser’s window, and if the user has
scrolled a bit too far, we toggle the button to become visible and vice versa. However, if
we add this component to the AppComponent and run the application, we will receive
the following compilation error:
ERROR ReferenceError: window is not defined
at _ScrollToTopComponent.ngOnInit
Wait, this can’t be right: why is window undefined? If we remember that the applica-
tion is being rendered on the server side, we will realize that window (and other
browser’s built-in objects like document, location, and so on) are not available in that
context. SSR will run all the component’s life cycle methods, including ngOnInit, and
encounter a reference to window and throw this error.
So how do we tell Angular that this code only needs to run on the client side?
Here Angular has us covered. Starting from v16, the framework provides two spe-
cial functions, afterRender and afterNextRender, which will take a callback and
run it only on the client. As their names suggest, they both run after SSR is done;
however, afterNextRender runs only once, while afterRender runs each time the
application is rendered.
Let’s modify our component to use afterNextRender and achieve our desired
functionality.
export class ScrollToTopComponent {
isVisible = false;
cdRef = inject(ChangeDetectorRef);
constructor() {
afterNextRender(() => {
window.addEventListener('scroll', () => {
if (window.scrollY > 100) {
this.isVisible = true;
this.cdRef.detectChanges();
} else {
this.isVisible = false;
this.cdRef.detectChanges();
}
Listing 9.10 	Using afterNextRender in the ScrollToTopComponent

---

## We are going to need to manually trigger

change detection in afterNextRender.
We call afterNextRender with
our initialization callback in
the constructor.
Calls detectChanges
when we change the
visibility of the button
-- 246 of 306 --
227	9.3 	Improving Angular SSR
});
});
}
scrollToTop() {
window.scrollTo({ top: 0, behavior: 'smooth' });
}
}
Now if we open our page and scroll, we will see that the button appears when we
scroll a bit and vanishes when we get back to the top of the page, thus accomplish-
ing our task.
We used afterNextRender because we wanted the callback to only run once, as
we were essentially registering an event listener that would then work on its own. In
scenarios where we want to, say, update the DOM manually (for instance, in struc-
tural directives) after the change of some state in the component, we should use
afterRender, which will run each time. Other than that, there is no difference
between these two functions.
Optionally, these functions can accept a second argument after the callback that
will configure some options. We can provide an injector (if we intend to use depen-
dency injection in the callback), or we can provide a special phase option. This option
will configure when exactly in the life cycle of rendering will the callback be invoked,
so changing it can positively affect the performance of our application. There are sev-
eral options and some scenarios where they can be used (see table 9.1).
Now that we have figured out how to run code meant for the client side in Angular
applications that are generally rendered server-side and how to optimize that process,
Table 9.1 	Phase options for afterRender/afterNextRender
Option 	Description 	Scenario
EarlyRead 	This option can be used to perform a
reading from the DOM to render some UI
that is not natively supported.
Implementing a custom scrollbar,
calculating the previous position from
the DOM
Write 	This option should be used if we are only
writing to the DOM. Never use it to read
DOM elements or their attributes.
Updating the DOM when reacting to inter-
section events; for instance, implement-
ing infinite scrolling functionality
MixedReadWrite 	This option is used when we can both
read and write to the DOM. This is the
default option.

---

## Implementing a directive that shows a

comparison between two instances of
the same component; for example, an
altered financial offer displayed side-
by-side with another one, or a Git tree
comparison
Read 	This option is used when we only want to
read from a DOM element. Never use it
to update the DOM manually.

---

## Implementing a directive that reads data

from a third-party library to pass it to
another component
-- 247 of 306 --
228 	C HAPTER 9 Modern Angular everywhere
we can move forward and see what other options Angular SSR provides for the improve-
ment of application performance.
9.3 	Improving Angular SSR
Over the course of this chapter, we learned how to set up a new Angular project that
uses SSR from the get-go. But, to be completely honest, outside the two functions we
just used, we didn’t do many new things: all the components we built were just regular
Angular components, and the rest was generated by the --ssr option when bootstrap-
ping the application. This is, of course, a good thing: this proves we don’t have to care
about lots of stuff when using SSR with Angular; however, there are several things
worth exploring and ways to improve the performance or customize the behavior of
an Angular SSR application. Let’s dive into them now.
9.3.1 	HTTP caching
So far we have built components that mainly just rendered some static content. How-
ever, if we remember the introduction to this chapter, we envisioned an application
that would also make HTTP calls to display real statistics about the HRMS application.
So now let us do exactly this, and see how Angular’s HttpClient will perform when
running on the server side.
For this purpose, in the src/app folder let us create a new file named api.service.ts.
As we are only going to make a couple of HTTP requests, we can just create a simple
service and put all those methods together. The following listing shows what that ser-
vice will look like.
@Injectable({
providedIn: 'root',
})
export class ApiService {
private readonly http = inject(HttpClient);
getCompaniesCount() {
return this.http.get<unknown[]>('/companies').pipe(
map(items => items.length),
);
}
getEmployeesCount() {
return this.http.get<unknown[]>('/employees').pipe(
map(items => items.length),
);
}
}
Now, with this service in place, we can move and create a component that displays sta-
tistics about our (arguably amazing) product. To do this, we will create a new file in
Listing 9.11 	ApiService
We don’t really
care about the
type of objects
we receive,
only the count.

---

## Maps the resulting

array to the count
of objects received
-- 248 of 306 --
229	9.3 	Improving Angular SSR
the src/app/component directory named statistics.component.ts and put the compo-
nent in the following listing there.
@Component({
selector: 'app-statistics',
template: `
<div class="container">
<div class="block">
<p>
<span>
{{ companiesCount() }}
companies already use the HRMS platform!
</span>
</p>
</div>
<div class="block">
<p>
<span>
{{ employeesCount() }}
employees active on the HRMS platform!
</span>
</p>
</div>
</div>`,
standalone: true,
})
export class StatisticsComponent {
apiService = inject(ApiService);
companiesCount = toSignal(
this.apiService.getCompaniesCount(),
{initialValue: 0},
);
employeesCount = toSignal(
this.apiService.getEmployeesCount(),
{initialValue: 0},
);
}
Here we make the HTTP calls we just created, convert the results to signals, and dis-
play it in the UI. Indeed, if we open the application now and take a look, we will see
something like “3 companies already use the HRMS platform! 10 employees active on
the HRMS platform!”, meaning everything works as intended.
However, there is a catch: if we open the browser’s developer console and go to
the Network tab, we will see that there are no HTTP requests made to the URLs we
used in our service. So how does the data appear in the UI? It turns out the requests
to those endpoints have already been performed on the server, and the UI has been
rendered as prepared HTML and delivered to the browser, thus eliminating the need
to perform the request on the client.
Listing 9.12 	StatisticsComponent to display promotional data

---

## We are going to use the

ApiService to get the
statistics data in this
component.
We make the HTTP calls and
convert the results to signals
with default initial values.
-- 249 of 306 --
230 	C HAPTER 9 Modern Angular everywhere
This is a feature of client hydration that was already enabled in the app.config.ts
file generated by Angular when we first bootstrapped the application (we will talk
more about what hydration is in the next section). To verify this we can remove the
provideClientHydration() line from the app.config.ts file and see that now those
requests are performed on the client side and visible in the Network tab.
This is known as HTTP transfer caching (or simply HTTP caching), and it means that
the requests are first performed during rendering on the server side; then their results
are cached and passed onto the client, so the client does not have to re-execute those
potentially costly operations. The HttpClient checks this cache and if it finds the results
there, it just returns it without performing the actual request.
By default, only HTTP GET and HTTP HEAD method requests are cached. This makes
sense, as we usually make other types of requests when the user triggers some opera-
tion (say, saving some data). However, there can be scenarios when an application
makes a POST request to retrieve data rather than save it (for instance, some requests
might require too many parameters that just don’t fit as query parameters in the URL
and the developers resort to using an HTTP POST request). In such cases, we can pro-
vide a specific configuration in the app.config.ts file to also cache the POST requests:
provideClientHydration(withHttpTransferCacheOptions({
includePostRequests: true,
})),
The withHttpTransferCacheOptions we can configure the caching of POST requests
and a number of other things. For instance, we can set the includeHeaders option
and provide an array of specific header names that we also want to cache from the
server; for instance, we might want to cache headers that provide metadata about
some response (e.g., number of items in a collection passed as a header from some
API, like “X-Total-Count”). By default, HTTP headers are not cached, and we have to
provide a list of headers to cache manually.
Finally, we can also provide a filter option, which will take a function that
receives the request object and return a Boolean that will indicate whether to cache
some particular request. For instance, we might want to cache responses from our
own API but not from third-party APIs like a cloud provider or others. The following is
an example of how we can do it with the filter option:
provideClientHydration(withHttpTransferCacheOptions({
filter: (req) => req.url.startsWith('https://our.api.com'),
})),
Now evidently all of these options given to the provideClientHydration() function
are only possible because of said client hydration. So let us talk about it and finally
understand what it means, how it improves performance, and why it is important to
have 

---

## Time

Figure 9.4 Angular in the client with SSR before client-side hydration
-- 251 of 306 --
232 	C HAPTER 9 Modern Angular everywhere
Largest Contentful Pain and better SEO support, but the application’s own perfor-
mance in the browser is still not great. So how can we improve this?
Enter client-side hydration. Client-side hydration is the practice of reconciling Angu-
lar and its bindings with the DOM that has been rendered on the server. Essentially,
when the server-rendered DOM arrives, Angular performs a series of clever tricks to
attach itself to the existing DOM nodes and make bindings work without destroying
and then recreating the DOM in the browser again.
This significantly improves client-side performance, user experience, and other
metrics we discussed previously. For instance, the application will become stable sooner
and users won’t see flickering screens and too many loadings. As we already saw, this
option also allows us to limit the number of unnecessary HTTP requests to the same
endpoint: when performed on the server side, the request’s response will be cached
and then just simply reused on the client side.
The best thing about hydration is that outside some (not even required) options
we already explored, it does not require anything from the developer—only to drop
provideClientHydration() in the application configuration. As this option is easy to
adopt and leads to better performance, it is good practice to always use it when doing
SSR; as we saw, Angular itself generated this new application with the client-side hydra-
tion enabled by default.
While hydration itself is a very useful feature, it has some room for improvements,
one of which is the event replay feature that was added in Angular v18. In figure 9.5 we
see that there is a time gap between “the browser renders the prepared HTML” and
“Angular binds to rendered DOM nodes.” Usually, such a time is minuscule and not
noticeable for the end user. However, if the user has a relatively slow connection, they

---

## Server

Client 	Server
Figure 9.5 Angular in the client with client-side hydration
-- 252 of 306 --
233	9.3 	Improving Angular SSR
might trigger some events on the UI (for example, click a button or input some text)
before hydration completes, and the UI actually becomes interactive. In this scenario,
these events will be lost, and the user will (and rightfully so!) think that the UI is lagging.
However, to prevent this, a new option has been introduced called event replay.
What it does is record the events that the user triggers before the completion of client-
side hydration and, when it is done, replays them in the same order, so no user inter-
action is lost. It is very simple to set up: the only thing needed is to include it when
providing client-side hydration:
provideClientHydration(withEventReplay())
Now that we have explored HTTP transfer caching and client-side hydration to
improve client-side performance, we can move forward and next discuss an option
that, this time, improves SSR itself.
9.3.3 	Prerendering
So far we have actually only created one component that the user can see: the
AppComponent (the rest were used inside it in some way), although we promised to
create two more (AboutUsComponent and SubscriptionsComponent). If we had those
components, connected to the application via defined routes, that would mean the
server would have more tasks to do. When the user enters, say, the “about-us” route, it
will have to render that component every single time. While this approach provides all
the benefits we mentioned earlier, it can be optimized even further using a technique
called prerendering.
Prerendering is the practice of rendering (mainly static) pages from Angular
applications at build time, rather than on user’s demand. This can be achieved by set-
ting a prerender option in the angular.json file. In fact, if we revisit listing 9.3 we can
see that this option is set to true. This means that if we build our application, Angular
should look into our routing system, discover what pages exist within our application,
and prerender them into static HTML, which can be served right away.
To check this, we would first need to have at least one route. For this purpose, let
us create two files in the src/app/components directory named about-us.compo-
nent.ts and subscriptions.component.ts and put these two components into them,
shown in the following two listings, respectively.
@Component({
selector: 'app-about-us',
template: `
<div class="container">
<div class="block">
<p>
<span>
HRMS is a platform that allows companies to manage their employees.
</span>
Listing 9.13 	AboutUsComponent
-- 253 of 306 --
234 	C HAPTER 9 Modern Angular everywhere
</p>
</div>
</div>
`,
standalone: true,
})
export class AboutUsComponent {}
@Component({
selector: 'app-subscriptions',
template: ` <div class="container">
<div class="block">
<p>
<span>Subscriptions</span>
</p>
</div>
</div>`,
standalone: true,
})
export class SubscriptionsComponent {}
These are of cour

---

## Time

Figure 9.6 	Server + Angular handling a direct request to a particular route
-- 259 of 306 --
240 	C HAPTER 9 Modern Angular everywhere
server.js file in the server folder and also configuring a port for the application to lis-
ten on. In the server.ts file we saw the following code:
const port = process.env['PORT'] || 4000;
const server = app();
server.listen(port, () => {
console.log(`Node Express server listening on http://localhost:${port}`);
});
Here the application will listen to requests on a port that it chooses based on an envi-
ronment variable. A cloud provider will usually provide some ports that we can set as
environment variables for this file to read and use.
Congratulations again! We are now reasonably prepared to create, configure, opti-
mize, build, and finally deploy a modern Angular application from scratch. Next, we
are going to discuss the future of Angular: the direction the framework is taking, very
experimental features that already exist in developer previews, emerging approaches,
and some mild speculations.
9.5 	Exercises for the reader
 Run the ng add @angular/ssr command on the HRMS app itself to add SSR on
it and fix any emerging problems.
 Configure environments for the HRMS application.

---

## Summary

 SSR can provide better performance and SEO for Angular applications than
classic client-side rendering.
 SSR by default runs on a Node.js server.
 Applications can now be built with SSR from scratch.
 Client-side hydration can improve the reconciliation of client-side Angular with
the DOM rendered on the server.
 HTTP transfer cache can prevent making the same HTTP call twice.
 Prerendering can be used to serve HTML documents generated at build time
to improve TTFB.
 Angular apps can now be built faster with ESBuild + Vite.
 Environments can be configured manually to support different needs like test-
ing, debugging, beta testing, and production.
 Build artifacts can be deployed in different ways depending on the scenario we
choose (CSR, static-site generation, SSR).
-- 260 of 306 --
241
What’s next in
modern Angular?
So far, almost everything we have discussed has involved stable, ready-to-use mod-
ern tools provided by the Angular team for cutting-edge solutions. Now, in this last
chapter, it is time to enter the experimental realm and discuss the direction that
the Angular framework will be taking in the near future and the features that are
currently available for us in the “developer preview” status. Let’s begin!
10.1 	New template syntax
We have already built and deployed not one but two modern Angular applications, and
now we are in the sweet period of maintaining that application. Of course, maintaining
it means following the new releases of all dependencies (framework, libraries, build
tools, and so on) and trying our best to keep our application as up-to-date as possible.

---

## This chapter covers

 New template syntax
 Built-in conditional expressions in templates
 Deferred views and advanced lazy loading of
components
 Change detection in depth
 Building zoneless applications
-- 261 of 306 --
242 	C HAPTER 10 	What’s next in modern Angular?
If we had started the HRMS application when Angular v16 was the latest version,
then by the time of this book’s release it would have already had two newer versions:
v17 and v18, which brought with them some powerful new features. In fact, we have
already discussed things from v17 in previous chapters [mainly things in relation to
server-side rendering (SSR)], but there is more to explore.
NOTE 	If you are using Angular v16 or lower, you can use the official Angular
update guide (https://update.angular.io/?v=16.0-17.0) to upgrade to v17 or
v18; otherwise, feel free to continue with this chapter.
As of v17, Angular introduced massive additions to the existing template syntax in an
effort to make it both easier to read and learn and more performant. These changes
are experimental for now; however, the changes will definitely become stable and the
go-to solutions to the problems they are addressing. All the changes are related to
conditional statements (ifs, for loops, and so on) in the template; that’s why it is also
referred to as the new control flow syntax. So let us explore these new control flow
statements and see how they transform our templates.
WARNING 	All features and approaches relevant to the template syntax
described in this chapter are experimental in v17 and are marked for developer
preview by the Angular team. In Angular v18 they are marked as stable. If
using Angular v17, we discourage using these features in production-ready
applications and encourage using them in testing or experimental applica-
tions. For versions higher than 17, please refer to the latest Angular docu-
mentation to get information on how to upgrade to those versions to be able
to use those features in production applications.
10.1.1 Goodbye ngIf!
When learning Angular, we quickly encounter the concept of structural directives—
directives that not just alter the behavior of their host elements but manipulate
entire DOM structures. Immediately we are introduced to directives like *ngFor and
*ngSwitch, but of course, the first one we usually encounter is *ngIf—the all-too-
familiar directive that empowers us to add or remove DOM elements (part of UI)
depending on some conditions.
In chapter 2 we learned that NgIf is a standalone directive now, so all we need to
do is import it into our component directly and use it. So far so good; however, this
still brings some disadvantages:
 The directive still needs to be imported.
 The directive itself has some code that will be added to our final application
bundle.
 Implementing if-else-if-else blocks can quickly become very messy.
The last point is especially painful, as it requires using ng-templates that increase the
level of nesting in our templates, are not very re

---

## We now use a new

built-in syntax @if and
curly braces to show or
hide a block of UI.
No more *ngIf on
the button itself.
No import for NgIf either;
the new statements are
built-in.

---

## The rest of the

component code is
omitted for brevity.
-- 264 of 306 --
245	10.1 	New template syntax
</button>
</header>
<dialog [open]="notificationsOpen()">
<h3>Notifications</h3>
<ul>
<li *ngFor="let notification of notifications()">
<h4>{{ notification.title }}</h4>
<span>{{ notification.message }}</span>
@if (!notification.read) {
<button (click)="markNotificationAsRead(notification)">
Mark as Read
</button>
} @else {
<span title="Notification is read">?</span>
}
</li>
</ul>
<button (click)="notificationsOpen.set(false)">Close</button>
</dialog>
With this approach, we now have a template that is more readable and easier to digest.
Also, in fact, this syntax also supports @else if statements, just like regular condi-
tional statements in JavaScript, so we can create multiple interdependent conditions.
We can also easily nest more conditional statements inside, making for high-level code
structure in the templates.
On top of this, we are still able to use the as syntax, which is handy when using the
async pipe. We use this approach with NgIf in the ProjectCardComponent we built in

---

## chapter 4 (you can find it in src/app/shared/components/project-card.component.ts),

so let us refactor it with the new syntax and use the as modifier.
@Component({
selector: 'app-project-card',
template: `
@if (project$ | async; as project) {
<div class="card">
<img
[ngSrc]="project.image"
width="100"
height="100"
loading="eager"
sizes="100vw, 50vw"
/>
<div class="card-body">
<a [routerLink]="['/work/projects', project.id]">{{
project.name }}</a>
</div>
</div>
}
`,
Listing 10.3 	@if with the as keyword
@else block is used to display content in
case a condition for @if is not satisfied.
Displays a “tick”
symbol if the
notification is read

---

## We can extract the value from

an observable via the async
pipe with an @if statement.
Note the semicolon!
-- 265 of 306 --
246 	C HAPTER 10 	What’s next in modern Angular?
imports: [AsyncPipe, RouterLink, NgOptimizedImage],
standalone: true,
})
export class ProjectCardComponent implements OnChanges {
private readonly projectService = inject(ProjectService);
@Input({ required: true }) projectId!: number;
project$: Observable<Project> | null = null;
ngOnChanges(changes: SimpleChanges): void {
if (changes['projectId']) {
this.project$ = this.projectService.getProject(this.projectId);
}
}
}
As we can see, the new syntax has the same benefits as NgIf used to have but solves
essentially all the problems the former approach had. Next, let us learn about the new
syntax for creating loops in templates and improve this component’s code even further.
10.1.2 Hello @for!
When displaying lists of data, our go-to tool for almost a decade has been the NgFor
directive. Of course, it did its job reasonably well, but it suffered from the same prob-
lems as those we discussed with NgIf in the previous section. In addition, it had the
trackBy problem, wherein, for optimization reasons, we had to provide a callback
function that allowed the directive to differentiate between DOM elements rendered
in a loop to update the UI faster. However, many Angular developers just skipped the
trackBy function, and providing it was a bit cumbersome when we had to declare a
simplistic method that essentially just returned a property of the object we were ren-
dering in a loop.
Now there is a new syntax available for rendering DOM elements in a loop, and it
not only solves the trackBy problem but also adds some new benefits. Let us refactor
the HeaderComponent even further to see the new approach.
@Component({
selector: 'app-header',
template: `
<header>
<h2>HRMS</h2>
<button (click)="notificationsOpen.set(true)" title="View Notifications">
You have {{ unreadNotifications.length }} unread notifications
</button>
</header>
<dialog [open]="notificationsOpen()">
<h3>Notifications</h3>
<ul>
@for (
Listing 10.4 	@for loops in Angular templates
-- 266 of 306 --
247	10.1 	New template syntax
notification of notifications();
track notification.id
) {
<li>
<h4>{{ notification.title }}</h4>
<span>{{ notification.message }}</span>
@if (!notification.read) {
<button (click)="markNotificationAsRead(notification)">
Mark as Read
</button>
} @else {
<span title="Notification is read">?</span>
}
</li>
}
</ul>
<button (click)="notificationsOpen.set(false)">Close</button>
</dialog>
`,
standalone: true,
})
export class HeaderComponent {
}
As we can see, providing the property by which we can track the objects rendered is
even simpler now thanks to the special syntax: we can directly point to the very prop-
erty, as we have done here by telling Angular to use the id of a notification to differen-
tiate between two notifications.
In addition, we can now choose to show some UI if the list we try to render is
empty. In this case, if the

---

## The message to

show when empty
$count represents the total
number of items in the array, and
$index represents the number of
the current iteration (starts at 0).
-- 268 of 306 --
249	10.1 	New template syntax
With this knowledge, we can now address the final control flow improvement that
allows us to choose between multiple UI blocks.
10.1.3 @switch
To dynamically choose between multiple UI items, the NgSwitch directive has been
the go-to tool for Angular developers. Yet again, it has the same problems as NgIf, and
with the new syntax, we can now ditch the directive and use a built-in approach.
In chapter 4, we worked on the CandidateDetailsComponent and had a case of
complex logic to select which child component to show in the UI. To avoid clutter in
the template, we used a method on the component itself to retrieve the reference to
the correct component and then render it dynamically in the template. However, with
the new syntax, we can refactor our component, simplify the TypeScript code, and put
the switch statement directly in the template. Let’s open the component’s file located
at src/app/pages/recruitment/candidate-details.component.ts and change it as shown
in the following listing.
@Component({
selector: 'app-candidate-details',
template: `
<div class="candidate-details">
<div>
<h2>{{ candidate.firstName }} {{ candidate.lastName }}</h2>
Table 10.1 Contextual variables in @for loops
Variable Name 	Description 	Potential use cases
$count 	Number of items in the array 	Can be used if we do not want to reference
“array.length” inside
$index 	Index of the current iteration (starts
at 0)
Can be used to pass it to component meth-
ods that need to know which item they are
working with
$first 	Boolean that indicates if the current
item is the first one in the array

---

## Can be used to dynamically apply styling to

differentiate between rows in a table, for
instance, showing some lines as they are,
and some lines as grayed out
$odd 	Boolean indicating if the current itera-
tion $index is an odd number
The same use cases apply as with $even
Listing 10.7 	Using @switch for complex template logic
-- 269 of 306 --
250 	C HAPTER 10 	What’s next in modern Angular?
<p>Email: {{ candidate.email }}</p>
<p>{{ candidate.position }}</p>
</div>
@switch (candidate.status) {
@case ('CV evaluation') {
<app-cv-evaluation [candidateId]="candidate.id" />
}
@case ('Interview preparation') {
<app-interview-preparation [candidateId]="candidate.id" />
}
@case ('Interview Feedback') {
<app-interview-feedback [candidateId]="candidate.id" />
}
@case ('Rejected') {
<app-rejection-letter [candidateId]="candidate.id" />
}
@case ('Approved') {
@if (candidate.offerAccepted) {
<app-onboarding-preparation [candidateId]="candidate.id" />
} @else {
<app-candidate-finalization [candidateId]="candidate.id" />
}
}
@default {
<span>Unknown candidate status</span>
}
}
</div>
`,
standalone: true,
imports: [
CvEvaluationComponent,
InterviewPreparationComponent,
InterviewFeedbackComponent,
RejectionLetterComponent,
OnboardingPreparationComponent,
CandidateFinalizationComponent,
],
})
export class CandidateDetailsComponent {
@Input() candidate!: Candidate;
}
As we can see, this approach greatly simplified the component, which is now just
reduced to getting a candidate object and rendering the UI, and the complex logic is
eloquently described in the template itself. And, of course, we do not need to import
NgSwitch anymore to enjoy this functionality!
WARNING 	@switch, despite looking a lot like the native switch-case block of
JavasScript, does not support fall-through and has no break statement. In cases
where this might be preferable, opt in for the usage of @if-@else if-@else
constructs instead.
@switch works just like JavaScript switch-
case construct but in an Angular template.

---

## We can easily nest blocks with

the new template syntax.
@default can optionally be used
to show a block of UI when no
condition has been matched.
-- 270 of 306 --
251	10.1 	New template syntax
One other benefit of this new template syntax is the performance improvement.
Rather than directly performing the operations at runtime via the structural direc-
tives, Angular is now capable of generating template code ahead of time in such a way
that it already incorporates these statements as native JavaScript into the application’s
flow itself.
Now that we have covered all the new template syntax options, let us discuss
migrating existing codebases to using this new approach.
10.1.4 Migrating to the new template syntax
As with other migration guides in this book, it is always possible to migrate codebases
manually, in an incremental fashion (do one migration at a time, test, deploy, repeat).
However, in this case, we also get an Angular schematic that allows us to easily migrate
(while being a bit cautious about it).
To automatically change our codebase from structural directives to the new syntax,
all we need is to ensure that our project runs Angular v17 or higher and then run the
following command:
ng generate @angular/core:control-flow
This is a specific command that will modify our templates to fully use the new syntax.
The command will prompt us to choose a directory that is to be changed (by default it
will begin from the very root of the project so conversion will affect all HTML files and
inline templates). This allows us to adopt an incremental strategy when instead of con-
verting the entire project and dealing with a big mess, we can convert only some sub-
directories, see how it goes, fix problems, maybe even deploy, and then address
another subdirectory, and so on until the entire project is converted.
WARNING 	The schematic will only affect HTML files and inline templates.
We will still need to manually remove imports for NgFor, NgIf, and NgSwitch
directives.
While the semantic works impressively well, on larger projects we still need to verify that
the correct fixes have been applied. One easy tip for this can be to initially search for ref-
erences to *ngIf in the codebase, remember the count, and then, after the schematic
runs, search for references of the @if keyword to verify those counts are the same.
TIP 	As the @for syntax requires a track modifier, if a trackBy function was
not provided for an NgFor directive, the schematic will automatically put the
reference to the object itself as a tracking item. This is not very useful, so a
good practice would be to run through @for instances and provide more
meaningful properties for tracking, for instance “item.id.”
Because the process is automatic, it is also important to perform some regression test-
ing to figure out if new bugs have not emerged. If the project has unit tests, it is very
important to run them first to try to catch new bugs. It is worth noting that if the tests
-- 271 of 306 --
252 	C HAPTER 10 	What

---

## Notice we still import the component in the

component’s metadata; Angular will then
use the @defer keyword to determine in
what bundle to include and load a
particular component.
-- 273 of 306 --
254 	C HAPTER 10 	What’s next in modern Angular?
this page. But previously, this component used to be loaded dynamically, when the
user clicked on the Delete button. Now let us see how we can achieve this with the
new keyword.
10.2.2 Deferring depending on a condition or trigger
There are actually two ways of achieving this in our case. Let’s first see how we can do
it with a Boolean.
<h2>Employee List</h2>
<table>
<thead>
<tr>
<th>Full Name</th>
<th>Position</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
<tr *ngFor="let employee of employees$ | async">
<td>
<img [ngSrc]="employee.profilePicture" width="20" height="20" />
<a [routerLink]="['/employees/details', employee.id]">
{{ employee.firstName }} {{ employee.lastName }}
</a>
</td>
<td appTruncate [limit]="10">{{ employee.position }}</td>
<td>
<button (click)="isConfirmationOpen = true">

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
@defer (when isConfirmationOpen) {
<app-confirmation-dialog [isConfirmationOpen]="isConfirmationOpen" />
}
WARNING 	Defer-loading conditionally with a Boolean only works one time,
and if the Boolean becomes false again in the future, the component will not
disappear; if we want it to be removed in that case, we will need to use a com-
bination of @defer and @if.
This solves our problem, but here we have to rely on a Boolean, meaning, in this case,
some other functionality has to change it, making the connection somewhat indirect.
Thankfully, Angular provides a way of achieving this directly.
Listing 10.9 	Deferring a component until a condition is satisfied

---

## The when keyword

is used to indicate
that the block
needs to be loaded
when the condition
becomes true.
-- 274 of 306 --
255	10.2 	Deferrable views
<h2>Employee List</h2>
<table>
<thead>
<tr>
<th>Full Name</th>
<th>Position</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
<tr *ngFor="let employee of employees$ | async">
<td>
<img [ngSrc]="employee.profilePicture" width="20" height="20" />
<a [routerLink]="['/employees/details', employee.id]">
{{ employee.firstName }} {{ employee.lastName }}
</a>
</td>
<td appTruncate [limit]="10">{{ employee.position }}</td>
<td>
<button (click)="isConfirmationOpen = true" #deleteButton>

---

## Delete

</button>
@defer (on interaction(deleteButton)) {
<app-confirmation-dialog
[isConfirmationOpen]="isConfirmationOpen"
/>
}
</td>
</tr>
</tbody>
</table>
The interaction option here helps define an event, which will trigger Angular to
load the deferred component. Interaction in this context for Angular means either a
click event or a keydown event. A hover event can also be specified instead to load the
component when the Delete button is hovered.
Another popular scenario could be loading a component when the page is scrolled
so far that it should become visible, a scenario that is usually referred to as “entering
the viewport.” Angular now provides a way of doing this directly with the defer block.
To see this, let’s entertain the following scenario: in chapter 4, we built a Footer-
Component (you can find it at src/app/shared/components/footer.component.ts),
which displays some information about the HRMS application. If we want to super-
charge our application’s performance, we might consider deferring its loading up
until the point when the user actually scrolls down to see the footer. The following list-
ing shows how we can accomplish it in the AppComponent.
Listing 10.10 	Deferring a component until a UI interaction

---

## We put a

template variable
on the delete
button so we can
reference it later
to load the
component when
it is clicked.

---

## The on keyword allows specifying

events for when to start the deferred
loading; in this case, we specify that
it should load when the delete
button is interacted with.
-- 275 of 306 --
256 	C HAPTER 10 	What’s next in modern Angular?
<app-header/>
<router-outlet></router-outlet>
@defer (on viewport) {
<app-footer/>
}
However, if we do it just like this, we will get the following error:
"viewport" trigger with no parameters can only be placed on an @defer that
has a @placeholder block
If we think about this error, it makes perfect sense: we mention the component com-
ing into the viewport, but the component is not even loaded: it obviously is not in the
viewport! So how can Angular know the user scrolled this far and it is time to load the
component? We have two options: either we provide an argument to the viewport trig-
ger as we did with the interaction trigger, or we provide a special @placeholder block,
which will be displayed before the deferred component loads and replaces it. Now
when this placeholder block comes into the viewport, it will trigger the loading of the
component.
<app-header/>
<router-outlet></router-outlet>
@defer (on viewport) {
<app-footer/>
} @placeholder {
<div>Footer</div>
}
This provides us with a high level of flexibility in choosing our scenarios for deferred
loading. We will talk more about other defer blocks (there are more than just @place-
holder) in the next section when we explore very custom scenarios. For now, let’s
finalize our knowledge of deferred loading triggers with table 10.2, which illustrates
all the possible triggers.
Listing 10.11 	Deferring a component until it is in the viewport
Listing 10.12 	Deferring a component with a placeholder
Table 10.2 Triggers for deferred loading
Trigger Name 	Description 	Potential use cases
on idle 	Will trigger loading when the application
becomes idle (no animations, painting,
and current HTTP requests). Uses the
requestIdleCallback API (https://
mng.bz/q0KN) under the hood. This is
the default behavior.

---

## Can be used to simply defer the loading of

some components to reduce the final bun-
dle. For example, we can defer large but
not very important components near the
application root so that they load when
possible but do not block the main func-
tionality of the application.

---

## The placeholder content to

show before the deferred
component is loaded
We display the “Footer” text, which will
be then replaced by the actual footer.
-- 276 of 306 --
257	10.2 	Deferrable views
Now that we have explored all the possible triggers and conditions for deferred load-
ing, we can dive even deeper and make the best possible user experience for people
using the application.
10.2.3 Customizing deferred loading
There are several ways of improving the UX when using deferred loading, which
means covering two important scenarios: handling different loading scenarios and
prefetching. Let us explore both.
LOADING AND E RROR STATES
We already explored the @placeholder block, which allowed us to display some con-
tent before it is replaced with the actual deferred component. We can, however, add
further blocks to display some UI when the loading is in process and also display some
fallback content when the deferred loading has failed (for instance, the user got dis-
connected from the internet while loading). This can be achieved with two blocks
with pretty telling names.
<app-header/>
<router-outlet></router-outlet>
on viewport 	Loads when the placeholder content
enters the browser’s viewport. Can also be
used with another element provided via an
argument. Uses the Intersection-
Observer API (https://mng.bz/75oV)
under the hood.

---

## Can be used to load components far from

the top of the pages dynamically, as we
did with the FooterComponent.
on interaction 	Loads when the placeholder content is
interacted with (click, keydown). Can also
be used with another element provided via
an argument.

---

## Can be used to simply reduce the bundle

size for some heavy components that are
needed anyway.
on timer 	Loads when the indicated timespan has
elapsed. Accepts time in milliseconds or
seconds [on timer (500 ms) or on
timer (2 s)].
Can be used to apply time-related logic to
deferred loading; for instance, we can
choose to wait a while before loading a
component that is in the viewport but
does not depend on an external trigger
and is not too important to load right away.
Listing 10.13 	Deferring a component with error/loading
Table 10.2 Triggers for deferred loading (continued)
Trigger Name 	Description 	Potential use cases
-- 277 of 306 --
258 	C HAPTER 10 	What’s next in modern Angular?
@defer (on viewport) {
<app-footer/>
} @placeholder {
<div>Footer</div>
} @loading {
<div>Loading...</div>
} @error {
<div>An error occurred when trying to display the application's
footer</div>
}
Now, having provided the users with detailed messages about the loading of the com-
ponents, let us try to customize the loading process itself.
P REFETCHING
To understand this concept better, let’s again explore the FooterComponent’s loading.
At this point, we have deferred its loading to the moment when the user scrolls down
to the placeholder; however, this might not be the best strategy in terms of UX. This
means the user will always have to see the placeholder first (especially on a slow con-
nection), and if this component is something that we always want present (we have no
other conditions for its loading), then it might make sense to defer its loading but
start the loading anyway under the hood after some time.
This strategy is known as prefetching, and the @defer block also provides instru-
ments to add it to our deferred loading flow. For instance, we can signify that we want to
load the component either when the placeholder enters the viewport or after a given
amount of time regardless of user interactions. This means that the component will be
defer-loaded, but if the user scrolls to the footer later, they will see the component itself
already and not the placeholder. This can be achieved by one simple modifier.
<app-header/>
<router-outlet></router-outlet>
@defer (on viewport; prefetch on timer(2s)) {
<app-footer/>
} @placeholder {
<div>Footer</div>
} @loading {
<div>Loading...</div>
} @error {
<div>An error occurred when trying to display the application's
footer</div>
}
Now with a single, simple command we added prefetching and maximized our UX
improvements; let us also note that everything we did in this section we did in the tem-
plate, without any code added to the component’s code itself. Such is the power of the
@defer block.
Listing 10.14 	Prefetching of a component with timer

---

## Prefetch trigger added

to the defer clause
-- 278 of 306 --
259	10.3 	Zoneless Angular applications
TIP 	We can use both on and when clauses with prefetch and apply any of the
triggers listed in table 10.2
As we close in on our learning journey of the latest features already available (at least
for developer preview), it is now time to venture into the unexplored territory of mas-
sive performance optimizations that are planned to arrive in Angular that may finally
make us able to ditch Zone.js. So next let us consider what Zone.js is, why we want to
get rid of it, and what Angular might look like without it.
10.3 	Zoneless Angular applications
One of the most important Angular-related concepts that we have touched on very little
so far is change detection. We have referenced it once or twice (mainly in chapters related
to signals), but in general, for an Angular developer who has not dived too deep under
its hood, change detection is a mysterious engine that makes Angular’s magic work. So,
in this section, let’s explore what change detection is, how it works, how it is intercon-
nected with Zone.js, and how we (and the Angular team!) want to improve it.
10.3.1 How change detection works in Angular
First and foremost, let us begin with the very concept itself to understand what it
means and why we need it. Let’s begin by examining (or maybe re-examining) how
frontend applications work so that we can figure out where the change detection
comes in the grand scheme of things.
WHAT IS CHANGE DETECTION?
In chapter 5, we presented a simple diagram that explained the relation between the
three core components of any frontend application (figure 5.1): the application state,
events, and the UI itself. Next we explained that the state is used to render the UI, UI
can send events, and event handlers can modify the state to rerender the UI again,
and so on. We did this in the context of RxJS + Angular; however, we did not focus too
much attention on the fact that this process works the same way even without RxJS.
Consider the following code:
@Component({
selector: 'app-some-component',
template: `
<p>{{name}}</p>
<button (click)="name = 'Alex'">Change name</button>
`,
standalone: true,
})
export class SomeComponent {
name = 'John';
}
Of course, we don’t have to have years of experience to understand that an Angular
component like this one will first display the name “John” and then, when the button
-- 279 of 306 --
260 	C HAPTER 10 	What’s next in modern Angular?
is clicked, display the name “Alex”. But we didn’t use any reactivity like RxJS or signals,
so how does Angular know that the name property has changed and the UI needs to
be updated?
Here is where change detection comes in. When the state is updated, Angular
checks the bindings that we have in a given component and applies changes to the UI.
In the previous example, we have binding in the template {{name}}, which Angular
will check, see that the name has changed, and apply the new name. Figure 10.1 is a
revised version o

---

## Change

dedication
Figure 10.1 Change detection’s role
in the life cycle of a component
-- 280 of 306 --
261	10.3 	Zoneless Angular applications
zone, we can easily track asynchronous events happening in that context and react to
things that we haven’t even explicitly subscribed to. Zone.js accomplishes this by mon-
key-patching the browser’s async-related APIs (like promises and others) and notifying
about events within a zone.
Angular uses Zone.js heavily for the purpose of change detection. What essentially
happens is the entire Angular application runs inside a zone, and we can react to asyn-
chronous events and perform change detection (it is more complex than this, but for
the purpose of this chapter, it is good enough to understand change detection).
What Angular then does is listen to Zone.js, receive notifications, and start perform-
ing change detection each time there has been such a notification. It is very important
to note that regardless of where the notification originated, Angular will perform a
checking top-down, meaning it will start from the very root component and change
detect every single component in our application. Figure 10.2 visualizes that process.
From the diagram alone we can see some problems with this process, but Zone.js-
based change detection has worked relatively well for Angular applications so far, so
let us spend some time discussing the problems that exist within this implementation
and see what a working solution to those problems must entail.
Parent–child relation between
components

---

## Propagation of change detection

B	A 	C
F
K
G	D 	E 	H
L
I
Angular starts change detection from the root component.
User clicked a button in component D.
Zone.js receives the noti cation about the click.	fi
AppComponent
Figure 10.2 Single iteration of change detection
-- 281 of 306 --
262 	C HAPTER 10 	What’s next in modern Angular?
10.3.2 Why change detection in Angular needs to improve
The process we just described can seem like a bit of overkill if we consider the magni-
tude of checking that Angular might perform on a sizable application. What’s worse is
that all those checks are performed in an “erratic” fashion; Angular often has no idea
whether a change really happened but has to check the view anyway because Zone.js
has notified it that an async event has happened; whether the event handler resulted
in some relevant state change is yet to be seen. This means additional load on the run-
time, unnecessary pollution of memory, and potentially race conditions—situations
where something depends on another thing being executed previously but that other
thing fails to execute.
Another concern is the checking itself; because Angular also reacts to changes to
deeply nested properties inside objects, this means that the algorithm might have to
perform a very long and deep introspection of multiple large objects (and, as per the
previous point, this might still be for nothing!), resulting in poorer performances and
a delay to the actual update of the UI (which is the only thing we care about at the end
of the day).
Next there is the problem with calling functions in templates. Consider this simple
Angular code:
@Component({
selector: 'app-root',
standalone: true,
template: `
<p (click)="handle()">{{ fullName() }}</p>
`,
})
export class App {
firstName = 'John';
lastName = 'Doe';
fullName() {
console.log('This function has been called');
return `${this.firstName} ${this.lastName}`;
}
handle() {}
}
Here we use a function to combine the first and last name, and while it works, we can
notice the function is being called multiple times. This is because Angular has no way
of determining if the return value of a function has changed without calling it, mean-
ing it will call the fullName function on every change detection cycle. Because change
detection is triggered on async events, clicking on the full name in the UI will result in
new multiple calls to the fullName function, despite the fact that the handle function
is literally empty and can’t possibly modify the value of the full name. This is why we
have pipes in Angular—mainly to overcome such change detection problems (more
on that later).
-- 282 of 306 --
263	10.3 	Zoneless Angular applications
Finally, Zone.js itself is a bit of a problem: it adds to our final bundle, and because
it is how change detection functions, it means the user has to download it and execute
it, and only then will the application function properly, resulting in a pretty poor time-
to-interactive metric.
So far, we have established a number of problems with 

---

## Propagation of change detection

Angular checks only the ancestor of D.
Figure 10.3 Change detection when a component is marked OnPush
-- 284 of 306 --
265	10.3 	Zoneless Angular applications
component, the first name will get instantly updated. To have updates immediately
from the parent, we can simply change the logic of changing the first name to change
the entire reference of the object:
this.user = {...this.user, firstName: 'Alex'};
The OnPush strategy, as we can see, offers some improvement over the default change
detection; in large applications, it might make sense to mark the heaviest, most inter-
active components as OnPush to cut down the amount of unnecessary change detec-
tion cycles at runtime. Some teams go so far as to make all components OnPush to
enjoy the best runtime performance.
However, the OnPush strategy is not something new in and of itself; so what changed
in more recent versions of Angular? Having the necessary knowledge of change detec-
tion, we can now discuss the new benefits and some upcoming approaches that will fur-
ther optimize the process of updating the UI in Angular applications.
10.3.4 Introducing granular change detection
In this section, we will discuss two new concepts that have become possible with the
advance of signals in Angular. One approach already exists and does not require any
particular changes, and the other is an overhaul of how we think about Angular
change detection and might possibly help us ditch Zone.js for good.
LOCAL CHANGE DETECTION
So far we have discussed the OnPush strategy with the usual Angular components,
which has simple properties for which Angular could not possibly automatically learn
about their updates (hence the need for Zone.js and all that). However, a massive
game-changer landed in v16, which we discussed extensively: the signals. While signals
are wrappers around the same values we stored as simple properties previously, they
also have the massive advantage of being able to tell Angular about their own updates,
meaning they can potentially result in us not needing Zone.js anymore (more about
that in the next section).
While this prospect is still looming in the future, right now we already can enjoy
some of the benefits of signals in regard to change detection. Here we are referring to
a concept added in Angular v17 known as local change detection. Essentially, now if we
mark our component with OnPush, and use only signals, then those signal changes will
update the UI but will not trigger change detection for parent components (if they are
also OnPush).
This update is both a massive improvement in performance and also easy to adopt.
We can iteratively bring our components to this state to be able to enjoy runtime opti-
mization while not disrupting the logic of our applications. All we need is to adopt the
“all components should be OnPush” strategy, and with time the entire application will
be OnPush. The approach of using signals exclusively can also bring us closer to the
zoneless future, which we w

---

## Using signal inputs

and built-in control
flow allows us to only
import other
components instead
of NgIf, AsyncPipe,
NgFor, and so on.
“id” is now a signal
input with a default
null value, and
incoming string values
get transformed into
numbers. TypeScript
automatically infers
the type.
Next, we can create an
observable for the HTTP
call that will retrieve the
project details and
convert it to a signal to
use in the template.

---

## We convert the

“id” input signal
to an observable
to perform an
HTTP call.
We switch the observable of “id” to the
Observable of the HTTP call that will then
get converted back to a signal.
-- 287 of 306 --
268 	C HAPTER 10 	What’s next in modern Angular?
switchMap(id => this.projectService.getProject(id))
)
);
The parameters object (the one we passed the transform attribute to) also accepts the
alias option from the @Input decorator, making signal inputs equivalent in function-
ality to the decorator input, with the distinction of only producing signals.
NOTE 	While conventional input properties allow us to modify their values in
the child component, signal inputs disallow this, and they do not have set or
update methods, so their only source of new data is the parent component.
Be careful when refactoring to use signal inputs.
Now a sensible question arises: what about outputs? Of course, outputs are event emit-
ters and do not store data, so they are not signals. However, for the sake of consistency,
the Angular team introduced a function for creating output properties instead of rely-
ing on the @Output decorator. Let’s see it in action next.
S IGNAL OUTPUTS
In chapter 4, listing 4.4, we created a FileUploadComponent (src/app/shared/compo-
nents/file-upload.component.ts) to explore transforming inputs. It also had an output
named selected, which transferred the FileList of the files that the user had selected.
Of course, this is a prime candidate for refactoring both its inputs and outputs. We will
use the new output function, introduced in Angular v17.3, to achieve this.
import { Component, input, output } from '@angular/core';
@Component({
selector: 'app-file-upload',
template: `
<div class="file-upload">
<label for="upload">{{ label }}</label>
<input type="file" id="upload" (change)="onFileSelected($event)" />
@if (errorMessage) {
<span class="error">
{{ errorMessage }}
Only following file types are permitted:
<ul>
@for (let type of accept(); track type) {
<li>{{ type }}</li>
}
</ul>
</span>
}
</div>
`,
standalone: true,
})
Listing 10.16 	Component using signal outputs
“accept” is now
a signal input.
-- 288 of 306 --
269	10.3 	Zoneless Angular applications
export class FileUploadComponent {
label = input.required<string>();
accept = input([], { transform: (value: string) => value.split(',') });
selected = output<FileList>();
errorMessage = '';
onFileSelected(event: any) {
const files: FileList = event.target.files;
this.errorMessage = Array.from(files).every((f) =>
this.accept().includes(f.type)
)
? ''
: 'Invalid file type';
if (this.errorMessage === '') {
this.selected.emit(files);
}
}
}
As we can see, this change is mainly cosmetic and does not break anything; all code
and logic for component intercommunication remains the same. However, we do
have an edge case. It might not be very popular, but with the @Output decorator, it is
possible to turn any observable into a vehicle for sending events to the parent compo-
nent, not just the EventEmitter. To do

---

## Nothing changes in the syntax of sending

an event to the parent component; we
just call “selected.emit()”.
-- 289 of 306 --
270 	C HAPTER 10 	What’s next in modern Angular?
So now we can say that we have achieved both parent-to-child and child-to-parent
component intercommunication separately. But what about the cases when we want
both combined—the approach that is better known as two-way binding? Let’s explore
what modern Angular has to offer.
MODEL PROPERTIES
In the past, to create a two-way binding we had to create a pairing of @Input/@Output
properties with a clever syntactic trick (naming the @Output the same name as the @Input
but suffixed with “Change”). A two-way binding looked a lot like the following code:
@Input() property: string;
@Output() propertyChange = new EventEmitter<string>();
This way, in the templates that used this component, we could take advantage of the
Angular template’s syntactic sugar and do the following:
<app-component [(property)]="someProperty"/>
However, with signals, this becomes irrelevant, and a new way of creating two-way
bindings has been added in Angular v17.2, which is the model signal. To define a
model signal, we just need to use the model function:
property = model();
This will create a signal that is also an input, and every time its value changes, it will
emit that new value to the parent component as if it were an output. This means we
can just bind to it in templates just the same way we did in the previous example with
a “traditional” two-way binding.
Finally, before we go on to signal-based components, we have one last thing to discuss.
S IGNAL - BASED V IEW CHILDREN AND C ONTENT C HILDREN
As we know, sometimes we need to grab a reference to some HTML elements (or
other components) from a given component’s template. This is usually accomplished
via @ViewChild and @ContentChild (if the elements we seek are inside the content pro-
jected via <ng-content>) or their plural counterparts (@ViewChildren and @Content-
Children) in case we want to get multiple elements/components. From the previous
few subsections, it becomes evident that Angular is moving away from decorators and
toward signal-based functions. The same scenario is playing out here as in Angular
v17.3: functions with similar names have been introduced to replace the aforemen-
tioned decorators:
@ViewChild('container') containerDiv: ElementRef<HTMLDivElement>;
Instead of doing this, we can use the much simpler viewChild function:
containerDiv = viewChild<ElementRef<HTMLDivElement>>('container');
-- 290 of 306 --
271	10.3 	Zoneless Angular applications
Notice that while this looks purely cosmetic to just remove the decorators, in this case
we won’t just get an ElementRef but a signal of ElementRef. This means we can create
computed signals from view children and also apply effects with them as tracked
dependencies. This becomes especially useful with viewChildren, which now lets us
know when new elements have been added to the QueryList and when some have
been removed. This was pre

---

## Binds to a signal in a

two-way fashion
-- 292 of 306 --
273	10.3 	Zoneless Angular applications
export class App {
private readonly productService = inject(ProductService);
type = input<number>();
query = signal('');
allProducts = computed(() =>
this.productService.getProductsByType(this.type()));
filteredProducts = computed(() => {
return this.allProducts.filter(product =>
product.name.includes(this.query()))
});
}
As we can see, with this approach, we can describe quite complex interfaces and rela-
tions in a declarative and eloquent fashion, without the need to even write methods,
and enjoy the benefits of zoneless change detection.
WARNING 	All the features mentioned in this section are hypothetical and not
available as of Angular v17. They have been proposed by the Angular team
and will almost certainly undergo changes until they become publicly avail-
able. Read more in the Angular signals RFC (https://mng.bz/mRYy) on signal-
based components.
Finally, another aspect of existing Angular projects that might be affected is the pipes.
Pipes have been historically used to circumvent a limitation of zone-based change
detection, that being the inability (or rather it not being welcomed) of invoking func-
tions in templates. However, with zoneless change detection and the advancement of
the inject function, pipes might no longer be necessary to reuse pieces of logic within
different templates.
Next, let us discuss the most concrete advancement in the Angular change detec-
tion story, which we can already try out in v18: the new change detection scheduler
that allows us to (experimentally) go zoneless right now.
10.3.5 Zoneless scheduler for change detection
Now that we understand Zone.js and the internal mechanisms of change detection,
we can notice that zones act as schedulers for change detection, rather than perform-
ing the change detection itself (which is still a function of Angular and will not
change or go away even with the zoneless approach).
It logically follows that, to go zoneless, Angular first needs to introduce another
scheduling mechanism. This has been successfully achieved in v18. Starting from this
version, under the hood, Angular will actually employ two mechanisms at once: the
conventional zone-based scheduler and the new zoneless one in parallel. This new
scheduler will start change detection cycles depending only on some particular events
 ChangeDetectorRef.markForCheck—This is the method that is used by the
async pipe to trigger change detection.
 ComponentRef.setInput—We used this previously to pass on changed inputs to
dynamically render child components.

---

## Computed

signal derived
from an HTTP
call observable	Computed signal filtering
products based on user’s input
-- 293 of 306 --
274 	C HAPTER 10 	What’s next in modern Angular?
 Changing a value of a signal that is used in a template.
 Event listener callbacks.
 Attaching new views that are already dirty (as a result of one of the previous points).
As we can see, these requirements mean that if we had to turn off zone-based change
detection, the only way of triggering change detection (and consequently updates to
the UI) is either by using observables/signals or manually. However, we should again
note that, currently, this new scheduler works in parallel to Zone.js, meaning nothing
is going to break if we upgrade an existing application to v18.
We can try out a completely zoneless experience by simply enabling experimental
zoneless support with a simple function in the application configuration (the app.con-
fig.ts file at the root of the project):
bootstrapApplication(AppComponent, {providers: [
provideExperimentalZonelessChangeDetection(),
]});
As we can see, the function name itself contains the word “experimental,” which
should act as a hint for us to avoid moving such changes into production-ready appli-
cations, as this will fully disable Zone.js and might very possibly result in bugs until we
change our application in ways that fully conform to the list of requirements men-
tioned previously. However, this should not discourage us from starting early and
adopting these requirements to be ready for a fully zoneless future.
P REPARING FOR ZONELESS
Outside of the points we mentioned earlier, there are some other ways in which we
can inadvertently become reliant on Zone.js, and that is mainly through the NgZone
injectable. This injectable provides functions to work with Zone.js through an Angu-
lar wrapper, and some of those functions are not compatible with zoneless. These
functions are NgZone.onMicrotaskEmpty, NgZone.onUnstable, NgZone.isStable, and
NgZone.onStable. If we are using any of these functions in our application, we must
start by removing references to them, as the tasks performed by them will become
unnecessary with zoneless. It is also important to note that NgZone.run and
NgZone.runOutsideAngular are zoneless-compatible and there is no need to remove
references to them. Thankfully, most common Angular applications (especially enter-
prise ones) very rarely use these functions; the most widely used is runOutsideAngular
anyway, so this step should be relatively easy for most Angular developers.
Another step to consider is to make sure our server-side functionality stays intact.
The way that Angular SSR works is that it essentially emulates the rendering process
that happens on the frontend (with HTTP calls and everything else) and then con-
verts the results to HTML to send back to the client in a process called serialization.
To know when the app is ready to be serialized, Angular SSR internally relies on
Zone.js to know when the app i

---

## Summary

 Angular introduced a built-in template syntax for control flow.
 Instead of structural directives like NgIf, NgFor, and NgSwitch we can now use
@if, @for, and @switch.
 From v17, it is possible to lazy-load standalone components directly from the
template with @defer.
 Deferred loading can be customized to show a placeholder, loader content, and
error content.
 Deferred loading can be enhanced with prefetching and specific loading triggers.
 Angular is making steps toward a zoneless future.
 OnPush components that use signals will now benefit from more optimized local
change detection.
 Angular has introduced a new documentation website and a road map for amaz-
ing future improvements.
-- 296 of 306 --
277
index

---

## Symbols

?? operator 72
A
afterNextRender function
226–227
afterRender function 226–227
AI-powered tools 204–209
ChatGPT 204–208
GitHub Copilot 208–209
comments 209
explicit typing 208
spec names 209
alias option 268
allowSignalWrites option 145
Angular 1
applications 5–6
configuring environments
for Angular applications
237
CSR 238
ESBuild and Vite 236
overview of 236
preparing to deploy
238–240
prerendered static
websites 239
SSR 240
building 235–240
building components in SSR
Angular application 223
core features of 3
change detection 5
DI (dependency
injection) 4
module-based
architecture 4
OOP (object-oriented
programming) 4
RxJS 4
evolution of 11
features of 11–16
better compatibility with
RxJS 15
deferred loading of parts
of a template 15
developer experience
improvements 16
directive composition
API 15
inject function 15
new template syntax 15
new tools for unit
testing 16
server-side rendering
hydration 16
signals 15
standalone building
blocks 14
type-safe reactive forms 15
various granular improve-
ments to
performance 16
future of 16, 241, 275
goals of 13
ease of adoption 13
improved reactivity 14
improved type safety 14
increased composability/
reusability 13
reduced boilerplate code 14
knowledge required before
getting started 2
learning process 18
overview of 3
recognizing problems 12
signals
computed 138–143
testing components 185
zoneless applications 259
Angular apps, building with SSR
from scratch 218
Angular CLI, overview of 7
@angular/core/rxjs-interop
package 269
AppComponent 167, 215
AppComponent class 183
ApplicationConfig interface 10
<app-root> element 222
apps, starting 7–11
changes in 9–11
creating new project 8
using Angular CLI 7
as any type-casting
command 144
asReadonly method 158
async keyword 105
async pipe 127
AuthGuard 62–64
AuthService 32, 56, 194
-- 297 of 306 --
INDEX	278
B
beforeEach block 187
BehaviorSubjects 173
bootstrapApplication
function 11, 33
bugs, earlier detection of 180
building blocks of Angular
74
host directives 88–92
extending existing
directives 88
hierarchy and execution
order 91
performance concerns 91
usage specifics 90
using multiple directives
and adding inputs 89
inputs 75
transforming input values
78
type-safe reactive forms
92–96
form events 96
migrating to 95
overview of 93
pitfalls of 94
untyped forms 92
C
CanActivateFn function 68, 72
CanActivateFn type 63
canActivate method 62–63
CandidateDetailsComponent
249
CDNs (content delivery
networks) 99, 213
change detection 5
See also zoneless Angular appli-
cations
ChangeDetectionStrategy
.OnPush 263
ChatGPT 204–208
generating unit tests 206
mocking data 204
mocking dependencies 205
circular dependencies 24
handling 45
classes, injecting dependencies
outside 56–58
click event 255
client-side hydration 231–233
client-side rendering (CSR) 238
combineLatest operator
129–130, 140
CommonModule 21, 29
compilation context 22
compile-time 91
components
building with signals
135–138
handling signals in
components 137
TimeOffComponent
135–137
creating, sta

---

## Zoneless applications

271–273
signal-based ViewChildren
and ContentChildren
270
signal inputs 266–268
signal outputs 268–270
zoneless scheduler for
change detection
273–275
-- 304 of 306 --
Important parameters for creating a new Angular project
Parameter 	Description Default
value
--strict 	Enables strict type-checking in both templates and TypeScript files 	True
--inline-
template
Makes component templates inline by default. With the rise of stand-
alone components, this approach has become very popular. Throughout
the book, we will show whole components with inline templates to
ensure maximum readability, but this is not considered either a good or
bad practice and depends on developer preference.

---

## False

--package-
manager
Allows us to select which package manager to use (if we do not like npm
for whatever reason) in the project. Angular CLI commands like ng add
or ng update will use this option under the hood to install and update
dependencies. We will stick to the default in this book, but you are wel-
come to explore other options.
npm
--standalone 	This option is the most important for us, as it creates an application
without NgModules by default, as it does with modern-day Angular apps.
We will use this one outright.

---

## False

-- 305 of 306 --
Armen Vardanyan
Modern web applications have to handle serious chall-
enges, such as complex state management, reactive
programming, and SEO. With a host of new features,
ecosystem tools, and programming practices, the Angular web
framework tackles modern web development head on. If you
haven’t tried modern Angular, you’re in for a treat!
Modern Angular updates your web development skills to take
advantage of new Angular features like signals, server-side ren-
dering, and zoneless change detection. Each chapter explores
an exciting capability by adding it hands-on to a full-featured
app for managing HR systems. Along the way, you’ll explore
dependency injection, Rx JS , and standalone components, and
pick up techniques for upgrading legacy apps.
What’s Inside
● Advanced testing strategies
● RxJS and custom operators
● Performance and search engine optimization
● Migrate legacy Angular projects
For experienced Angular developers. Covers Angular versions
12 and later.
Armen Vardanyan is a developer, educator, and Google Deve-
loper Expert for Angular. He writes articles about Angular,
TypeScript, NgRx, and is a panelist for the popular Adventures
in Angular podcast.
For print book owners, all digital formats are free:
https://www.manning.com/freebook
Modern Angular
SOFTWARE DEVELOPMENT
M A N N I N G
“ Th e best and most up-to
-date Angular book on
the market!
”—Lars Gyrup Brink Nielsen,
Angular Hero of Education,
Co-founder of This is Angular
“ Sheds light on the essence of
what makes Angular great. ”—Peter Szabo, AgileWare
“ Th e best source you can find
today for staying at the forefront
of web development. ”—Enrique Carro García
GMV Aerospace and Defence
“ Whether you’re an
experienced developer or
a newcomer, this book is your
ultimate guide!
”—Daniel Glejzner, founder of
Angular Space, Nx Champion
ISBN-13: 978-1-63343-692-3

---

