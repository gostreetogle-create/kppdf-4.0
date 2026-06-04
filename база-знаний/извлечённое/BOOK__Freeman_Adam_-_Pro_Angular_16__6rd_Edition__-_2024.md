# Freeman Adam - Pro Angular 16, 6rd Edition  - 2024

> **Источник:** Freeman Adam - Pro Angular 16, 6rd Edition  - 2024
> **Дата извлечения:** 2026-06-03
> **Концепции:** signals, computed-signals, effects, signal-forms, control-flow, di, routing, http, rxjs, pipes, components, templates, testing, i18n, animations, performance, modules, model-inputs, advanced-components
> **Размер текста:** 1444174 символов

---

## Chapter 29 Angular unit testing 807

index 	832
-- 6 of 848 --
vi
preface
Thank you for purchasing Pro Angular 16. This is the 6th edition of this book, and the first to be
published by Manning, and I am delighted that it is ready for the publication.
Angular has become one of the most popular web application frameworks by balancing
innovation with stability and consistency. After a turbulent transition from the original AngularJS,
the Angular of recent years has been focused on providing a robust set of features that have
evolved gradually.
Angular 16 introduces signals, which alters the way that changes in data are detected. This
book explains how signals work and demonstrates their use, setting the foundation for the next
generation of Angular functionality that will be in Angular 17.
My goal is that you will become familiar with every important Angular feature and be equipped
to choose the ones that best suit your projects. I appreciate feedback and you can raise issues
and ask questions using liveBook Discussion forum or using the email address given in the book.
-- 7 of 848 --
vii
about this book
This book is for experienced web developers who are new to Angular. It doesn’t explain the
basics of web applications or programming. I don’t describe server-side development in any
detail—see my other books if you want to create the back-end services required to support
Angular applications.
2.1 	How this book is organized—a roadmap
This book is divided into three parts, each of which delves into a set of related topics.
In Part 1, titled "Getting started with Angular," you'll find all the information you need to
prepare for the rest of the book. It includes primers and refreshers for critical technologies such
as HTML and TypeScript, which is a superset of JavaScript used in Angular development.
Additionally, you'll learn how to build your first Angular application and take a step-by-step
approach to building a more realistic application called SportsStore.
Part 2 of the book, "Angular in detail," covers the building blocks provided by Angular for
creating applications. You'll work through each of these in turn and learn about Angular's built-
in functionality, as well as endless customization options.
Finally, in Part 3, "Advanced Angular features," you'll discover how to use advanced features
to create more complex and scalable applications. You'll learn how to make asynchronous HTTP
requests in an Angular application and explore other advanced features.
2.2 	About the code
This book contains many examples of source code both in numbered listings and in line with
normal text. In both cases, source code is formatted in a fixed-width font like this to
separate it from ordinary text. Sometimes code is also in bold to highlight code that has
changed from previous steps in the chapter, such as when a new feature adds to an existing line
of code.
In many cases, the original source code has been reformatted; we’ve added line breaks and
reworked indentation to accommodate the available pa

---

## This chapter covers

▪ 	Understanding the purpose of Angular
▪ 	Understanding the contents of this book.
▪ 	Reporting errors in this book.
▪ 	Contacting the author.
Angular taps into some of the best aspects of server-side development and uses them to
enhance HTML in the browser, creating a foundation that makes building rich applications
simpler and easier. Angular applications are built around a clear design pattern that
emphasizes creating applications that are:
▪ 	Extendable: It is easy to figure out how even a complex Angular app works once you
understand the basics—and that means you can easily enhance applications to create
new and useful features for your users.
▪ 	Maintainable: Angular apps are easy to debug and fix, which means that long-term
maintenance is simplified.
▪ 	Testable: Angular has good support for unit and end-to-end testing, meaning you can
find and fix defects before your users do.
▪ 	Standardized: Angular builds on the innate capabilities of the web browser without
getting in your way, allowing you to create standards-compliant web apps that take
advantage of the latest HTML and features, as well as popular tools and frameworks.
Angular is an open-source JavaScript library that is sponsored and maintained by Google. It
has been used in some of the largest and most complex web apps around. In this book, I will
show you everything you need to know to get the benefits of Angular in your projects.
1
-- 12 of 848 --
2
1.1 	Understanding where Angular excels
Angular isn’t the solution to every problem, and it is important to know when you should use
Angular and when you should seek an alternative. Angular delivers the kind of functionality
that used to be available only to server-side developers but delivers it entirely in the browser.
This means Angular has a lot of work to do each time an HTML document to which Angular has
been applied is loaded—the HTML elements have to be compiled, the data bindings have to be
evaluated, components and other building blocks need to be executed, and so on.
This kind of work takes time to perform, and the amount of time depends on the complexity
of the HTML document, on the associated JavaScript code, and—critically—on the quality of
the browser and the processing capability of the device. You won’t notice any delay when using
the latest browsers on a capable desktop machine, but old browsers on underpowered
smartphones can slow down the initial setup of an Angular app.
The goal is to perform this setup as infrequently as possible and deliver as much of the app
as possible to the user when it is performed. This means giving careful thought to the kind of
web application you build. In broad terms, there are two kinds of web applications: round-trip
and single-page.
1.1.1 	Understanding round-trip and single-page applications
For a long time, web apps were developed to follow a round-trip model. The browser requests
an initial HTML document from the server. User interactions—such as clicking a link or
submitting a

---

## Chapter 2 introduces Angular by creating a simple application, and, as part of that process, I

tell you how to create a development environment for working with Angular.
1.8 	What if you have problems following the examples?
The first thing to do is to go back to the start of the chapter and begin again. Most problems
are caused by missing a step or not fully following a listing. Pay close attention to the emphasis
in code listings, which highlight the changes that are required.
Next, check the errata list, which is included in the book’s GitHub repository. Technical
books are complex, and mistakes are inevitable, despite my best efforts and those of my
editors. Check the errata list for the list of known errors and instructions to resolve them. Next,
check the typos list, also in the GitHub repository, which contains corrections for issues that
are unlikely to cause confusion or break the examples.
If you still have problems, then download the project for the chapter you are reading from
the 	book’s 	GitHub 	repository, 	https://github.com/manningbooks/pro-angular-16, 	and
compare it to your project. I created the code for the GitHub repository by working through
each chapter, so you should have the same files with the same contents in your project.
If you still can’t get the examples working, then you can contact me at adam@adam-
freeman.com for help. Please make it clear in your email which book you are reading and which
chapter/example is causing the problem. Please remember that I get a lot of emails and that
I may not respond immediately.
-- 15 of 848 --
5
1.9 	What if you find an error in the book?
You can report errors to me by email at adam@adam-freeman.com, although I ask that you
first check the errata and typos lists, which you can find in the book’s GitHub repository at
https://github.com/manningbooks/pro-angular-16, in case it has already been reported.

---

## Errata bounty

Manning has agreed to give a free ebook to readers who are the first to report errors that
make it onto the GitHub errata list for this book. Readers can select any Manning ebook,
not just my books.
This is an entirely discretionary and experimental program. Discretionary means that only
I decide which errors are listed in the errata and which reader is the first to make a report.
Experimental means Manning may decide not to give away any more books at any time for
any reason. There are no appeals, and this is not a promise or a contract or any kind of
formal offer or competition. Or, put another way, this is a nice and informal way to say
thank you and to encourage readers to report mistakes that I have missed when writing
this book.
1.10 	Are there lots of examples?
There are loads of examples. The best way to learn Angular is by example, and I have packed
as many of them as I can into this book. To maximize the number of examples in this book, I
have adopted a simple convention to avoid listing the contents of files over and over. The first
time I use a file in a chapter, I’ll list the complete contents, just as I have in listing 1.1. I
include the name of the file in the listing’s header and the folder in which you should create it.
When I make changes to the code, I show the altered statements in bold.
Listing 1.1 A complete example document
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
@NgModule({
declarations: [AppComponent],
imports: [BrowserModule],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }
This listing is taken from a later chapter Don’t worry about what it does; just be aware that
this is a complete listing, which shows the entire contents of the file.
-- 16 of 848 --
6
When I make a series of changes to the same file or when I make a small change to a large
file, I show you just the elements that change, to create a partial listing. You can spot a partial
listing because it starts and ends with an ellipsis (...), as shown in listing 1.2.
Listing 1.2. A partial listing
...
class PaIteratorContext {
odd: boolean; even: boolean;
first: boolean; last: boolean;
constructor(public $implicit: any,
public index: number, total: number ) {
this.odd = index % 2 == 1;
this.even = !this.odd;
this.first = index == 0;
this.last = index == total - 1;
setInterval(() => {
this.odd = !this.odd; this.even = !this.even;
this.$implicit.price++;
}, 2000);
}
}
...
You can see that just a section of the file is shown and that I have highlighted several
statements. This is how I draw your attention to the part of the listing that has changed or
emphasize the part of an example that shows the feature or technique I am describing. In
some cases, I need to make changes to different parts of the same file, in which case I omit
some elements or statements for brevity, as shown in listing 1.3.
Listing 1.3. Omitting statements for brevit

---

## This chapter covers

▪ 	Installing the tools and packages required for Angular development
▪ 	Creating an Angular project
▪ 	Using Angular features to dynamically create HTML
▪ 	Displaying data in the HTML content
▪ 	Responding to events
▪ 	Styling the HTML content using the Angular Material package
The best way to get started with Angular is to dive in and create a web application. In this
chapter, I show you how to set up your development environment and take you through the
process of creating a basic application. In chapters 5–8, I show you how to create a more
complex and realistic Angular application, but for now, a simple example will suffice to
demonstrate the major components of an Angular app and set the scene for the other chapters
in this part of the book.
Don’t worry if you don’t follow everything that happens in this chapter. Angular has a steep
learning curve, so the purpose of this chapter is just to introduce the basic flow of Angular
development and give you a sense of how things fit together. It won’t all make sense right
now, but by the time you have finished reading this book, you will understand every step I
take in this chapter and much more besides.
2.1 	Getting ready
There is some preparation required for Angular development. In the sections that follow, I
explain how to get set up and ready to create your first project. There is wide support for
Angular in popular development tools, and you can pick your favorites.
-- 21 of 848 --
11
2.1.1 	Installing Node.js
Node.js is a JavaScript runtime for server-side applications and is used by most web application
frameworks, including Angular.
The version of Node.js I have used in this book is 18.14.0, which is the current Long-Term
Support (LTS) release at the time of writing. There may be a later version available by the
time you read this, but you should stick to the 18.14.0 release for the examples in this book.
A complete set of 18.14.0 releases, with installers for Windows and macOS and binary
packages for other platforms, is available at https://nodejs.org/dist/v18.14.0.
Download and run the installer and ensure that the “npm package manager” option and
the two Add to PATH options are selected, as shown in figure 2-1.
Figure 2.1. Installing Node.js
When the installation is complete, open a new command prompt and run the command shown
in listing 2.1.
-- 22 of 848 --
12
Listing 2.1. Running Node.js
node -v
If the installation has gone as it should, then you will see the following version number
displayed:
v18.14.0
The Node.js installer includes the Node Package Manager (NPM), which is used to manage the
packages in a project. Run the command shown in listing 2.2 to ensure that NPM is working.
Listing 2.2. Running NPM
npm -v
If everything is working as it should, then you will see the following version number:
8.1.4
2.1.2 	Installing an editor
Angular development can be done with any programmer’s editor, from which there is an
endless number to choose. Some editors have enhanced support for worki

---

## Add

</button>
</mat-form-field>
</div>
<div class="tableContainer">
<table mat-table [dataSource]="items"
class="mat-elevation-z3 fullWidth">
<ng-container matColumnDef="id">
<th mat-header-cell *matHeaderCellDef>#</th>
<td mat-cell *matCellDef="let i = index"> {{ i + 1 }} </td>
</ng-container>
<ng-container matColumnDef="task">
<th mat-header-cell *matHeaderCellDef>Task</th>
<td mat-cell *matCellDef="let item"> {{ item.task }} </td>
</ng-container>
<ng-container matColumnDef="done">
<th mat-header-cell *matHeaderCellDef>Done</th>
<td mat-cell *matCellDef="let item">
<mat-checkbox [(ngModel)]="item.complete" color="primary">
{{ item.complete }}
</mat-checkbox>
</td>
</ng-container>
<tr mat-header-row *matHeaderRowDef="['id', 'task', 'done']"></tr>
<tr mat-row *matRowDef="let row; columns: ['id', 'task', 'done'];">
</tr>
</table>
</div>
The new elements display an input element and a button element. The mat-form-field
element and the mat* attributes on the other elements configure the Angular Material styling.
The input element has an attribute whose name starts with the # character, which is used
to define a variable to refer to the element in the template’s data bindings:
...
<input matInput placeholder="Enter to-do description" #todoText>
...
The name of the variable is todoText, and it is used by the binding that has been applied to
the button element.
...
<button matSuffix mat-raised-button color="accent"
class="addButton"
(click)="addItem(todoText.value); todoText.value = ''">
...
-- 47 of 848 --
37
This is an example of an event binding, and it tells Angular to invoke a component method
called addItem, using the value property of the input element as the method argument,
and then to clear the input element by setting its value property to the empty string.
Custom CSS styles are required to manage the layout of the new elements, as shown in
listing 2.22.
Listing 2.22. Defining styles in the app.component.css file in the src/app folder
.spacer { flex: 1 1 auto }
.tableContainer { padding: 15px 	}
.fullWidth { width: 100% }
.inputContainer { margin: 15px 15px 5px }
.addButton { margin: 5px }
Listing 2.23 adds the method called by the event binding to the component.
TIP Don’t worry about telling the bindings apart for now. I explain the different types of
binding that Angular supports in part 2 and the meaning of the different types of brackets
or parentheses that each requires. They are not as complicated as they first appear,
especially once you have seen how they fit into the rest of the Angular framework.
Listing 2.23. Adding a method in the app.component.ts file in the src/app folder
import { Component } from '@angular/core';
import { TodoList } from "./todoList";
import { TodoItem } from "./todoItem";
@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']
})
export class AppComponent {
private list = new TodoList("Bob", [
new TodoItem("Go for run", true),
new TodoItem("Get flowers"),
new Tod

---

## Add

</button>
-- 49 of 848 --
39
</mat-form-field>
</div>
<div class="tableContainer">
<table mat-table [dataSource]="items"
class="mat-elevation-z3 fullWidth">
<ng-container matColumnDef="id">
<th mat-header-cell *matHeaderCellDef>#</th>
<td mat-cell *matCellDef="let i = index"> {{ i + 1 }} </td>
</ng-container>
<ng-container matColumnDef="task">
<th mat-header-cell *matHeaderCellDef>Task</th>
<td mat-cell *matCellDef="let item"> {{ item.task }} </td>
</ng-container>
<ng-container matColumnDef="done">
<th mat-header-cell *matHeaderCellDef>Done</th>
<td mat-cell *matCellDef="let item">
<mat-checkbox [(ngModel)]="item.complete" color="primary">
<!-- {{ item.complete }} -->
</mat-checkbox>
</td>
</ng-container>
<tr mat-header-row *matHeaderRowDef="['id', 'task', 'done']"></tr>
<tr mat-row *matRowDef="let row; columns: ['id', 'task', 'done'];">
</tr>
</table>
</div>
<div class="toggleContainer">
<span class="spacer"></span>
<mat-slide-toggle [(ngModel)]="showComplete">
Show Completed Items
</mat-slide-toggle>
<span class="spacer"></span>
</div>
The new elements present a toggle switch that has a two-way data binding for a property
named showComplete. Listing 2.25 adds the definition for the showComplete property to
the component and uses its value to determine whether completed tasks are displayed to the
user.
Listing 2.25. Showing completed tasks in the app.component.ts file in the src/app folder
import { Component } from '@angular/core';
import { TodoList } from "./todoList";
import { TodoItem } from "./todoItem";
@Component({
selector: 'app-root',
templateUrl: './app.component.html',
styleUrls: ['./app.component.css']
})
export class AppComponent {
-- 50 of 848 --
40
private list = new TodoList("Bob", [
new TodoItem("Go for run", true),
new TodoItem("Get flowers"),
new TodoItem("Collect tickets"),
]);
get username(): string {
return this.list.user;
}
get itemCount(): number {
return this.list.items.filter(item => !item.complete).length;
}
get items(): readonly TodoItem[] {
return this.list.items
.filter(item => this.showComplete || !item.complete);
}
addItem(newItem: string) {
if (newItem != "") {
this.list.addItem(newItem);
}
}
showComplete: boolean = false;
}
An additional CSS style is required to lay out the toggle switch, as shown in listing 2.26.
Listing 2.26. Adding a style in the app.component.css file in the src/app folder
.spacer { flex: 1 1 auto }
.tableContainer { padding: 15px 	}
.fullWidth { width: 100% }
.inputContainer { margin: 15px 15px 5px }
.addButton { margin: 5px }
.toggleContainer { margin: 15px; display: flex }
The result is that the user can decide whether to see completed tasks, as shown in figure 2.12.
-- 51 of 848 --
41
Figure 2.12. Showing completed tasks
2.10 	Summary
In this chapter, I showed you how to create your first simple Angular app, which lets the user
create new to-do items and mark existing items as complete. Don’t worry if not everything in
this chapter makes sense. What’s important to understand at this stage

---

## This chapter covers

▪ 	Understanding the basic structure of HTML and the role of CSS
▪ 	Understanding the relationship between JavaScript and TypeScript
▪ 	Using TypeScript to make the JavaScript type system predictable
▪ 	Using the basic JavaScript/TypeScript types and operators
Developers come to the world of web app development via many paths and are not always
grounded in the basic technologies that web apps rely on. In this chapter, I provide a brief
overview of HTML, introduce the basics of JavaScript and TypeScript, and give you the
foundation you need to understand the examples in the rest of the book, continuing with more
advanced features in chapter 4. If you are already familiar with HTML and TypeScript, you can
jump right to chapter 5, where I use Angular to create a more complex and realistic application.
3.1 	Preparing the example project
To create the example project for this chapter, open a new command prompt, navigate to a
convenient location, and run the command shown in listing 3.1.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
Listing 3.1. Creating the example project
ng new Primer --routing false --style css --skip-git --skip-tests
This command creates a project called Primer that is set up for Angular development. I don’t
do any Angular development in this chapter, but I am going to use the Angular development
tools as a convenient way to demonstrate different HTML, JavaScript, and TypeScript features.
-- 53 of 848 --
43
Next, run the command shown in listing 3.2 in the Primer folder to add the Bootstrap CSS
package to the project. This is the package that I use to manage the appearance of content
throughout this book.
Listing 3.2. Installing the Bootstrap CSS package
npm install bootstrap@5.2.3
If you are using Linux or macOS, run the command shown in listing 3.3 to integrate Bootstrap
into the application, taking care to enter the command as it is shown, without any extra spaces
or quotes.
Listing 3.3. Changing the application configuration
ng config projects.Primer.architect.build.options.styles
'["src/styles.css", "node_modules/bootstrap/dist/css/bootstrap.min.css"]'
If you are using Windows, then use a PowerShell prompt to run the command shown in listing
3.4 in the example folder.
Listing 3.4. Changing the application configuration using powershell
ng config projects.Primer.architect.build.options.styles `
'[""src/styles.css"",
""node_modules/bootstrap/dist/css/bootstrap.min.css""]'
Run the command shown in listing 3.5 in the Primer folder to start the Angular development
compiler and HTTP server.
Listing 3.5. Starting the development tools
ng serve --open
After an initial build process, the Angular tools will open a browser window, which displays
placeholder content added to the project when it was created, as shown in figure 3.1.
Figure 3.1. Running the 

---

## Hello

Hello, World
3.4.2 	Understanding JavaScript vs. TypeScript
JavaScript has an unusual approach to data types, which means that, for example, any variable
can be assigned any value, regardless of type. As a simple demonstration, I am going to work
outside of the Angular tools for a moment. Open a new command prompt, navigate to a
convenient location, and create a file named example.js with the content shown in listing
3.9. It doesn’t matter where you put this file, as long as it isn’t in the Primer project folder.
Listing 3.9. The contents of the example.js file
function myFunction(param) {
let result = param + 100;
console.log("My result: " + result);
}
This listing defines a JavaScript function, which receives a value as a parameter, uses the
addition operator to add 10 to the value, and then writes out the result to the JavaScript
console. Notice that there are no data types specified in this code. The function, which is named
myFunction, can receive any data type, as shown in listing 3.10.
Listing 3.10. Invoking the function in the example.js file
function myFunction(param) {
let result = param + 100;
console.log("My result: " + result);
}
myFunction(1);
myFunction("London");
The first new statement invokes myFunction with a number. The second new statement
invokes myFunction with a string, London. Using the command prompt, execute the
JavaScript code by running the command shown in listing 3.11 in the folder in which you
created the example.js file.
Listing 3.11. Executing the JavaScript code
-- 62 of 848 --
52
node example.js
This command will produce the following output as the JavaScript statements are executed:
My result: 101
My result: London100
When the function received a number, the addition operator combined one number, 1, with
another number, 100, and produced the result 101. But when the function received a string,
the addition operator was asked to combine values with two different data types. It produced
its result by converting the number 100 into a string and concatenating it with the parameter
value to produce the result London100. JavaScript does provide the means to check whether
a value is of a specific type, as shown in listing 3.12.
Listing 3.12. Checking a type in the example.js file
function myFunction(param) {
if (typeof(param) == "number") {
let result = param + 100;
console.log("My result: " + result);
} else {
throw ("Expected a number: " + param)
}
}
myFunction(1);
myFunction("London");
The typeof function is used to check that the parameter is a number value, and the throw
keyword is used to create an error if it is not, which you can see by running the command in
listing 3.11 again, which produces the following output:
My result: 101
C:\example.js:6
throw ("Expected a number: " + param)
^
Expected a number: London
(Use `node --trace-uncaught ...` to show where the exception was thrown)
The behavior of the function has changed so that it only accepts numbers, but this change is
enforced at runtime, and there is no

---

## These methods return new strings in which all the characters are

uppercase or lowercase.
trim() 	This method returns a new string from which all the leading and
trailing whitespace characters have been removed.
USING TEMPLATE STRINGS
A common programming task is to combine static content with data values to produce a string
that can be presented to the user. The traditional way to do this is through string
concatenation, which is the approach I have been using in the examples so far in this chapter,
as follows:
...
console.log("Place value: " + place + " Type: " + typeof(place));
...
JavaScript also supports template strings, which allow data values to be specified inline, which
can help reduce errors and result in a more natural development experience. Listing 3.29
shows the use of a template string.
Listing 3.29. Using a template string in the main.ts file in the src folder
let place: string | undefined | null;
console.log(`Place value: ${place} Type: ${typeof(place)}`);
Template strings begin and end with backticks (the ` character), and data values are denoted
by curly braces preceded by a dollar sign. This string, for example, incorporates the value of
the place variable and its type into the template string:
...
console.log(`Place value: ${place} Type: ${typeof(place)}`);
...
This example produces the following output:
Place value: undefined Type: undefined
WORKING WITH NUMBERS
The number type is used to represent both integer and floating-point numbers (also known as
real numbers). Listing 3.30 provides a demonstration.
Listing 3.30. Defining number Values in the main.ts File in the src Folder
let daysInWeek = 7;
let pi = 3.14;
let hexValue = 0xFFFF;
-- 72 of 848 --
62
You don’t have to specify which kind of number you are using. You just express the value you
require, and JavaScript will act accordingly. In the listing, I have defined an integer value,
defined a floating-point value, and prefixed a value with 0x to denote a hexadecimal value.
Listing 3.30 doesn’t produce any output.
WORKING WITH NULL AND UNDEFINED VALUES
The null and undefined values have no features, such as properties or methods, but the
unusual approach taken by JavaScript means that you can only assign these values to variables
whose type is a union that includes null or undefined, as shown in listing 3.31.
Listing 3.31. Assigning null and undefined values in the main.ts file in the src folder
let person1 = "Alice";
let person2: string | undefined = "Bob";
The TypeScript compiler will infer the type of the person1 variable as string because that
is the type of the value assigned to it. This variable cannot be assigned the null or undefined
value.
The person2 variable is defined with a type annotation that specifies string or
undefined values. This variable can be assigned undefined but not null, since null is
not part of the type union.
3.4.7 	Using the JavaScript operators
JavaScript defines a largely standard set of operators. I’ve summarized the most useful in table
3.3.
Table 3.3. Useful JavaScript operators
Operator 	Descripti

---

## They are the same

JavaScript is converting the two operands into the same type and comparing them. In essence,
the equality operator tests that values are the same irrespective of their type.
-- 74 of 848 --
64
If you want to test to ensure that the values and the types are the same, then you need to
use the identity operator (===, three equal signs, rather than the two of the equality operator),
as shown in listing 3.34.
Listing 3.34. Using the identity operator in the main.ts file in the src folder
let firstVal: any = 5;
let secondVal: any = "5";
if (firstVal === secondVal) {
console.log("They are the same");
} else {
console.log("They are NOT the same");
}
In this example, the identity operator will consider the two variables to be different. This
operator doesn’t coerce types. The result from this script is as follows:
They are NOT the same
To demonstrate how JavaScript works, I had to use the any type when declaring the firstVal
and secondVal variables, because TypeScript restricts the use of the equality operator so
that it can be used only on two values of the same type. Listing 3.35 removes the variable
type annotations and allows TypeScript to infer the types from the assigned values.
Listing 3.35. Removing the type annotations in the main.ts file in the src folder
let firstVal = 5;
let secondVal = "5";
if (firstVal === secondVal) {
console.log("They are the same");
} else {
console.log("They are NOT the same");
}
The TypeScript compiler detects that the variable types are not the same and generates the
following error:
Error: src/main.ts:4:5 - error TS2367: This condition will always return
'false' since the types 'number' and 'string' have no overlap.
Understanding Truthy and Falsy
The comparison operator presents another pitfall for the unwary, which is that expressions
can be truthy or falsy. The following results are always falsy:
▪ 	The false (boolean) value
▪ 	The 0 (number) value
▪ 	The empty string ("")
▪ 	null
▪ 	undefined
-- 75 of 848 --
65
▪ 	NaN (a special number value)
All other values are truthy, which can be confusing. For example, "false" (a string whose
content is the word false) is truthy. The best way to avoid confusion is to only use
expressions that evaluate to the boolean values true and false.
EXPLICITLY CONVERTING TYPES
The string concatenation operator (+) has higher precedence than the addition operator (also
+), which means JavaScript will concatenate variables in preference to adding. This can confuse
because JavaScript will also convert types freely to produce a result—and not always the result
that is expected, as shown in listing 3.36.
Listing 3.36. String concatenation operator precedence in the main.ts file in the src
folder
let myData1 = 5 + 5;
let myData2 = 5 + "5";
console.log(`Result 1: ${myData1}, Type: ${typeof(myData1)}`);
console.log(`Result 2: ${myData2}, Type: ${typeof(myData2)}`);
This code produces the following output in the browser’s JavaScript console:
Result 1: 10, Type: number
Result 2: 55, Type: string
T

---

## This chapter covers

▪ 	Understanding and using JavaScript functions
▪ 	Using the JavaScript concise function syntax
▪ 	Defining and using JavaScript arrays
▪ 	Creating objects using the literal syntax
▪ 	Using classes to create objects
▪ 	Defining and using JavaScript modules
In this chapter, I continue to describe the basic features of TypeScript and JavaScript that are
required for Angular development.
4.1 	Preparing for this chapter
This chapter uses the Primer project created in chapter 3. No changes are required for this
chapter. Open a new command prompt, navigate to the Primer folder, and run the command
shown in listing 4.1 to start the Angular development tools.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
Listing 4.1. Starting the development tools
ng serve --open
After an initial build process, the Angular tools will open a browser window and display the
content shown in figure 4.1.
-- 82 of 848 --
72
Figure 4.1. Running the example application
This chapter continues to use the browser’s JavaScript console. Press F12 to open the browser’s
developer tools and switch to the console; you will see the following results (you may have to
reload the browser):
Result 1: 100.00
Result 2: 100.00
4.2 	Defining and using functions
When the browser receives JavaScript code, it executes the statements it contains in the order
in which they have been defined. In common with most languages, JavaScript allows
statements to be grouped into a function, which won’t be executed until a statement that
invokes the function is executed, as shown in listing 4.2.
Listing 4.2. Defining a function in the main.ts file in the src folder
function writeValue(val: string | null) {
console.log(`Value: ${val ?? "Fallback value"}`)
}
writeValue("London");
writeValue(null);
Functions are defined with the function keyword and are given a name. If a function defines
parameters, then TypeScript requires type annotations, which are used to enforce consistency
in the use of the function. The function in listing 4.2 is named writeValue, and it defines a
-- 83 of 848 --
73
parameter that will accept string or null values. The statement inside of the function isn’t
executed until the browser reaches a statement that invokes the function. The code in listing
4.2 produces the following output in the browser’s JavaScript console:
Value: London
Value: Fallback value
4.2.1 	Defining optional function parameters
By default, TypeScript will allow functions to be invoked only when the number of arguments
matches the number of parameters the function defines. This may seem obvious if you are
used to other mainstream languages, but a function can be called with any number of
arguments in pure JavaScript, regardless of how many parameters have been defined. The ?
character is used to denote an optional parameter, as shown in l

---

## 3. This code produces the following output in the browser’s JavaScript console:

Name: Hat, Price: 100
Boots, Price: 100, Category: Snow Gear
4.4.2 	Defining classes
Classes are templates used to create objects, providing an alternative to the literal syntax.
Support for classes is a recent addition to the JavaScript specification and is intended to make
working with JavaScript more consistent with other mainstream programming languages.
Listing 4.23 defines a class and uses it to create objects.
-- 94 of 848 --
84
Listing 4.23. Defining a class in the main.ts file in the src folder
class Product {
constructor(name: string, price: number, category?: string) {
this.name = name;
this.price = price;
this.category = category;
}
name: string
price: number
category?: string
}
let hat = new Product("Hat", 100);
let boots = new Product("Boots", 100, "Snow Gear");
function printDetails(product : { name: string, price: number,
category?: string}) {
if (product.category != undefined) {
console.log(`Name: ${product.name}, Price: ${product.price}, `
+ `Category: ${product.category}`);
} else {
console.log(`Name: ${product.name}, Price: ${product.price}`);
}
}
printDetails(hat);
printDetails(boots);
JavaScript classes will be familiar if you have used another mainstream language such as Java
or C#. The class keyword is used to declare a class, followed by the name of the class, which
is Product in this example.
The constructor function is invoked when a new object is created using the class, and it
provides an opportunity to receive data values and do any initial setup that the class requires.
In the example, the constructor defines name, price, and category parameters that are
used to assign values to properties defined with the same names.
The new keyword is used to create an object from a class, like this:
...
let hat = new Product("Hat", 100);
...
This statement creates a new object using the Product class as its template. Product is
used as a function in this situation, and the arguments passed to it will be received by the
constructor function defined by the class. The result of this expression is a new object that
is assigned to a variable called hat.
Notice that the objects created from the class can still be used as arguments to the
printDetails function. Introducing a class has changed the way that objects are created,
but those objects have the same combination of property names and types and still match the
type annotation for the function parameters. The code in listing 4.23 produces the following
output in the browser’s JavaScript console:
-- 95 of 848 --
85
Name: Hat, Price: 100
Name: Boots, Price: 100, Category: Snow Gear
ADDING METHODS TO A CLASS
I can simplify the code in the example by moving the functionality defined by the
printDetails function into a method defined by the Product class, as shown in listing
4.24.
Listing 4.24. Defining a method in the main.ts file in the src folder
class Product {
constructor(name: string, price: number, category?: string) {
this.name = name;
this.price = price;
this.category = categor

---

## This chapter covers

▪ 	Creating the SportsStore project
▪ 	Starting a data model with dummy data
▪ 	Using signals to track changes in data
▪ 	Displaying a list of products to the user
▪ 	Filtering products by category
▪ 	Paginating products
In chapter 2, I built a quick and simple Angular application. Small and focused examples allow
me to demonstrate specific Angular features, but they can lack context. To help overcome this
problem, I am going to create a simple but realistic e-commerce application.
My application, called SportsStore, will follow the classic approach taken by online stores
everywhere. I will create an online product catalog that customers can browse by category and
page, a shopping cart where users can add and remove products, and a checkout where
customers can enter their shipping details and place their orders. I will also create an
administration area that includes create, read, update, and delete (CRUD) facilities for
managing the catalog—and I will protect it so that only logged-in administrators can make
changes. Finally, I show you how to prepare and deploy an Angular application.
My goal in this chapter and those that follow is to give you a sense of what real Angular
development is like by creating as realistic an example as possible. I want to focus on Angular,
of course, and so I have simplified the integration with external systems, such as the data
store, and omitted others entirely, such as payment processing.
The SportsStore example is one that I use in a few of my books, not least because it
demonstrates how different frameworks, languages, and development styles can be used to
achieve the same result. You don’t need to have read any of my other books to follow this
-- 103 of 848 --
93
chapter, but you will find the contrasts interesting if you already own my Pro ASP.NET Core
book, for example.
The Angular features that I use in the SportsStore application are covered in-depth in later
chapters. Rather than duplicate everything here, I tell you just enough to make sense of the
example application and refer you to other chapters for in-depth information. You can either
read the SportsStore chapters from end to end to get a sense of how Angular works or jump
to and from the detailed chapters to get into the depth of each feature. Either way, don’t
expect to understand everything right away—Angular has lots of moving parts, and the
SportsStore application is intended to show you how they fit together without diving too deeply
into the details that I spend the rest of the book describing.
5.1 	Preparing the project
To create the SportsStore project, open a command prompt, navigate to a convenient location,
and run the following command:
ng new SportsStore --routing false --style css --skip-git --skip-tests
The angular-cli package will create a new project for Angular development, with
configuration files, placeholder content, and development tools. The project setup process can
take some time since there are many NPM packages to downlo

---

## Home

</button>
<button *ngFor="let cat of categories()"
class="btn btn-outline-primary"
[class.active]="cat == selectedCategory()"
(click)="changeCategory(cat)">
{{cat}}
</button>
</div>
</div>
<div class="col-9 p-2 text-dark">
<div *ngFor="let product of products()"
class="card m-1 p-1 bg-light">
<h4>
{{product.name}}
<span class="badge rounded-pill bg-primary"
style="float:right">
{{ product.price |
currency:"USD":"symbol":"2.2-2" }}
</span>
</h4>
<div class="card-text bg-white p-1">
{{product.description}}
</div>
</div>
</div>
</div>
</div>
There are two new button elements in the template. The first is a Home button, and it has
an event binding that invokes the component’s changeCategory method when the button is
clicked. No argument is provided for the method, which has the effect of setting the category
to null/undefined and selecting all the products.
The ngFor binding has been applied to the other button element, with an expression that
will repeat the element for each value in the array returned by the component’s categories
property. 	The 	button 	has 	a 	click 	event 	binding 	whose 	expression 	calls 	the
changeCategory method to select the current category, which will filter the products
displayed to the user. There is also a class binding, which adds the button element to the
active class when the category associated with the button is the selected category. This
provides the user with visual feedback when the categories are filtered, as shown in figure 5.6.
-- 123 of 848 --
113
Figure 5.6. Selecting product categories
5.5.3 	Adding product pagination
Filtering the products by category has helped make the product list more manageable, but a
more typical approach is to break the list into smaller sections and present each of them as a
page, along with navigation buttons that move between the pages. Listing 5.23 enhances the
store component so that it keeps track of the current page and the number of items on a page.
Listing 5.23. Adding pagination in the store.component.ts file in the src/app/store folder
import { Component, Signal, computed, signal } from "@angular/core";
import { Product } from "../model/product.model";
import { ProductRepository } from "../model/product.repository";
@Component({
selector: "store",
templateUrl: "store.component.html"
})
export class StoreComponent {
products: Signal<Product[]>;
categories: Signal<string[]>;
selectedCategory = signal<string | undefined>(undefined);
productsPerPage = signal(4);
selectedPage = signal(1);
pagedProducts: Signal<Product[]>;
pageNumbers: Signal<number[]>;
constructor(private repository: ProductRepository) {
this.products = computed(() => {
if (this.selectedCategory() == undefined) {
return this.repository.products();
} else {
return this.repository.products().filter(p =>
p.category === this.selectedCategory());
}
})
-- 124 of 848 --
114
this.categories = repository.categories;
let pageIndex = computed(() => {
return (this.selectedPage() - 1) * this.productsPerPage()
});
this.p

---

## Home

</button>
<button *ngFor="let cat of categories()"
class="btn btn-outline-primary"
[class.active]="cat == selectedCategory()"
(click)="changeCategory(cat)">
{{cat}}
</button>
</div>
</div>
<div class="col-9 p-2 text-dark">
<div *ngFor="let product of pagedProducts()"
class="card m-1 p-1 bg-light">
<h4>
{{product.name}}
<span class="badge rounded-pill bg-primary"
style="float:right">
{{ product.price |
currency:"USD":"symbol":"2.2-2" }}
</span>
</h4>
<div class="card-text bg-white p-1">
{{product.description}}
</div>
</div>
<div class="form-inline float-start mr-1">
<select class="form-control" [value]="productsPerPage()"
(change)="changePageSize($any($event).target.value)">
<option value="3">3 per Page</option>
<option value="4">4 per Page</option>
<option value="6">6 per Page</option>
<option value="8">8 per Page</option>
</select>
</div>
<div class="btn-group float-end">
<button *ngFor="let page of pageNumbers()"
(click)="changePage(page)"
class="btn btn-outline-primary"
[class.active]="page == selectedPage()">
-- 126 of 848 --
116
{{page}}
</button>
</div>
</div>
</div>
</div>
The new elements add a select element that allows the size of the page to be changed and
a set of buttons that navigate through the product pages. The new elements have data bindings
to wire them up to the properties and methods provided by the component. The result is a
more manageable set of products, as shown in figure 5.7.
TIP The select element in listing 5.24 is populated with option elements that are
statically defined, rather than created using data from the component. One impact of this
is that when the selected value is passed to the changePageSize method, it will be a
string value, which is why the argument is parsed to a number before being used to set
the page size in listing 5.23. Care must be taken when receiving data values from HTML
elements to ensure they are of the expected type. TypeScript type annotations don’t help
in this situation because the data binding expression is evaluated at runtime, long after the
TypeScript compiler has generated JavaScript code that doesn’t contain the extra type
information.
Figure 5.7. Pagination for products
-- 127 of 848 --
117
5.5.4 	Creating a custom directive
In this section, I am going to create a custom directive so that I don’t have to generate an
array full of numbers to create the page navigation buttons. Angular provides a good range of
built-in directives, but it is a simple process to create your own directives to solve problems
that are specific to your application or to support features that the built-in directives don’t
have. I added a file called counter.directive.ts in the src/app/store folder and used
it to define the class shown in listing 5.25.
Listing 5.25. The contents of the counter.directive.ts file in the src/app/store folder
import {
Directive, ViewContainerRef, TemplateRef, Input, SimpleChanges
} from "@angular/core";
@Directive({
selector: "[counterOf]"
})
export class CounterDirective {
co

---

## Home

</button>
<button *ngFor="let cat of categories()"
class="btn btn-outline-primary"
[class.active]="cat == selectedCategory()"
(click)="changeCategory(cat)">
{{cat}}
</button>
</div>
</div>
<div class="col-9 p-2 text-dark">
<div *ngFor="let product of pagedProducts()"
class="card m-1 p-1 bg-light">
<h4>
{{product.name}}
<span class="badge rounded-pill bg-primary"
style="float:right">
{{ product.price |
currency:"USD":"symbol":"2.2-2" }}
</span>
</h4>
<div class="card-text bg-white p-1">
{{product.description}}
-- 129 of 848 --
119
</div>
</div>
<div class="form-inline float-start mr-1">
<select class="form-control" [value]="productsPerPage()"
(change)="changePageSize($any($event).target.value)">
<option value="3">3 per Page</option>
<option value="4">4 per Page</option>
<option value="6">6 per Page</option>
<option value="8">8 per Page</option>
</select>
</div>
<div class="btn-group float-end">
<button *counter="let page of pageCount()"
(click)="changePage(page)"
class="btn btn-outline-primary"
[class.active]="page == selectedPage()">
{{page}}
</button>
</div>
</div>
</div>
</div>
The new data binding relies on a property called pageCount to configure the custom directive.
In listing 5.28, I have replaced the array of numbers with a simple number that provides the
expression value.
Listing 5.28. Supporting the custom directive in the store.component.ts file in the
src/app/store folder
import { Component, Signal, computed, signal } from "@angular/core";
import { Product } from "../model/product.model";
import { ProductRepository } from "../model/product.repository";
@Component({
selector: "store",
templateUrl: "store.component.html"
})
export class StoreComponent {
products: Signal<Product[]>;
categories: Signal<string[]>;
selectedCategory = signal<string | undefined>(undefined);
productsPerPage = signal(4);
selectedPage = signal(1);
pagedProducts: Signal<Product[]>;
//pageNumbers: Signal<number[]>;
pageCount: Signal<number>;
constructor(private repository: ProductRepository) {
this.products = computed(() => {
if (this.selectedCategory() == undefined) {
return this.repository.products();
} else {
return this.repository.products().filter(p =>
p.category === this.selectedCategory());
}
})
-- 130 of 848 --
120
this.categories = repository.categories;
let pageIndex = computed(() => {
return (this.selectedPage() - 1) * this.productsPerPage()
});
this.pagedProducts = computed(() => {
return this.products().slice(pageIndex(),
pageIndex() + this.productsPerPage());
});
// this.pageNumbers = computed(() => {
// 	return Array(Math.ceil(this.products().length
// 	/ this.productsPerPage()))
// 	.fill(0).map((x, i) => i + 1);
// });
this.pageCount = computed(() => {
return Math.ceil(this.products().length
/ this.productsPerPage());
});
}
changeCategory(newCategory?: string) {
this.selectedCategory.set(newCategory);
this.changePage(1);
}
changePage(newPage: number) {
this.selectedPage.set(newPage);
}
changePageSize(newSize: number) {
this.productsPerPage.set(Num

---

## chapter 5. To start the RESTful web service, open a command prompt and run the following

command in the SportsStore folder:
npm run json
Open a second command prompt and run the following command in the SportsStore folder
to start the development tools and HTTP server:
ng serve --open
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
6.2 	Creating the cart
The user needs a cart into which products can be placed and used to start the checkout process.
In the sections that follow, I’ll add a cart to the application and integrate it into the store so
that the user can select the products they want.
-- 132 of 848 --
122
6.2.1 	Creating the cart model
The starting point for the cart feature is a new model class that will be used to gather together
the products that the user has selected. I added a file called cart.model.ts in the
src/app/model folder and used it to define the class shown in listing 6.1.
Listing 6.1. The contents of the cart.model.ts file in the src/app/model folder
import { Injectable, Signal, WritableSignal, computed, signal }
from "@angular/core";
import { Product } from "./product.model";
@Injectable()
export class Cart {
private linesSignal: WritableSignal<CartLine[]>;
public summary: Signal<CartSummary>;
constructor() {
this.linesSignal = signal([]);
this.summary = computed(() => {
let newSummary = new CartSummary();
this.linesSignal().forEach(l => {
newSummary.itemCount += l.quantity;
newSummary.cartPrice += l.lineTotal;
});
return newSummary;
})
}
get lines(): Signal<CartLine[]> {
return this.linesSignal.asReadonly();
}
addLine(product: Product, quantity: number = 1) {
this.linesSignal.mutate(linesArray => {
let line = linesArray.find(l => l.product.id == product.id);
if (line != undefined) {
line.quantity += quantity;
} else {
linesArray.push(new CartLine(product, quantity));
}
});
}
updateQuantity(product: Product, quantity: number) {
this.linesSignal.mutate(linesArray => {
let line = linesArray.find(l => l.product.id == product.id);
if (line != undefined) {
line.quantity = Number(quantity);
}
});
}
removeLine(id: number) {
this.linesSignal.mutate(linesArray => {
let index = linesArray.findIndex(l => l.product.id == id);
-- 133 of 848 --
123
linesArray.splice(index, 1);
});
}
clear() {
this.linesSignal.set([]);
}
}
export class CartLine {
constructor(public product: Product,
public quantity: number) {}
get lineTotal() {
return this.quantity * (this.product.price ?? 0);
}
}
export class CartSummary {
itemCount: number = 0;
cartPrice: number = 0;
}
Individual product selections are represented as an array of CartLine objects, each of which
contains a Product object and a quantity. The Cart class keeps track of the total number of
items that have been selected and their total cost using the new signals feature, which ensures
that any change made to the product selections automatically updates the summary that
provides details of the numb

---

## Home

</button>
<button *ngFor="let cat of categories()"
class="btn btn-outline-primary"
[class.active]="cat == selectedCategory()"
-- 138 of 848 --
128
(click)="changeCategory(cat)">
{{cat}}
</button>
</div>
</div>
<div class="col-9 p-2 text-dark">
<div *ngFor="let product of pagedProducts()"
class="card m-1 p-1 bg-light">
<h4>
{{product.name}}
<span class="badge rounded-pill bg-primary"
style="float:right">
{{ product.price |
currency:"USD":"symbol":"2.2-2" }}
</span>
</h4>
<div class="card-text bg-white p-1">
{{product.description}}
<button class="btn btn-success btn-sm float-end"
(click)="addProductToCart(product)">
Add To Cart
</button>
</div>
</div>
<div class="form-inline float-start mr-1">
<select class="form-control" [value]="productsPerPage()"
(change)="changePageSize($any($event).target.value)">
<option value="3">3 per Page</option>
<option value="4">4 per Page</option>
<option value="6">6 per Page</option>
<option value="8">8 per Page</option>
</select>
</div>
<div class="btn-group float-end">
<button *counter="let page of pageCount()"
(click)="changePage(page)"
class="btn btn-outline-primary"
[class.active]="page == selectedPage()">
{{page}}
</button>
</div>
</div>
</div>
</div>
The result is a button for each product that adds it to the cart, as shown in figure 6.1. The full
cart process isn’t complete yet, but you can see the effect of each addition in the cart summary
at the top of the page.
-- 139 of 848 --
129
Figure 6.1. Adding cart support to the SportsStore application
Notice how clicking one of the Add To Cart buttons updates the summary component’s content
automatically. This happens because there is a single Cart object being shared between two
components, and changes made by one component are reflected when Angular evaluates the
data binding expressions in the other component.
6.3 	Adding URL routing
Most applications need to show different content to the user at different times. In the case of
the SportsStore application, when the user clicks one of the Add To Cart buttons, they should
be shown a detailed view of their selected products and given the chance to start the checkout
process.
Angular supports a feature called URL routing, which uses the current URL displayed by the
browser to select the components that are displayed to the user. This is an approach that
makes it easy to create applications whose components are loosely coupled and easy to change
without needing corresponding modifications elsewhere in the applications. URL routing also
makes it easy to change the path that a user follows through an application.
For the SportsStore application, I am going to add support for three different URLs, which
are described in table 6.1. This is a simple configuration, but the routing system has a lot of
features, which are described in part 3.
Table 6.1. The URLs supported by the SportsStore application
URL 	Description
/store 	This URL will display the list of products.
/cart 	This URL will display the user’s cart in detail

---

## chapter 5. If you omit the element, Angular will report an error and be unable to apply the

routes.
Listing 6.11. Creating the routing configuration in the app.module.ts file in the src/app
folder
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { StoreModule } from "./store/store.module";
import { StoreComponent } from "./store/store.component";
import { CheckoutComponent } from "./store/checkout.component";
import { CartDetailComponent } from "./store/cartDetail.component";
import { RouterModule } from "@angular/router";
@NgModule({
declarations: [AppComponent],
imports: [BrowserModule, StoreModule,
RouterModule.forRoot([
{ path: "store", component: StoreComponent },
{ path: "cart", component: CartDetailComponent },
{ path: "checkout", component: CheckoutComponent },
{ path: "**", redirectTo: "/store" }
])],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }
-- 142 of 848 --
132
The RouterModule.forRoot method is passed a set of routes, each of which maps a URL
to a component. The first three routes in the listing match the URLs from table 6.1. The final
route is a wildcard that redirects any other URL to 	/store, which will display
StoreComponent.
When the routing feature is used, Angular looks for the router-outlet element, which
defines the location in which the component that corresponds to the current URL should be
displayed. Listing 6.12 replaces the store element in the root component’s template with the
router-outlet element.
Listing 6.12. Defining the routing target in the app.component.ts file in the src/app folder
import { Component } from "@angular/core";
@Component({
selector: "app",
template: "<router-outlet></router-outlet>"
})
export class AppComponent { }
Angular will apply the routing configuration when you save the changes and the browser
reloads the HTML document. The content displayed in the browser window hasn’t changed, but
if you examine the browser’s URL bar, you will be able to see that the routing configuration
has been applied, as shown in figure 6.2.
Figure 6.2. The effect of URL routing
6.3.3 	Navigating through the application
With the routing configuration in place, it is time to add support for navigating between
components by changing the browser’s URL. The URL routing feature relies on a JavaScript API
-- 143 of 848 --
133
provided by the browser, which means the user can’t simply type the target URL into the
browser’s URL bar. Instead, the navigation has to be performed by the application, either by
using JavaScript code in a component or other building block or by adding attributes to HTML
elements in the template.
When the user clicks one of the Add To Cart buttons, the cart detail component should be
shown, which means that the application should navigate to the /cart URL. Listing 6.13 adds
navigation to the component method that is invoked when the user clicks the button.
Listing 6.13. Navigating using JavaScript in the store.component.ts file in the
app/src/store folder

---

## Your cart is empty

</td>
</tr>
<tr *ngFor="let line of cart.lines()">
<td>
<input type="number" class="form-control-sm"
style="width:5em" [value]="line.quantity"
(change)="cart.updateQuantity(line.product,
$any($event).target.value)" />
</td>
<td>{{line.product.name}}</td>
<td class="text-end">
{{line.product.price
| currency:"USD":"symbol":"2.2-2"}}
</td>
<td class="text-end">
{{(line.lineTotal)
| currency:"USD":"symbol":"2.2-2" }}
</td>
<td class="text-center">
<button class="btn btn-sm btn-danger"
(click)=
"cart.removeLine(line.product.id ?? 0)">

---

## Remove

</button>
</td>
</tr>
</tbody>
<tfoot>
-- 149 of 848 --
139
<tr>
<td colspan="3" class="text-end">Total:</td>
<td class="text-end">
{{cart.summary().cartPrice
| currency:"USD":"symbol":"2.2-2"}}
</td>
</tr>
</tfoot>
</table>
</div>
</div>
<div class="row">
<div class="col">
<div class="text-center">
<button class="btn btn-primary m-1" routerLink="/store">
Continue Shopping
</button>
<button class="btn btn-secondary m-1"
routerLink="/checkout"
[disabled]="cart.lines().length == 0">

---

## Checkout

</button>
</div>
</div>
</div>
</div>
This template displays a table showing the user’s product selections. For each product, there
is an input element that can be used to change the quantity, and there is a Remove button
that deletes it from the cart. There are also navigation buttons that allow the user to return to
the list of products or continue to the checkout process, as shown in figure 6.5. The
combination of the Angular data bindings and the shared Cart object means that any changes
made to the cart take immediate effect, recalculating the prices; and if you click the Continue
Shopping button, the changes are reflected in the cart summary component shown above the
list of products.
TIP If you receive an error after you have saved the template, then stop and restart the
ng serve command.
-- 150 of 848 --
140
Figure 6.5. Completing the cart detail feature
6.5 	Processing orders
Being able to receive orders from customers is the most important aspect of an online store.
In the sections that follow, I build on the application to add support for receiving the final
details from the user and checking them out. To keep the process simple, I am going to avoid
dealing with payment and fulfillment platforms, which are generally back-end services that are
not specific to Angular applications.
6.5.1 	Extending the model
To describe orders placed by users, I added a file called order.model.ts in the
src/app/model folder and defined the code shown in listing 6.20.
Listing 6.20. The contents of the order.model.ts file in the src/app/model folder
import { Injectable } from "@angular/core";
import { Cart, CartLine } from "./cart.model";
@Injectable()
export class Order {
id?: number;
-- 151 of 848 --
141
name?: string;
address?: string;
city?: string;
state?: string;
zip?: string;
country?: string;
shipped: boolean = false;
#cart: Cart;
lines: CartLine[];
constructor(c: Cart) {
this.#cart = c;
this.lines = c.lines();
}
clear() {
this.id = undefined;
this.name = this.address = this.city = undefined;
this.state = this.zip = this.country = undefined;
this.shipped = false;
this.#cart.clear();
}
}
The Order class will be another service, which means there will be one instance shared
throughout the application. When Angular creates the Order object, it will detect the Cart
constructor parameter and provide the same Cart object that is used elsewhere in the
application.
Notice that one of the property names is prefixed with a # character:
...
#cart: Cart;
...
I am going to use the built-in JavaScript serialization feature to create a string representation
of the order when it is saved. The serialization process will include all of the properties defined
by the Order class unless they are private. The TypeScript private keyword won’t affect the
serialization process because it will be erased from the JavaScript code generated by the
TypeScript compiler. The # character is the JavaScript feature for identifying private class
features and so I have to name the pro

---

## Please enter your name

</span>
</div>
<div class="form-group">
<label>Address</label>
<input class="form-control" #address="ngModel" name="address"
[(ngModel)]="order.address" required />
<span *ngIf="submitted && address.invalid" class="text-danger">

---

## Please enter your address

</span>
</div>
<div class="form-group">
<label>City</label>
<input class="form-control" #city="ngModel" name="city"
[(ngModel)]="order.city" required />
<span *ngIf="submitted && city.invalid" class="text-danger">

---

## Please enter your city

</span>
</div>
<div class="form-group">
-- 156 of 848 --
146
<label>State</label>
<input class="form-control" #state="ngModel" name="state"
[(ngModel)]="order.state" required />
<span *ngIf="submitted && state.invalid" class="text-danger">

---

## Please enter your state

</span>
</div>
<div class="form-group">
<label>Zip/Postal Code</label>
<input class="form-control" #zip="ngModel" name="zip"
[(ngModel)]="order.zip" required />
<span *ngIf="submitted && zip.invalid" class="text-danger">
Please enter your zip/postal code
</span>
</div>
<div class="form-group">
<label>Country</label>
<input class="form-control" #country="ngModel" name="country"
[(ngModel)]="order.country" required />
<span *ngIf="submitted && country.invalid" class="text-danger">

---

## Back

</button>
<button class="btn btn-primary m-1" type="submit">
Complete Order
</button>
</div>
</form>
The form and input elements in this template use Angular features to ensure that the user
provides values for each field, and they provide visual feedback if the user clicks the Complete
Order button without completing the form. Part of this feedback comes from applying the styles
that were defined in listing 6.25, and part comes from span elements that remain hidden until
the user tries to submit an invalid form.
TIP Requiring values is only one of the ways that Angular can validate form fields, and as
I explain in part 3, you can easily add your own custom validation as well.
To see the process, start with the list of products and click one of the Add To Cart buttons to
add a product to the cart. Click the Checkout button, and you will see the HTML form shown
in figure 6.6. Click the Complete Order button without entering text into any of the input
elements, and you will see the validation feedback messages. Fill out the form and click the
Complete Order button; you will see the confirmation message shown in the figure.
TIP Restart the ng serve command if you see an error after saving the template.
-- 157 of 848 --
147
Figure 6.6. Completing an order
If you look at the browser’s JavaScript console, you will see a JSON representation of the order
like this:
{"shipped":false,
"lines":[{"product":{"id":1,"name":"Product 1","category":"Category 1",
"description":"Product 1 (Category 1)","price":100},"quantity":1}],
"name":"Joe Smith","address":"123 Main Street",
"city":"Smallville","state":"New York","zip":"10036","country":"USA"}
6.6 	Using the RESTful web service
Now that the basic SportsStore functionality is in place, it is time to replace the dummy data
source with one that gets its data from the RESTful web service that was created during the
project setup in chapter 5.
To create the data source, I added a file called rest.datasource.ts in the
src/app/model folder and added the code shown in listing 6.27.
Listing 6.27. The contents of the rest.datasource.ts file in the src/app/model folder
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
-- 158 of 848 --
148
import { Product } from "./product.model";
import { Order } from "./order.model";
const PROTOCOL = "http";
const PORT = 3500;
@Injectable()
export class RestDataSource {
baseUrl: string;
constructor(private http: HttpClient) {
this.baseUrl = `${PROTOCOL}://${location.hostname}:${PORT}/`;
}
get products(): Observable<Product[]> {
return this.http.get<Product[]>(this.baseUrl + "products");
}
saveOrder(order: Order): Observable<Order> {
return this.http.post<Order>(this.baseUrl + "orders", order);
}
}
Angular provides a built-in service called HttpClient that is used to make HTTP requests.
The RestDataSource constructor receives the HttpClient service and uses the global
location object provided by the browser to

---

## This chapter covers

▪ 	Performing client authentication
▪ 	Creating a module that is loaded on demand
▪ 	Installing a component library
▪ 	Creating the administration features
In this chapter, I continue building the SportsStore application by adding administration
features. Relatively few users will need to access the administration features, so it would be
wasteful to force all users to download the administration code and content when it is unlikely
to be used. Instead, I am going to put the administration features in a separate module that
will be loaded only when it is required.
7.1 	Preparing the example application
No preparation is required for this chapter, which continues using the SportsStore project from

---

## chapter 6. To start the RESTful web service, open a command prompt and run the following

command in the SportsStore folder:
npm run json
Open a second command prompt and run the following command in the SportsStore folder
to start the development tools and HTTP server:
ng serve --open
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
-- 163 of 848 --
153
7.1.1 	Creating the module
The process for creating the feature module follows the same pattern you have seen in earlier
chapters. The key difference is that it is important that no other part of the application has
dependencies on the module or the classes it contains, which would undermine the dynamic
loading of the module and cause the JavaScript module to load the administration code, even
if it is not used.
The starting point for the administration features will be authentication, which will ensure
that only authorized users can administer the application. I created a file called
auth.component.ts in the src/app/admin folder and used it to define the component
shown in listing 7.1.
Listing 7.1. The content of the auth.component.ts file in the src/app/admin folder
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
@Component({
templateUrl: "auth.component.html"
})
export class AuthComponent {
username?: string;
password?: string;
errorMessage?: string;
constructor(private router: Router) {}
authenticate(form: NgForm) {
if (form.valid) {
// perform authentication
this.router.navigateByUrl("/admin/main");
} else {
this.errorMessage = "Form Data Invalid";
}
}
}
The component defines properties for the username and password that will be used to
authenticate the user, an errorMessage property that will be used to display messages when
there are problems, and an authenticate method that will perform the authentication
process (but that does nothing at the moment).
To provide the component with a template, I created a file called auth.component.html
in the src/app/admin folder and added the content shown in listing 7.2.
Listing 7.2. The content of the auth.component.html file in the src/app/admin folder
<div class="bg-info p-2 text-center text-white">
<h3>SportsStore Admin</h3>
</div>
<div class="bg-danger mt-2 p-2 text-center text-white"
*ngIf="errorMessage != null">
{{errorMessage}}
-- 164 of 848 --
154
</div>
<div class="p-2">
<form novalidate #form="ngForm" (ngSubmit)="authenticate(form)">
<div class="form-group">
<label>Name</label>
<input class="form-control" name="username"
[(ngModel)]="username" required />
</div>
<div class="form-group">
<label>Password</label>
<input class="form-control" type="password" name="password"
[(ngModel)]="password" required />
</div>
<div class="text-center p-2">
<button class="btn btn-secondary m-1" routerLink="/">

---

## Go back

</button>
<button class="btn btn-primary m-1" type="submit">
Log In
</button>
</div>
</form>
</div>
The template contains an HTML form that uses two-way data binding expressions for the
component’s properties. There is a button that will submit the form, a button that navigates
back to the root URL, and a div element that is visible only when there is an error message
to display.
To create a placeholder for the administration features, I added a file called
admin.component.ts in the src/app/admin folder and defined the component shown in
listing 7.3.
Listing 7.3. The contents of the admin.component.ts file in the src/app/admin folder
import { Component } from "@angular/core";
@Component({
templateUrl: "admin.component.html"
})
export class AdminComponent {}
The component doesn’t contain any functionality at the moment. To provide a template for the
component, I added a file called admin.component.html to the src/app/admin folder and
the placeholder content shown in listing 7.4.
Listing 7.4. The Contents of the admin.component.html File in the src/app/admin Folder
<div class="bg-info p-2 text-white">
<h3>Placeholder for Admin Features</h3>
</div>
To define the feature module, I added a file called admin.module.ts in the src/app/admin
folder and added the code shown in listing 7.5.
Listing 7.5. The contents of the admin.module.ts file in the src/app/admin folder
-- 165 of 848 --
155
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AuthComponent } from "./auth.component";
import { AdminComponent } from "./admin.component";
let routing = RouterModule.forChild([
{ path: "auth", component: AuthComponent },
{ path: "main", component: AdminComponent },
{ path: "**", redirectTo: "auth" }
]);
@NgModule({
imports: [CommonModule, FormsModule, routing],
declarations: [AuthComponent, AdminComponent]
})
export class AdminModule { }
The RouterModule.forChild method is used to define the routing configuration for the
feature module, which is then included in the module’s imports property.
A dynamically loaded module must be self-contained and include all the information that
Angular requires, including the routing URLs that are supported and the components they
display. If any other part of the application depends on the module, then it will be included in
the JavaScript bundle with the rest of the application code, which means that all users will
have to download code and resources for features they won’t use.
However, a dynamically loaded module is allowed to declare dependencies on the main part
of the application. This module relies on the functionality in the data model module, which has
been added to the module’s imports so that components can access the model classes and
the repositories.
7.1.2 	Configuring the URL routing system
Dynamically loaded modules are managed through the routing configuration, which trigge

---

## Home

</button>
<button *ngFor="let cat of categories()"
class="btn btn-outline-primary"
[class.active]="cat == selectedCategory()"
(click)="changeCategory(cat)">
{{cat}}
-- 167 of 848 --
157
</button>
<button class="btn btn-danger mt-5" routerLink="/admin">

---

## Admin

</button>
</div>
...
To reflect the changes, stop the development tools and restart them by running the following
command in the SportsStore folder:
ng serve
Use the browser to navigate to http://localhost:4200 and use the browser’s F12 developer
tools to see the network requests made by the browser as the application is loaded. The files
for the administration module will not be loaded until you click the Admin button, at which
point Angular will request the files and display the login page shown in figure 7.1.
Figure 7.1. Using a dynamically loaded module
Enter any name and password into the form fields and click the Log In button to see the
placeholder content, as shown in figure 7.2. If you leave either of the form fields empty, a
warning message will be displayed.
-- 168 of 848 --
158
Figure 7.2. The placeholder administration features
7.2 	Implementing authentication
The RESTful web service has been configured so that it requires authentication for the requests
that the administration feature will require. In the sections that follow, I add support for
authenticating the user by sending an HTTP request to the RESTful web service.
7.2.1 	Understanding the authentication system
When the RESTful web service authenticates a user, it will return a JSON Web Token (JWT)
that the application must include in subsequent HTTP requests to show that authentication has
been 	successfully 	performed. 	You 	can 	read 	the 	JWT 	specification 	at
https://datatracker.ietf.org/doc/html/rfc7519, but for the SportsStore application, it is enough
to know that the Angular application can authenticate the user by sending a POST request to
the /login URL, including a JSON-formatted object in the request body that contains name
and password properties. There is only one set of valid credentials in the authentication code
I added to the application in chapter 5, which is shown in table 7.1.
Table 7.1. The authentication credentials supported by the RESTful web service
Username 	Password
admin 	secret
As I noted in chapter 5, you should not hard-code credentials in real projects, but this is the
username and password that you will need for the SportsStore application.
If the correct credentials are sent to the /login URL, then the response from the RESTful
web service will contain a JSON object like this (but with a longer value for the token property,
which I have edited to fit on the page):
{
"success": true,
"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXNgOyzlg8"
}
-- 169 of 848 --
159
The success property describes the outcome of the authentication operation, and the token
property contains the JWT, which should be included in subsequent requests using the
Authorization HTTP header in this format:
Authorization: Bearer<eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXNgOyzlg8>
I configured the JWT tokens returned by the server so they expire after one hour. If the
wrong credentials are sent to the server, then the JSON object returned in the response will
just con

---

## Edit

</button>
</td>
</ng-container>
<tr mat-header-row *matHeaderRowDef="colsAndRows"></tr>
<tr mat-row *matRowDef="let row; columns: colsAndRows"></tr>
</table>
<button mat-flat-button color="primary"
routerLink="/admin/main/products/create">
Create New Product
</button>
The table relies on the features provided by the Angular Material table component, which has
an unusual approach to defining the table contents, but one that provides a good foundation
for extra features, as I demonstrate shortly. The table defines columns that display the details
of products, and each row contains a Delete button that invokes a component method named
delete method, and an Edit button that navigates to a URL that targets the editor component.
The editor component is also the target of the Create New Product button, although a different
URL is used.
Once again, custom CSS styles are required to fine-tune the layout of the table, as shown
in listing 7.30.
Listing 7.30. Defining styles in the styles.css file in the src folder
html, body { height: 100%; }
body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }
mat-toolbar span { flex: 1 1 auto; }
.menu-button { width: 100%; font-size: 1rem; }
.menu-button .mat-icon { 	margin-right: 10px; }
.menu-button span { 	flex: 1 1 auto; }
mat-sidenav { margin: 16px; width: 175px; border-right: none;
-- 186 of 848 --
176
border-radius: 4px; padding: 4px;
}
mat-sidenav .mat-divider { margin-top: 20px; margin-bottom: 5px; }
mat-sidenav-container { height: calc(100vh - 60px); }
mat-sidenav .mat-button-wrapper {
display: flex; width: 100%; justify-content: baseline;
align-content: center;
}
mat-sidenav .mat-button-wrapper 	mat-icon { margin-top: 5px; }
mat-sidenav .mat-button-wrapper span { text-align: start; }
table[mat-table] { width: 100%; table-layout: auto; }
table[mat-table] button { margin-left: 5px;}
table[mat-table] th.mat-header-cell { font-size: large; font-weight: bold;}
table[mat-table] .mat-column-name { width: 25%; }
table[mat-table] .mat-column-buttons { width: 30%; }
table[mat-table] + button[mat-flat-button] { margin-top: 10px;}
Listing 7.31 removes the placeholder content from the product table component and adds the
logic required to implement this feature.
Listing 7.31. Adding features in the productTable.component.ts file in the src/app/admin
folder
import { Component, IterableDiffer, IterableDiffers } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Product } from "../model/product.model";
import { ProductRepository } from "../model/product.repository";
@Component({
templateUrl: "productTable.component.html"
})
export class ProductTableComponent {
colsAndRows: string[] = ['id', 'name', 'category', 'price', 'buttons'];
dataSource =
new MatTableDataSource<Product>(this.repository.products());
differ: IterableDiffer<Product>;
constructor(private repository: ProductRepository,
differs: IterableDiffers) {
this.differ = differs.find(this.repository.products()).

---

## Edit

</button>
</td>
</ng-container>
<tr mat-header-row *matHeaderRowDef="colsAndRows"></tr>
<tr mat-row *matRowDef="let row; columns: colsAndRows"></tr>
</table>
-- 190 of 848 --
180
<div class="bottom-box">
<button mat-flat-button color="primary"
routerLink="/admin/main/products/create">
Create New Product
</button>
<mat-paginator [pageSize]="5" [pageSizeOptions]="[3, 5, 10]">
</mat-paginator>
</div>
The paginator must be associated with the data source that is used by the table, which is done
in the component, as shown in listing 7.34.
Listing 7.34. Connecting the paginator in the productTable.component.ts file in the
src/app/admin folder
import { Component, IterableDiffer, IterableDiffers, ViewChild }
from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Product } from "../model/product.model";
import { ProductRepository } from "../model/product.repository";
import { MatPaginator } from "@angular/material/paginator";
@Component({
templateUrl: "productTable.component.html"
})
export class ProductTableComponent {
colsAndRows: string[] = ['id', 'name', 'category', 'price', 'buttons'];
dataSource =
new MatTableDataSource<Product>(this.repository.products());
differ: IterableDiffer<Product>;
constructor(private repository: ProductRepository,
differs: IterableDiffers) {
this.differ = differs.find(this.repository.products()).create();
}
ngDoCheck() {
let changes = this.differ?.diff(this.repository.products());
if (changes != null) {
this.dataSource.data = this.repository.products();
}
}
deleteProduct(id: number) {
this.repository.deleteProduct(id);
}
@ViewChild(MatPaginator)
paginator? : MatPaginator
ngAfterViewInit() {
if (this.paginator) {
this.dataSource.paginator = this.paginator;
}
}
}
-- 191 of 848 --
181
The ViewChild decorator is used to query the component’s template content, as described
in part 2, and is used here to find the paginator component. The ngAfterViewInit method
is called after Angular has finished processing the template, also described in part 2, by which
time the paginator component will have been created and can be associated with the data
source.
And, of course, some additional CSS styles are required to manage the layout, as shown in
listing 7.35.
Listing 7.35. Defining styles in the styles.css file in the src folder
html, body { height: 100%; }
body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }
mat-toolbar span { flex: 1 1 auto; }
.menu-button { width: 100%; font-size: 1rem; }
.menu-button .mat-icon { 	margin-right: 10px; }
.menu-button span { 	flex: 1 1 auto; }
mat-sidenav { margin: 16px; width: 175px; border-right: none;
border-radius: 4px; padding: 4px;
}
mat-sidenav .mat-divider { margin-top: 20px; margin-bottom: 5px; }
mat-sidenav-container { height: calc(100vh - 60px); }
mat-sidenav .mat-button-wrapper {
display: flex; width: 100%; justify-content: baseline;
align-content: center;
}
mat-sidenav .mat-button-wrapper 	mat-icon { margin-top: 5px; }
mat-sidenav .mat-

---

## Cancel

</button>
</form>
The template contains a form with fields for the properties defined by the Product model
class. The field for the id property is shown only when editing an existing product and is
disabled because the value cannot be changed. Listing 7.39 defines the styles that are required
to lay out the form.
Listing 7.39. Defining styles in the styles.css file in the src folder
html, body { height: 100%; }
body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }
mat-toolbar span { flex: 1 1 auto; }
.menu-button { width: 100%; font-size: 1rem; }
.menu-button .mat-icon { 	margin-right: 10px; }
.menu-button span { 	flex: 1 1 auto; }
mat-sidenav { margin: 16px; width: 175px; border-right: none;
border-radius: 4px; padding: 4px;
-- 195 of 848 --
185
}
mat-sidenav .mat-divider { margin-top: 20px; margin-bottom: 5px; }
mat-sidenav-container { height: calc(100vh - 60px); }
mat-sidenav .mat-button-wrapper {
display: flex; width: 100%; justify-content: baseline;
align-content: center;
}
mat-sidenav .mat-button-wrapper 	mat-icon { margin-top: 5px; }
mat-sidenav .mat-button-wrapper span { text-align: start; }
table[mat-table] { width: 100%; table-layout: auto; }
table[mat-table] button { margin-left: 5px;}
table[mat-table] th.mat-header-cell { font-size: large; font-weight: bold;}
table[mat-table] .mat-column-name { width: 25%; }
table[mat-table] .mat-column-buttons { width: 30%; }
table[mat-table] + button[mat-flat-button] { margin-top: 10px;}
.bottom-box { background-color: white; padding-bottom: 20px;}
.bottom-box 	> 	button[mat-flat-button] { margin-top: 10px;}
.bottom-box mat-paginator { float: right; font-size: 14px; }
mat-form-field { width: 100%;}
mat-form-field:first-child { margin-top: 20px;}
form button[mat-flat-button] { margin-top: 10px; margin-right: 10px;}
h3.heading { 	margin-top: 20px; }
To see how the component works, authenticate to access the Admin features and click the
Create New Product button that appears under the table of products. Fill out the form, click
the Create button, and the new product will be sent to the RESTful web service where it will
be assigned an ID property and displayed in the product table, as shown in figure 7.7.
TIP Restart the ng serve command if you see an error after saving these changes.
-- 196 of 848 --
186
Figure 7.7. Creating a new product
The editing process works in a similar way. Click one of the Edit buttons to see the current
details, edit them using the form fields, and click the Save button to save the changes, as
shown in figure 7.8.
Figure 7.8. Editing an existing product
7.5.5 	Implementing the order table feature
The order management feature is nice and simple. It requires a table that lists the set of
orders, along with buttons that will set the shipped property or delete an order entirely. The
table will be displayed with a checkbox that will include shipped orders in the table. Listing
7.40 adds the Angular Material checkbox feature to the SportsStore project.
Listing 7.40

---

## Delete

</button>
</ng-container>
<tr mat-header-row *matHeaderRowDef="colsAndRows"></tr>
<tr mat-row *matRowDef="let row; columns: colsAndRows"></tr>
<tr class="mat-row" *matNoDataRow>
<td class="mat-cell no-data" colspan="4">No orders to display</td>
</tr>
</table>
This template contains tables within a table, which allows me to produce a variable number of
rows for each order, reflecting the customer’s product selections. There is also a checkbox that
sets a property named includeShipped, which is defined in listing 7.42, along with the rest
of the features required to support the template.
Listing 7.42. Adding features in the orderTable.component.ts file in the src/app/admin
folder
import { Component, IterableDiffer, IterableDiffers } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { Order } from "../model/order.model";
import { OrderRepository } from "../model/order.repository";
@Component({
templateUrl: "orderTable.component.html"
})
export class OrderTableComponent {
colsAndRows: string[] = ['name', 'zip','cart_p','cart_q', 'buttons'];
dataSource = new MatTableDataSource<Order>(this.repository.orders());
differ: IterableDiffer<Order>;
constructor(private repository: OrderRepository,
differs: IterableDiffers) {
this.differ = differs.find(this.repository.orders()).create();
this.dataSource.filter = "true";
this.dataSource.filterPredicate = (order, include) => {
return !order.shipped || include.toString() == "true"
};
}
get includeShipped(): boolean {
-- 199 of 848 --
189
return this.dataSource.filter == "true";
}
set includeShipped(include: boolean) {
this.dataSource.filter = include.toString()
}
toggleShipped(order: Order) {
order.shipped = !order.shipped;
this.repository.updateOrder(order);
}
delete(id: number) {
this.repository.deleteOrder(id);
}
ngDoCheck() {
let changes = this.differ?.diff(this.repository.orders());
if (changes != null) {
this.dataSource.data = this.repository.orders();
}
}
}
The way that data is filtered in this example is a good example of adapting to the way the
component library works. The support for filtering data provided by the Angular Material table
is intended to search for strings in the table and to update the filtered data only when a new
search string is specified. I have replaced the function used to filter rows and ensure that
filtering is applied by binding changes from the checkbox so that the search string is altered
each time.
The final step is to define yet more CSS to control the layout of the table and its contents,
as shown in listing 7.43.
Listing 7.43. Defining styles in the styles.css file in the src folder
html, body { height: 100%; }
body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }
mat-toolbar span { flex: 1 1 auto; }
.menu-button { width: 100%; font-size: 1rem; }
.menu-button .mat-icon { 	margin-right: 10px; }
.menu-button span { 	flex: 1 1 auto; }
mat-sidenav { margin: 16px; width: 175px; border-right: none;
border-radius: 4px; paddi

---

## This chapter covers

▪ 	Prerendering the application
▪ 	Adding progressive features
▪ 	Preparing for deployment
▪ 	Containerizing and running the deployed application
In this chapter, I prepare the SportsStore application for deployment by adding progressive
features that will allow it to work while offline and show you how to prepare and deploy the
application into a Docker container, which can be used on most hosting platforms.
8.1 	Preparing the example application
No preparation is required for this chapter, which continues using the SportsStore project from

---

## chapter 6. To start the RESTful web service, open a command prompt and run the following

command in the SportsStore folder:
npm run json
Open a second command prompt and run the following command in the SportsStore folder
to start the development tools and HTTP server:
ng serve --open
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
8.2 	Using pre-rendering
One problem with JavaScript applications is that browsers have to download some relatively
large files. Not everyone has a fast and reliable network connection, and that can mean that
-- 203 of 848 --
193
the user is presented with an empty window while their browser gradually receives the
JavaScript files that are required to start the application.
One way to improve this situation is to use server-side rendering (SSR), which presents
the browser with an HTML-only version of the application, which the user can interact with
while the JavaScript files are downloading. Once the JavaScript files are ready, the HTML
elements are rehydrated, where they become the foundation for the content generated by the
JavaScript code.
SSR can make an application usable over connections that are too slow to start the
JavaScript version of the application quickly. The main drawback of SSR is that it requires
substantial server-side resources because the application is being executed on the server to
generate the HTML the user sees.
A variation of SSR is pre-rendering, which creates a single HTML representation of the
application at build time and uses it for all users. This approach doesn’t have the flexibility of
full SSR because users all see the same HTML documents, but it requires no additional server
resources, still works with rehydration, and is well-suited to applications that want to avoid
showing users an empty browser screen without the investment that full SSR requires.
8.2.1 	Installing the SSR packages
SSR uses a package named Angular Universal, which contains all of the build tools and the
runtime configuration required for SSR and prerendering. The Angular Universal package can
be picky about the package versions it requires and so the first step is to update to the latest
Angular 16 releases. Stop the ng serve command and run the command shown in listing 8.1
in the SportsStore folder.
Listing 8.1. Updating the Angular packages
ng update @angular/cli@^16 @angular/core@^16
Once the updates have been installed, run the command shown in listing 8.2 in the SportsStore
folder to install the Angular Universal package. Select “Yes” when prompted to proceed with
the installation.
Listing 8.2. Installing the Angular Universal package
ng add @nguniversal/express-engine@^16
As part of the installation, the project will be configured for SSR, and a number of files will be
created. Once the installation has completed, enable the rehydration feature, as shown in
listing 8.3.
Listing 8.3. Enabling hydration in the app

---

## Home

</button>
<button *ngFor="let cat of categories()"
class="btn btn-outline-primary"
[class.active]="cat == selectedCategory()"
(click)="changeCategory(cat)"
[disabled]="isServer">
{{cat}}
</button>
<button class="btn btn-danger mt-5" routerLink="/admin"
[disabled]="isServer">

---

## Admin

</button>
</div>
</div>
<div class="col-9 p-2 text-dark">
<div *ngFor="let product of pagedProducts()"
class="card m-1 p-1 bg-light">
<h4>
{{product.name}}
<span class="badge rounded-pill bg-primary"
style="float:right">
{{ product.price |
currency:"USD":"symbol":"2.2-2" }}
</span>
</h4>
<div class="card-text bg-white p-1">
{{product.description}}
<button class="btn btn-success btn-sm float-end"
(click)="addProductToCart(product)"
[disabled]="isServer">
Add To Cart
</button>
</div>
</div>
<div class="form-inline float-start mr-1">
<select class="form-control" [value]="productsPerPage()"
(change)="changePageSize($any($event).target.value)"
[disabled]="isServer">
<option value="3">3 per Page</option>
<option value="4">4 per Page</option>
<option value="6">6 per Page</option>
<option value="8">8 per Page</option>
</select>
</div>
<div class="btn-group float-end">
<button *counter="let page of pageCount()"
(click)="changePage(page)"
class="btn btn-outline-primary"
[class.active]="page == selectedPage()"
[disabled]="isServer">
{{page}}
</button>
</div>
</div>
</div>
-- 209 of 848 --
199
</div>
The user will still be able to see these elements, but they will be disabled in the HTML document
that is generated by the prerendering process.
8.2.5 	Prerendering the application
Run the command shown in listing 8.9 in the SportsStore folder to prerender the application,
generating the HTML documents that will be sent to browsers while the JavaScript files are
downloaded.
Listing 8.9. Prerendering the application
npm run prerender
This 	command 	creates 	a 	static 	HTML 	representation 	of 	the 	application 	in 	the
dist/SportsStore/browser folder. There is no option to dynamically build and serve a
pre-rendered application, which means that a separate HTTP server is required. Run the
command shown in listing 8.10 in the SportsStore folder to download and execute the
excellent JavaScript http-server package. (Make sure that the npn run json command
is still running).
Listing 8.10. Running an HTTP server to deliver the prerendered application
npx http-server@14.1.1 .\dist\SportsStore\browser --port 4500
Most web browsers have support for simulating slow networks, and this is an excellent way to
test the prerendered application. For Chrome, this feature is available in the Network pane of
the F12 developer tools and there are presents for fast and slow 3G networks. Select the fast
3G option and request http://localhost:4500. This works best with a clean cache so that the
browser is sure to download all of the JavaScript files. You will see the prerendered HTML
representation of the application, which is then rehydrated once the JavaScript files are
downloaded, activating the previously disabled buttons, as shown in figure 8.1.
Figure 8.1. Prerendering an application
-- 210 of 848 --
200
8.3 	Adding progressive features
A progressive web application (PWA) behaves more like a native application, which means it
can continue working when there is no network connecti

---

## Checkout

</button>
</div>
</div>
...
8.3.4 	Testing the progressive features
Run the command shown in listing 8.17 to build and prerender the application.
Listing 8.17. Prerendering the application
npm run prerender
Once the build process is complete, run the command shown in listing 8.18 in the SportsStore
folder to start the web server. (Make sure that the npm run json command is still running
because this will be the source for data).
Listing 8.18. Running an HTTP server to deliver the prerendered application
npx http-server@14.1.1 .\dist\SportsStore\browser --port 4500
Use the browser to request http://localhost:4500. Once the application has loaded, open the
F12 development tools, navigate to the Network tab, click the arrow to the right of No throttling
or Fast 3G, and select Offline, as shown in figure 8.2. This simulates a device without
-- 214 of 848 --
204
connectivity, but since SportsStore is a progressive web application, it has been cached by the
browser, along with its data.
Figure 8.2. Going offline
Once the application is offline, the application will be loaded from the browser’s cache. If you
click an Add To Cart button, you will see that the Checkout button is disabled, as shown in
figure 8.3. Select the browser’s No throttling option, and the button will be enabled so the user
can place an order.
-- 215 of 848 --
205
Figure 8.3. Reflecting the connection status in the application
8.4 	Preparing the application for deployment
In the sections that follow, I prepare the SportsStore application so that it can be deployed.
8.4.1 	Creating the data file
When I created the RESTful web service, I provided the json-server package with a
JavaScript file, which is executed each time the server starts and ensures that the same data
is always used. That isn’t helpful in production, so I added a file called serverdata.json to
the SportsStore folder with the contents shown in listing 8.19. When the json-server
package is configured to use a JSON file, any changes that are made by the application will be
persisted.
Listing 8.19. The contents of the serverdata.json file in the SportsStore folder
{
"products": [
{ "id": 1, "name": "Kayak", "category": "Watersports",
"description": "A boat for one person", "price": 275 },
{ "id": 2, "name": "Lifejacket", "category": "Watersports",
"description": "Protective and fashionable", "price": 48.95 },
{ "id": 3, "name": "Soccer Ball", "category": "Soccer",
"description": "FIFA-approved size and weight",
"price": 19.50 },
{ "id": 4, "name": "Corner Flags", "category": "Soccer",
"description": "Give your playing field a professional touch",
"price": 34.95 },
{ "id": 5, "name": "Stadium", "category": "Soccer",
"description": "Flat-packed 35,000-seat stadium",
"price": 79500 },
{ "id": 6, "name": "Thinking Cap", "category": "Chess",
"description": "Improve brain efficiency by 75%",
"price": 16 },
{ "id": 7, "name": "Unsteady Chair", "category": "Chess",
"description": "Secretly give your opponent a disadvantage",
"pr

---

## Using secure connections for progressive web applications

When you add progressive features to an application, you must deploy it so that it can be
accessed over secure HTTP connections. If you do not, the progressive features will not
work because the underlying technology—called service workers—won’t be allowed by the
browser over regular HTTP connections.
You can test progressive features using localhost, as I demonstrate shortly, but an SSL/TLS
certificate is required when you deploy the application. If you do not have a certificate, then
a good place to start is https://letsencrypt.org, where you can get one for free, although
you should note that you also need to own the domain or hostname that you intend to
deploy to generate a certificate.
Run the commands shown in listing 8.20 in the SportsStore folder to install the packages
that are required to create the HTTP/HTTPS server.
Listing 8.20. Installing additional packages
npm install --save-dev express@4.17.3
npm install --save-dev connect-history-api-fallback@1.6.0
npm install --save-dev https@1.0.0
I added a file called server.js to the SportsStore with the content shown in listing 8.21,
which uses the newly added packages to create an HTTP and HTTPS server that includes the
json-server functionality that will provide the RESTful web service. (The json-server
package is specifically designed to be integrated into other applications.)
Listing 8.21. The contents of the server.js file in the SportsStore folder
const express = require("express");
const https = require("https");
const fs = require("fs");
const history = require("connect-history-api-fallback");
const jsonServer = require("json-server");
const bodyParser = require('body-parser');
const auth = require("./authMiddleware");
const router = jsonServer.router("serverdata.json");
const useHttps = false;
const ssloptions = {}
if (useHttps) {
ssloptions.cert = 	fs.readFileSync("./ssl/sportsstore.crt");
ssloptions.key = fs.readFileSync("./ssl/sportsstore.pem");
-- 217 of 848 --
207
}
const app = express();
app.use(bodyParser.json());
app.use(auth);
app.use("/api", router);
app.use(history());
app.use("/", express.static("./dist/SportsStore/browser"));
app.listen(80,
() => console.log("HTTP Server running on port 80"));
if (useHttps) {
https.createServer(ssloptions, app).listen(443,
() => console.log("HTTPS Server running on port 443"));
} else {
console.log("HTTPS disabled")
}
The server can read the details of the SSL/TLS certificate from files in the ssl folder, which is
where you should place the files for your certificate. If you have a certificate, then you can
enable HTTPS by setting the useHttps value to true. You will still be able to test the
application without a certificate, but you won’t be able to use the progressive features in
deployment.
8.4.3 	Changing the web service URL in the repository class
Now that the RESTful data and the application’s JavaScript and HTML content will be delivered
by the same server, I need to change the URL that the application uses to get its data, as


---

## This chapter covers

▪ 	Understanding the contents of a new Angular project
▪ 	Using the development server and build process
▪ 	Using the linter to check source code in an Angular project
▪ 	Understanding how the parts of an Angular application work together
▪ 	Creating a production build
▪ 	Starting development of an Angular project with a data model
In this chapter, I explain the structure of an Angular project and the tools that are used for
development. By the end of the chapter, you will understand how the parts of a project fit
together and have a foundation on which to apply the more advanced features that are
described in the chapters that follow.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
9.1 	Creating a new Angular project
The angular-cli package you installed in chapter 1 contains all the functionality required to
create a new Angular project that contains some placeholder content to jump-start
development, and it contains a set of tightly integrated tools that are used to build, test, and
prepare Angular applications for deployment.
-- 226 of 848 --
216
To create a new Angular project, open a command prompt, navigate to a convenient
location, and run the command shown in listing 9.1.
Listing 9.1. Creating a project
ng new example --routing false --style css --skip-git --skip-tests
The ng new command creates new projects, and the argument is the project name, which is
example in this case. The ng new command has a set of arguments that shape the project
that is created, the most useful of which are described in table 9.1.
Table 9.1. Useful ng new options
Argument 	Description
--directory 	This option is used to specify the name of the directory for the project. It
defaults to the project name.
--force 	When true, this option overwrites any existing files.
--minimal 	This option creates a project without adding support for testing
frameworks.
--package-manager 	This option is used to specify the package manager that will be used to
download and install the packages required by Angular. If omitted, NPM
will be used. Other options are yarn, pnpm, and cnpm. The default
package manager is suitable for most projects.
--prefix 	This option applies a prefix to all of the component selectors, as described
in the “Understanding How an Angular Application Works” section.
--routing 	This option is used to create a routing module in the project. I explain how
the routing feature works in detail in part 3.
--skip-git 	Using this option prevents a Git repository from being created in the
project. You must install the Git tools if you create a project without this
option.
--skip-install 	This option prevents the initial operation that downloads and installs the
packages required by Angular applications and the project’s development
tools.
--skip-tests 	This option prevents the addition

---

## Understanding global and local packages

NPM can install packages so they are specific to a single project (known as a local install)
or so they can be accessed from anywhere (known as a global install). Few packages require
global installs, but one exception is the @angular/cli package installed in chapter 2 as
part of the preparations for this book. The @angular-cli package was installed globally
so that it can be used to create new projects. The individual packages required for the
project are installed locally, into the node_modules folder.
Table 9.5. Useful NPM commands
Command 	Description
npm install 	This command performs a local install of the packages
specified in the package.json file.
npm install package@version 	This command performs a local install of a specific version of
a package and updates the package.json file to add the
package to the dependencies section.
npm install package@version
--save-dev

---

## This command performs a local install of a specific version of

a package and updates the package.json file to add the
package to the devDependencies section.
-- 233 of 848 --
223
npm install --global
package@version

---

## This command performs a global install of a specific version

of a package.
npm list 	This command lists all of the local packages and their
dependencies.
npm run <script name> 	This command executes one of the scripts defined in the
package.json file, as described next.
npx package@version 	This command downloads and executes a package.
The last two commands described in table 9.5 are oddities, but package managers have
traditionally included support for running commands that are defined in the scripts section
of the package.json file. In an Angular project, this feature is used to provide access to the
tools that are used during development and that prepare the application for deployment. Here
is the scripts section of the package.json file in the example project:
...
"scripts": {
"ng": "ng",
"start": "ng serve",
"build": "ng build",
"watch": "ng build --watch --configuration development",
"test": "ng test"
},
...
Table 9.6 summarizes these commands, and I demonstrate their use in later sections of this
chapter or later chapters in this part of the book.
Table 9.6. The commands in the scripts section of the package.json file
Name 	Description
ng 	This command runs the ng command, which provides access to the Angular
development tools.
start 	This command starts the development tools and is equivalent to the ng serve
command.
build 	This command performs the production build process.
watch 	This command starts the build process in development mode and watches for changes.
test 	This command starts the unit testing tools, which are described in part 3, and is
equivalent to the ng test command.
These commands are run by using npm run followed by the name of the command that you
require, and this must be done in the folder that contains the package.json file. So, if you
want to run the test command in the example project, navigate to the example folder and
type npm run test. You can get the same result by using the command ng test.
-- 234 of 848 --
224
The npx command is useful for downloading and executing a package in a single command,
which I use in the “Running the Production Build” section later in the chapter. Not all packages
are set up for use with npx, which is a recent feature.
ADDING PACKAGES WITH SCHEMATICS TO AN ANGULAR PROJECT
As noted in table 9.5, the npm install command can be used to add a JavaScript package
to the project. Packages installed with this command are added to the node_modules folder
and then typically require some manual integration to make them part of the Angular
application. You can see an example of this in the “Understanding the Styles Bundle” section,
where I install the popular Bootstrap CSS framework and configure Angular to include its CSS
stylesheet in the content sent to the browser.
Some JavaScript packages take advantage of the schematics API provided by the
@angular/cli package to automate the integration process. Typically, this is because the
package provides Angular-specific functionality, such as the Angular Material package, but
some package authors provide s

---

## Custom

? Set up global Angular Material typography styles? (y/N)
? Include the Angular animations module? (Use arrow keys)
> Include and enable animations
-- 235 of 848 --
225
Include, but disable animations

---

## Do not include

Each package that uses the schematics API will ask questions, and once you have made your
choices, the package will be integrated into the Angular project, and the list of files that are
changed is shown:
UPDATE package.json (1104 bytes)
UPDATE src/app/app.module.ts (423 bytes)
UPDATE angular.json (3487 bytes)
UPDATE src/index.html (552 bytes)
UPDATE src/styles.css (181 bytes)
I describe all of these files in later sections, and you will see the additions that the Angular
Material package has made to each of them.
NOTE You don’t need to understand the schematics API to add packages to an Angular
project. But if you are interested in publishing a package for use by Angular developers,
then you can learn about the features available at https://angular.io/guide/schematics-
authoring.
9.3 	Using the Angular development tools
Projects created using the ng 	new command include development tools that monitor the
application’s files and build the project when a change is detected. Run the command shown
in listing 9.3 in the example folder to start the development tools.
Listing 9.3. Starting the development tools
ng serve
The command starts the build process, which produces messages like these at the command
prompt:
...
Generating browser application bundles (phase: building)...
...
At the end of the process, you will see a summary of the bundles that have been created, like
this:
...
Initial Chunk Files 	| Names 	| 	Raw Size
vendor.js 	| vendor 	| 	2.17 MB |
styles.css, styles.js | styles 	| 341.65 kB |
polyfills.js 	| polyfills 	| 328.81 kB |
main.js 	| main 	| 	46.32 kB |
runtime.js 	| runtime 	| 	6.51 kB |
| Initial Total | 	2.87 MB
Build at: 2023-05-04T06:48:23.992Z - Hash: 4df1f6585a7d5932 - Time: 12901ms
** Angular Live Development Server is listening on localhost:4200, open
your browser on http://localhost:4200/ **
...
-- 236 of 848 --
226
9.3.1 	Understanding the development HTTP server
To simplify the development process, the project incorporates an HTTP server that is tightly
integrated with the build process. After the initial build process, the HTTP server is started,
and a message is displayed that tells you which port is being used to listen for requests, like
this:
...
** Angular Live Development Server is listening on localhost:4200, open
your browser on http://localhost:4200/ **
...
The default is port 4200, but you may see a different message if you are already using port

---

## 4200. Open a new browser window and request http://localhost:4200; you will see the

placeholder content added to the project by the ng new command, as shown in figure 9.3.
Figure 9.3. Using the HTTP development server
9.3.2 	Understanding the build process
When you run ng serve, the project is built so that it can be used by the browser. This is a
process that requires three important tools: the TypeScript compiler, the Angular compiler,
and a package named webpack.
Angular applications are created using TypeScript files and HTML templates containing
expressions, neither of which can be understood by browsers. The TypeScript compiler is
responsible for compiling the TypeScript files into JavaScript, and the Angular compiler is
responsible for transforming templates into JavaScript statements that use the browser APIs
to create the HTML elements in the template file and evaluate the expressions they contain.
The build process is managed through webpack, which is a module bundler, meaning that
it takes the compiled output and consolidates it into a module that can be sent to the browser.
-- 237 of 848 --
227
This process is known as bundling, which is a bland description for an important function, and
it is one of the key tools that you will rely on while developing an Angular application, albeit
one that you won’t deal with directly since it is managed for you by the Angular development
tools.
When you run the ng serve command, you will see a series of messages as webpack
processes the application. Webpack starts with the code in the main.ts file, which is the entry
point for the application, and follows the import statements it contains to discover its
dependencies, repeating this process for each file on which there is a dependency. Webpack
works its way through the import statements, compiling each TypeScript and template file
on which a dependency is declared to produce JavaScript code for the entire application.
NOTE This section describes the development build process. See the “Understanding the
Production Build Process” section for details of the process used to prepare an application
for deployment.
The output from the main.ts compilation process is combined into a single file, known as a
bundle. During the bundling process, webpack generates multiple bundles, each of which
contains resources required by the application. At the end of the process, you will see a
summary of the bundles that have been created, like this:
...
Initial Chunk Files 	| Names 	| 	Raw Size
vendor.js 	| vendor 	| 	2.17 MB |
styles.css, styles.js | styles 	| 341.65 kB |
polyfills.js 	| polyfills 	| 328.81 kB |
main.js 	| main 	| 	46.32 kB |
runtime.js 	| runtime 	| 	6.51 kB |
| Initial Total | 	2.87 MB
...
The initial build process can take a while to complete because five bundles are produced, as
described in table 9.7.
Table 9.7. The bundles produced by the Angular build process
Name 	Description
main.js 	This file contains the compiled output produced from the src/app folder.
polyfills.js 	This file contains JavaScript polyfills required for feat

---

## Understanding hot reloading

During development, the Angular development tools add support for a feature called hot
reloading. This is the feature that meant you saw the effect of the change in listing 9.4
automatically. The JavaScript code added to the bundle opens a connection back to the
Angular development HTTP server. When a change triggers a build, the server sends a
signal over the HTTP connection, which causes the browser to reload the application
automatically.
-- 239 of 848 --
229
UNDERSTANDING THE POLYFILLS BUNDLE
The Angular build process targets the most recent versions of browsers by default, which can
be a problem if you need to provide support for older browsers (something that commonly
arises in corporate applications where old browsers are often). The polyfills.js bundle is
used to provide implementations of JavaScript features to older versions that do not have
native support.
UNDERSTANDING THE STYLES BUNDLE
The styles.js bundle is used to add CSS stylesheets to the application. The bundle file
contains JavaScript code that uses the browser API to define styles, along with the contents of
the CSS stylesheets the application requires. (It may seem counterintuitive to use JavaScript
to distribute a CSS file, but it works well and has the advantage of making the application self-
contained so that it can be deployed as a series of JavaScript files that do not rely on additional
assets to be set up on the deployment web servers.)
CSS stylesheets are added to the application using the styles section of the
angular.json file. Run the command shown in listing 9.5 in the example folder to see the
current set of stylesheets included in the styles bundle.
Listing 9.5. Displaying the configured stylesheets
ng config "projects.example.architect.build.options.styles"
The ng 	config command is used to get and change configuration settings in the
angular.json file. The argument to the ng config command in listing 9.5 selects the
projects.example.architect.build.options.styles 	setting, which defines the
stylesheets that are included in the styles bundle and produces the following results:
[
"./node_modules/@angular/material/prebuilt-themes/indigo-pink.css",
"src/styles.css"
]
The indigo-pink.css file was added to the list when the Angular Material package was
installed. The styles.css file was added to the list as part of the initial configuration when
the project was created.
The structure of the angular.json file and the effect of the settings it contains are
described at https://angular.io/guide/workspace-config. Using this description, I was able to
determine the configuration option for the CSS stylesheets.
Many projects require no direct changes to the angular.json file and can rely on the
default settings. One exception is when manual integration is required for packages that don’t
use the schematics API. Run the command shown in listing 9.6 in the example folder to install
the popular Bootstrap CSS framework.
Listing 9.6. Adding a package to the project
npm insta

---

## Editing the configuration file directly

The commands to edit the configuration can be difficult to enter correctly, and it is easy to
mistype the character escape sequences required to ensure that the command prompt
passes the setting to the ng config command in the format it expects.
An alternative approach is to edit the angular.json file directly and add the stylesheet
to the styles section, like this:
...
"architect": {
"build": {
"builder": "@angular-devkit/build-angular:browser",
"options": {
"outputPath": "dist/example",
"index": "src/index.html",
"main": "src/main.ts",
"polyfills": [
"zone.js"
],
"tsConfig": "tsconfig.app.json",
"assets": [
"src/favicon.ico",
"src/assets"
],
"styles": [
-- 241 of 848 --
231
"./node_modules/@angular/material/prebuilt-themes/indigo-pink.css",
"src/styles.css",
"node_modules/bootstrap/dist/css/bootstrap.min.css"
],
"scripts": []
},
...
There are two styles sections in the angular.json file, and you must make sure to
add the filename to the one closest to the top of the file. Save the changes to the file and
run the command shown in listing 9.5 to check that you have edited the correct styles
section. If you don’t see the new stylesheet in the output, then you have edited the wrong
part of the file.
Add the classes shown in listing 9.9 to the div element in the app.component.html file.
These classes apply styles defined by the Bootstrap CSS framework.
Listing 9.9. Adding classes in the app.component.html file in the src/app folder
<div class="bg-primary text-white text-center">
Hello, World
</div>
The development tools do not detect changes to the angular.json file, so stop them by
typing Control+C and run the command shown in listing 9.10 in the example folder to start
them again.
Listing 9.10. Starting the Angular development tools
ng serve
A new styles.js bundle will be created during the initial startup. Reload the browser window
if the browser doesn’t reconnect to the development HTTP server, and you will see the effect
of the new styles, as shown in figure 9.5. (These styles were applied by the classes I added to
the div element in listing 9.9.)
Figure 9.5. Adding a stylesheet
-- 242 of 848 --
232
The original bundle contained just the styles.css file in the src folder, which is empty by
default (but was modified by the Angular Material installation), and the stylesheet from the
Angular Material package. Now that the bundle contains the Bootstrap stylesheet, the bundle
is larger, as shown by the build message:
...
styles.css, styles.js | styles 	| 530.97 kB
...
This may seem like a large file just for some styles, but it is this size only during development,
as I explain in the “Understanding the production build process” section.
9.3.3 	Using the linter
A linter is a tool that inspects source code to ensure that it conforms to a set of coding
conventions and rules. Run the command shown in listing 9.11 in the example folder, which
installs the popular ESLint linter package and uses the schematics API to configure the project.
Listing 9.11. A

---

## The joy and misery of linting

-- 245 of 848 --
235
Linters can be a powerful tool for good, especially in a development team with mixed levels
of skill and experience. Linters can detect common problems and subtle errors that lead to
unexpected behavior or long-term maintenance issues. A good example is the difference
between the JavaScript == and === operators, where a linter can warn when the wrong
type of comparison has been performed. I like this kind of linting, and I like to run my code
through the linting process after I have completed a major application feature or before I
commit my code into version control.
But linters can also be a tool of division and strife. In addition to detecting coding errors,
linters can be used to enforce rules about indentation, brace placement, the use of
semicolons and spaces, and dozens of other style issues. Most developers have style
preferences—I certainly do: I like four spaces for indentation, and I like opening braces to
be on the same line and the expression they relate to. I know that some programmers have
different preferences, just as I know those people are plain wrong and will one day see the
light and start formatting their code correctly.
Linters allow people with strong views about formatting to enforce them on others,
generally under the banner of being “opinionated,” which can tend toward “obnoxious.” The
logic is that developers waste time arguing about different coding styles and everyone is
better off being forced to write in the same way, which is typically the way preferred by the
person with the strong views and ignores the fact that developers will just argue about
something else because arguing is fun.
I especially dislike linting of formatting, which I see as divisive and unnecessary. I often
help readers when they can’t get book examples working (my email address is
adam@adam-freeman.com if you need help), and I see all sorts of coding style every
week. But rather than forcing readers to code my way, I just get my code editor to reformat
the code to the format that I prefer, which is a feature that every capable editor provides.
My advice is to use linting sparingly and focus on the issues that will cause real problems.
Leave formatting decisions to the individuals and rely on code editor reformatting when you
need to read code written by a team member who has different preferences.
9.4 	Understanding how an Angular application works
Angular can seem like magic when you first start using it, and it is easy to become wary of
making changes to the project files for fear of breaking something. Although there are lots of
files in an Angular application, they all have a specific purpose, and they work together to do
something far from magic: display HTML content to the user. In this section, I explain how the
example Angular application works and how each part works toward the end result.
If you stopped the Angular development tools to run the linter in the previous section, run
the command shown in listing 9.16 i

---

## chapter 13.

CREATING THE DATA SOURCE
The data source provides the application with the data. The most common type of data source
uses HTTP to request data from a web service, which I describe in part 3. For this chapter, I
need something simpler that I can reset to a known state each time the application is started
to ensure that you get the expected results from the examples. I added a file called
datasource.model.ts to the src/app folder with the code shown in listing 9.20.
Listing 9.20. The contents of the datasource.model.ts file in the src/app folder
import { Product } from "./product.model";
export class SimpleDataSource {
private data: Product[];
constructor() {
this.data = new Array<Product>(
new Product(1, "Kayak", "Watersports", 275),
new Product(2, "Lifejacket", "Watersports", 48.95),
new Product(3, "Soccer Ball", "Soccer", 19.50),
new Product(4, "Corner Flags", "Soccer", 34.95),
new Product(5, "Thinking Cap", "Chess", 16));
-- 254 of 848 --
244
}
getData(): Product[] {
return this.data;
}
}
The data in this class is hardwired, which means that any changes that are made in the
application will be lost when the browser is reloaded. This is far from useful in a real application,
but it is ideal for book examples.
CREATING THE MODEL REPOSITORY
The final step to complete the simple model is to define a repository that will provide access
to the data from the data source and allow it to be manipulated in the application. I added a
file called repository.model.ts in the src/app folder and used it to define the class
shown in listing 9.21.
Listing 9.21. The contents of the repository.model.ts file in the src/app folder
import { Product } from "./product.model";
import { SimpleDataSource } from "./datasource.model";
export class Model {
private dataSource: SimpleDataSource;
private products: Product[];
private locator = (p: Product, id: number | any) => p.id == id;
constructor() {
this.dataSource = new SimpleDataSource();
this.products = new Array<Product>();
this.dataSource.getData().forEach(p => this.products.push(p));
}
getProducts(): Product[] {
return this.products;
}
getProduct(id: number): Product | undefined {
return this.products.find(p => this.locator(p, id));
}
saveProduct(product: Product) {
if (product.id == 0 || product.id == undefined) {
product.id = this.generateID();
this.products.push(product);
} else {
let index = this.products.findIndex(p =>
this.locator(p, product.id));
this.products.splice(index, 1, product);
}
}
deleteProduct(id: number) {
let index = this.products.findIndex(p => this.locator(p, id));
if (index > -1) {
this.products.splice(index, 1);
-- 255 of 848 --
245
}
}
private generateID(): number {
let candidate = 100;
while (this.getProduct(candidate) != null) {
candidate++;
}
return candidate;
}
}
The Model class defines a constructor that gets the initial data from the data source class and
provides access to it through a set of methods. These methods are typical of those defined by
a repository and are described in table 

---

## This chapter covers

▪ 	Understanding the way that Angular responds to changes
▪ 	Using the new Angular Signals feature to describe data relationships
▪ 	Using writable signals and computed signals for efficient change detection
▪ 	Using signals with observable sequences of values
In this chapter, I explain how Angular responds to changes in the application state to update
the HTML presented to the user. I describe the approach that Angular has conventionally used
and introduce a new feature, called signals, which can be used to make dealing with changes
more efficient. Table 10.1 puts data and reactivity in context.
Table 10.1. Putting reactivity in context
Question 	Answer
What is it? 	Change detection is the process by which Angular identifies changes
in the application state and reacts by updating the HTML presented
to the user.
Why is it useful? 	Change detection is the basis by which user interaction or data
updates are reflected in the HTML content displayed by an
application.
How is it used? 	Conventionally, the developer simply presents the data that is
displayed in templates and Angular has to determine which data
values have changed. With the introduction of signals, the developer
describes the relationships between data values, which Angular uses
to minimize the amount of work required to respond to changes.
-- 261 of 848 --
251

---

## Are there any pitfalls or

limitations?
Conventional Angular change detection is simple but relatively
expensive and requires careful application design to ensure
performance. The new signals feature requires more developer effort
but means that Angular does less work.
Are there any alternatives? 	No. Some form of change detection is required to manage the
changes made to the HTML content presented to the user.
Table 10.2 summarizes the chapter.
Table 10.2. Chapter Summary
Problem 	Solution 	Listing
Update HTML based on user interaction 	Update the data values affected by the
interaction and let Angular change
detection selectively update the HTML
elements that have data bindings for those
values.
1-7

---

## Use an observable value in a computed

signal
Use the toSignal interoperability
function
18, 19
10.1 	Preparing for this chapter
For this chapter, I continue using the example project from chapter 9. No changes are required
to prepare for this chapter.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
Run the following command in the example folder to start the Angular development tools:
ng serve
Open a new browser and navigate to http://localhost:4200 to see the content, shown in figure
10.1, that will be displayed.
-- 262 of 848 --
252
Figure 10.1. Running the example application
10.2 	Understanding Angular data flow
Angular is the bridge between a web application’s data and the HTML content that is presented
to the user. The key building block is the component, which allows the developer to use
TypeScript code to select and prepare data, and a template that tells Angular how to display
that data in HTML elements. Chapter 16 describes components in depth, but for this chapter,
a simple example is enough. Listing 10.1 adds statements to the component already in the
example project to prepare data that will be displayed to the user.
Listing 10.1. Preparing data in the component.ts file in the src/app folder
import { Component } from "@angular/core";
import { Model } from "./repository.model";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
private messages = ["Total", "Price"];
private index = 0;
get count(): number {
return this.model.getProducts().length;
}
get total(): string {
return this.model.getProducts()
.reduce((total, p) => total + (p.price ?? 0), 0).toFixed(2);
}
get message(): string {
return `${this.messages[this.index]} $${this.total}`;
}
}
The new statements define total and message getters that produce string values. There
are also private properties that are used in the generation of the display values. Listing 10.2
changes the component’s template to display the message value to the user.
-- 263 of 848 --
253
Listing 10.2. Displaying data values in the template.html file in the src/app folder
<div class="bg-info text-white p-2">
There are {{ count }} products in the model
</div>
<div class="bg-primary text-white p-2">
{{ message }}
</div>
The link between the template and its component is the data binding. Angular provides a range
of bindings, and the ones used in listing 10.2, which are denoted by double curly braces ({{
and }}) inserts the count and message values from the component in the div elements.
Save the changes and you will see the content shown in figure 10.2.
Figure 10.2. Displaying data derived from the data model
Angular has processed the template, evaluated the data bindings, read the values from the
component, and use the Document Object Model (DOM) API to create the HTML elements
displayed 

---

## chapter 13, but it is enough to understand that clicking the buttons will invoke the

toggleMessage or removeProduct methods.
The final step is to import the Angular features that support user interaction, as shown in
listing 10.5. As the name of the Angular module suggests, these features are usually used with
HTML form elements, which I describe in detail in part 3.
Listing 10.5. Importing features in the app.module.ts file in the src/app folder
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule }
from '@angular/platform-browser/animations';
import { ProductComponent } from './component';
@NgModule({
declarations: [
ProductComponent
],
imports: [
BrowserModule,
BrowserAnimationsModule,
FormsModule
],
providers: [],
bootstrap: [ProductComponent]
})
export class AppModule { }
Save the changes and you will see the button. Clicking on the buttons causes the content
displayed in the browser to change, as shown in figure 10.4.
Figure 10.4. Changing content by clicking the button
-- 266 of 848 --
256
Angular responds to user interaction by invoking one of the methods defined by the
component, which alters the application’s data, as shown in figure 10.5.
Figure 10.5. The effect of user interaction
When you click either of the buttons, Angular automatically reflects the changed state of the
application in the HTML content displayed by the browser.
10.3 	Understanding Angular change detection
Angular automatically reflects changes in the application state in the HTML presented to the
user. Modern browsers are excellent at dealing with the complexities of displaying HTML, but
operations using the browser’s DOM API are still relatively slow and expensive to perform and
Angular is careful to change as little content as possible when reflecting a state change.
You can get a sense of how this works by making the changes shown in listing 10.6 to the
getters and methods defined by the component in the example application.
Listing 10.6. Adding statements in the component.ts file in the src/app folder
import { Component } from "@angular/core";
import { Model } from "./repository.model";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
private messages = ["Total", "Price"];
private index = 0;
get count(): number {
let result = 	this.model.getProducts().length;
console.log(`count value read: ${result}`);
return result;
}
get total(): string {
let result = this.model.getProducts()
.reduce((total, p) => total + (p.price ?? 0), 0).toFixed(2);
console.log(`total value read: ${result}`);
-- 267 of 848 --
257
return result;
}
get message(): string {
let result = `${this.messages[this.index]} $${this.total}`;
console.log(`message value read: ${result}`);
return result;
}
toggleMessage() {
console.clear();
console.log("toggleMessage method invoked");
this.index = (this.index + 1) % 2;
}
removeProduct() {

---

## Remove

</button>
Save the changes and click the Remove button once the application has been reloaded. The
method invoked by the button click doesn’t alter the value of the index signal, which means
that Angular knows the value of the message signal can’t have changed and doesn’t need to
be recalculated, which can be seen in the output in the browser’s JavaScript console:
removeProduct method invoked
...
count value read: 4
count value read: 4
...
Signals can coexist alongside the traditional Angular change detection process, which can be
seen by clicking the Toggle button. The method that is invoked does change the index signal,
which means that a new value for the message signal is computed. But Angular doesn’t know
how the count value is related to the signal and has to read the value to see if it has changed,
as shown in the output in the browser’s JavaScript console:
...
toggleMessage method invoked
count value read: 4
total value read: 119.40
message value read: Price $119.40
count value read: 4
...
10.4.3 	Using effects
Effects are used to execute statements when the value of another signal changes. Effects are
less useful than writable or computed signals because the code they execute occurs outside of
the change detection process. One use of effects is to generate logging messages when the
value of another signal changes, as shown in listing 10.11.
Listing 10.11. Using an effect signal in the component.ts file in the src/app folder
-- 275 of 848 --
265
import { Component, computed, effect, signal } from "@angular/core";
import { Model } from "./repository.model";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
private messages = ["Total", "Price"];
private index = signal<number>(0);
// ...statements omitted for brevity...
message = computed<string>(() =>
`${this.messages[this.index()]} $${this.total}`);
messageEffect = effect(() =>
console.log(`message value computed: ${this.message()}`));
// ...statements omitted for brevity...
}
The effect function is passed a function that is evaluated at least once so that the signals it
depends on can be detected. If any of the signals used by the effect changes, the function will
be invoked again.
CAUTION Don’t use effects to modify writeable signals or to alter any other part of the
application’s state. Doing so can cause unexpected results or errors.
Save the changes and click the Toggle button once the application has been reloaded by the
browser. The button click causes the writable signal named index to be modified, which
causes the message computed signal to change, and this triggers the effect, producing the
following output in the browser’s JavaScript console (I have highlighted the statement written
by the effect signal):
...
toggleMessage method invoked
total value read: 394.40
message value computed: Price $394.40
count value read: 5
count value read: 5
...
10.4.4 	Using signals outside of components
Signals can be

---

## Remove

</button>
Save the changes and wait for the browser to reload the application. Click the Toggle button
and you will see the following output in the browser’s JavaScript console:
...
toggleMessage method invoked
total value read: 394.40
message value computed: Price $394.40
...
The change to signals means that only the values that have been affected by the
toggleMessage method are recomputed. Clicking Remove button causes a change that
affects all of the signals used by the component, producing the following output in the
browser’s JavaScript console:
...
removeProduct method invoked
count value computed: 4
total value read: 119.40
message value computed: Price $119.40
...
The repository uses signals but ensures that changes are carefully managed.
-- 279 of 848 --
269
10.5 	Working with Reactive Extensions
Angular has long relied on a package named RxJS, also known as Reactive Extensions, or
ReactiveX. A basic knowledge of the RxJS building blocks, including how they work with signals,
can be useful in Angular development. (See https://rxjs.dev for a full description of the
features provided by the RxJS package.)
10.5.1 	Understanding observables
The key Reactive Extensions building block is an observable, which is represented by the
Observable<T> class, and which presents a sequence of values that are produced over time.
This is most often encountered when making HTTP requests, described in part 3, where the
outcome of the request is presented through an Observable<T> object. The generic type
argument 	<T> 	denotes 	the 	type 	of 	data 	the 	observable 	produces 	so 	that 	an
Observable<string> will produce a series of string values, for example.
An object can subscribe to an observable and receive a notification each time a value is
produced, allowing it to respond only when a new value has been observed. In the case of an
HTTP request, for example, the use of the observable allows the response to be handled when
it arrives, without the handler code needing to periodically check whether the request has been
completed.
NOTE If you are familiar with JavaScript, you may wonder if an Observable<T> is the
same as a Promise, which is the typical way of dealing with asynchronous operations.
The key difference is that an Observable<T> represents a series of values of type T,
rather than a single result, which better suits the way that Angular works. HTTP requests
can be handled equally well with an observable or a promise, but other Angular features
require ongoing notifications, which is where RxJS excels.
The basic method provided by an Observable<T> is subscribe, which accepts an object
whose properties are set to functions that respond to the sequence of values. The property
names and the purpose of the functions are described in table 10.5. If you only need to specify
a function that receives values, then you can pass that function as the argument to the
subscribe method.
Table 10.5. The Observable<T> subscribe argument properties
Name 	Description

---

## Remove

</button>
Using observables in a component can be a little clunky, but it works, and change detection is
triggered each time a new value is produced, as shown in figure 10.7.
Figure 10.7. Using an observable with conventional change detection
10.5.2 	Using observables with signals
Angular provides interoperability functions that allow RxJS observables to be used with signals.
This is important because computed signals will only be updated when another signal on which
they depend has changed, which means that values taken directly from an observable won’t
trigger an update.
Listing 10.18 uses the toSignal function, which creates a signal from an observable. This
allows me to remove the code that processes values produced by the observable and depend
on the observed values in a computed signal.
Listing 10.18. Creating a signal in the component.ts file in the src/app folder
import { Component, computed, effect, signal } from "@angular/core";
import { Model } from "./repository.model";
import { Ticker } from "./ticker.model";
import { toSignal } from "@angular/core/rxjs-interop";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
-- 282 of 848 --
272
private messages = ["Total", "Price"];
private index = signal<number>(0);
private ticker = new Ticker();
tickerValue = toSignal(this.ticker.value, { initialValue: 0 });
// constructor() {
// 	this.ticker.value.subscribe(newValue =>
// 	this.tickerValue = newValue);
// }
count = computed<number>(() => this.model.Products().length);
countEffect = effect(() =>
console.log(`count value computed: ${this.count()}`));
get total(): string {
let result = this.model.Products()
.reduce((total, p) => total + (p.price ?? 0), 0).toFixed(2);
console.log(`total value read: ${result}`);
return result;
}
message = computed<string>(() =>
`${this.messages[this.index()]} $${this.total} `
+ ` Ticker: ${this.tickerValue()}`);
messageEffect = effect(() =>
console.log(`message value computed: ${this.message()},`));
toggleMessage() {
console.clear();
console.log("toggleMessage method invoked");
this.index.update(currentVal => (currentVal + 1) % 2);
}
removeProduct() {
console.clear();
console.log("removeProduct method invoked");
this.model.deleteProduct(this.model.Products()[0].id ?? 0);
}
}
The toSignal function is defined in the @angular/core/rxjs-interop module and
accepts an observable and a configuration object that shapes the way the observables values
are managed as a signal. The most useful configuration properties are described in table 10.6.
NOTE There is also a toObservable functions that creates an Observable<T> from
a signal and emits a value each time the signal is changed or is recomputed. See part 3 for
examples that rely on this feature.
Table 10.6. Useful toSignal configuration object properties
Name 	Description
-- 283 of 848 --
273
initialValue 	This property is used to specify the initial value of the signal, which will be used
unt

---

## Remove

</button>
Save the changes and you will see that the new signal appears twice in the output, showing
that its value is being incorporated into a computed signal, as shown in figure 10.8.
-- 284 of 848 --
274
Figure 10.8. Creating a signal from an observable
10.6 	Summary
In this chapter, I explained how Angular detects changes in the application state and reflects
those changes in the HTML presented to the user. I introduced the new Signals feature, which
changes the way that Angular detects and responds to changes.
▪ 	Angular conventionally responds to changes by evaluating every template expression
used to generate HTML content.
▪ 	Angular has to evaluate every template expression because it has no insight into the
relationship between data values.
▪ 	Signals describe the relationship between data values so the effect of a change can be
determined without having to evaluate unaffected template expressions.
▪ 	There are three types of signals: writable signals, computed signals, and effects.
▪ 	Angular includes interoperability support for combining signals and observables.
In the next chapter, I describe how data bindings work in depth and describe the different
types of binding that Angular provides.
-- 285 of 848 --
11
Using Data Bindings

---

## This chapter covers

▪ 	Understanding how to apply a data binding
▪ 	Using data bindings to set HTML element attributes
▪ 	Using data bindings to assign elements to classes
▪ 	Using data bindings to set element style properties
▪ 	Using the string interpolation binding
The previous chapter used some simple data bindings to explain how Angular detects changes
and updates HTML content. In this chapter, I describe the basic data bindings that Angular
provides in-depth and demonstrate how they can be used to produce dynamic content. In later
chapters, I describe more advanced data bindings and explain how to extend the Angular
binding system with custom features. Table 11.1 puts data bindings in context.
Table 11.1. Putting data bindings in context
Question 	Answer
What are they? 	Data bindings are expressions embedded into templates and are
evaluated to produce dynamic content in the HTML document.
Why are they useful? 	Data bindings provide the link between the HTML elements in the
HTML document and template files with the data and code in the
application.
How are they used? 	Data bindings are applied as attributes on HTML elements or as
special sequences of characters in strings.
-- 286 of 848 --
276

---

## Are there any pitfalls or

limitations?
Data bindings contain simple JavaScript expressions that are
evaluated to generate content. The main pitfall is including too much
logic in a binding because such logic cannot be properly tested or
used elsewhere in the application. Data binding expressions should
be as simple as possible and use signals to simplify change
detection.
Are there any alternatives? 	No. Data bindings are an essential part of Angular development.
Table 11.2 summarizes the chapter.
Table 11.2. Chapter summary
Problem 	Solution 	Listing

---

## Configuring the individual styles

applied to an element
Use a style binding 	15–18
11.1 	Preparing for this chapter
For this chapter, I continue using the example project from chapter 10. To prepare for this
chapter, replace the contents of the component.ts file, as shown in listing 11.1.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
Listing 11.1. Replacing the contents of the component.ts file in the src/app folder
import { Component, computed } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
products = computed<Product[]>(() => this.model.Products());
-- 287 of 848 --
277
count = computed<number>(() => this.products().length);
classes = computed<string>(() =>
this.count() == 5 ? "bg-success" : "bg-warning");
}
The revised component defines computed signals that will be used in the examples in this
chapter. Next, replace the contents of the component’s template with the static content shown
in listing 11.2.
Listing 11.2. Replacing the contents of the template.html file in the src/app folder
<div class="bg-info text-white p-2">
Hello, World
</div>
Run the following command in the example folder to start the Angular development tools:
ng serve
Open a new browser and navigate to http://localhost:4200 to see the content, shown in figure
11.1, that will be displayed.
Figure 11.1. Running the example application
11.2 	Understanding one-way data bindings
One-way data bindings are used to generate content for the user and are the basic feature
used in Angular templates. The term one-way refers to the fact that the data flows in one
direction, meaning that data flows from the component to the data binding so that it can be
displayed in a template.
TIP There are other types of Angular data binding, which I describe in later chapters. Event
bindings flow in the other direction, from the elements in the template into the rest of the
application, and they allow user interaction. Two-way bindings allow data to flow in both
directions and are most often used in forms. See chapters 12 and 13 for details of other
bindings.
To get started, I have applied a one-way data binding in the template, as shown in listing 11.3.
-- 288 of 848 --
278
Listing 11.3. Appling a data binding in the template.html file in the src/app folder
<div [ngClass]="classes()" >
Hello, World.
</div>
When you save the changes to the template, the development tools will rebuild the application
and trigger a browser reload, displaying the output shown in figure 11.2.
Figure 11.2. Using a one-way data binding
This is a simple example, but it shows the basic structure of a data binding, which is illustrated
in figure 11.3.
Figure 11.3. The anatomy of a data b

---

## chapter 12.

ngTemplateOutlet 	This directive is used to repeat a block of content, as described in chapter 12.
UNDERSTANDING PROPERTY BINDINGS
If the binding target doesn’t correspond to a directive, then Angular checks to see whether the
target can be used to create a property binding. There are four types of property binding,
which are listed in table 11.4, along with the details of where they are described in detail.
Table 11.4. The Angular property bindings
Name 	Description
[property] 	This is the standard property binding, which is used to set a property on the
JavaScript object that represents the host element in the Document Object Model
(DOM), as described in the “Using the standard property and attribute bindings”
section.
[attr.name] 	This is the attribute binding, which is used to set the value of attributes on the host
HTML element for which there are no DOM properties, as described in the “Using
the attribute binding” section.
-- 291 of 848 --
281
[class.name] 	This is the special class property binding, which is used to configure class
membership of the host element, as described in the “Using the class bindings”
section.
[style.name] 	This is the special style property binding, which is used to configure style settings
of the host element, as described in the “Using the style bindings” section.
11.2.2 	Understanding the expression
The expression in a data binding is a fragment of JavaScript code that is evaluated to provide
a value for the target. The expression has access to the properties and methods defined by
the component, which is how the binding in listing 11.3 can reads the value of the classes
signal to provide the ngClass directive with the name of the class that the host element
should be added to.
Expressions are not restricted to calling methods or reading properties from the
component; they can also perform most standard JavaScript operations. As an example, listing
11.4 shows an expression that has a literal string value being concatenated with the value
read from the classes signal.
Listing 11.4. Performing an operation in the template.html file in the src/app folder
<div [ngClass]="'text-white p-2 ' + classes()" >
Hello, World.
</div>
The expression is enclosed in double quotes, which means that the string literal has to be
defined using single quotes. The JavaScript concatenation operator is the + character, and the
result from the expression will be the combination of both strings, like this:
text-white p-2 bg-success
The effect is that the ngClass directive will add the host element to three classes: text-
white and p-2, which Bootstrap uses to set the text color and add margin and padding around
an element’s content; and bg-success, which sets the background color. Figure 11.4 shows
the combination of these classes.
Figure 11.4. Combining classes in a JavaScript expression
-- 292 of 848 --
282
It is easy to get carried away when writing expressions and include complex logic in the
template. This can cause problems because

---

## This binding evaluates the expression and uses the

result to set the element’s membership of myClass.
<div [ngClass]="map"></div> 	This binding sets class membership of multiple classes
using the data in a map object.
SETTING ALL OF AN ELEMENT’S CLASSES WITH THE STANDARD BINDING
The standard property binding can be used to set all of an element’s classes in a single step,
which is useful when you have a method or property in the component that returns all of the
classes to which an element should belong in a single string, with the names separated by
spaces.
Listing 11.10 adds a method to the component that returns a different set of classes based
on the price property of a selected element in the products array.
Listing 11.10. Adding a method in the component.ts file in the src/app folder
import { Component, computed } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
products = computed<Product[]>(() => this.model.Products());
count = computed<number>(() => this.products().length);
classes = computed<string>(() =>
this.count() == 5 ? "bg-success" : "bg-warning");
getClasses(key: number) {
return "p-2 " + (((this.products()[key].price ?? 0) > 50)
? "bg-info" : "bg-warning");
}
}
The result from the getClasses method will include the p-2 class, which adds padding
around the host element’s content, for all Product objects. If the value of the price property
is less than 50, the bg-info class will be included in the result, and if the value is 50 or more,
the bg-warning class will be included (these classes set different background colors). You
must ensure that the names of the classes are separated by spaces.
Listing 11.11 replaces the contents of the template.html file to show the standard
property binding used to set the class property of host elements using the component’s
getClasses method.
-- 299 of 848 --
289
Listing 11.11. Setting class memberships in the template.html file in the src/app folder
<div class="text-white">
<div [class]="getClasses(0)">
The first product is {{ products()[0].name }}
</div>
<div [class]="getClasses(1)">
The second product is {{ products()[1].name }}
</div>
</div>
When the standard property binding is used to set the class property, the result of the
expression replaces any previous classes that an element belonged to, which means that it
can be used only when the binding expression returns all the classes that are required, as in
this example, producing the result shown in figure 11.8.
Figure 11.8. Setting class memberships
SETTING INDIVIDUAL CLASSES USING THE SPECIAL CLASS BINDING
The special class binding provides finer-grained control than the standard property binding and
allows membership of a single class to be managed using an expression. This is useful if you
want to build on the existing class memberships of an element, rather than replace them
entirely. Listing 11.12 

---

## Understanding the nullish operator precedence pitfall

Care must be taken when using the nullish operator when it is combined with other
JavaScript operations, especially when the results are combined to form strings. Here is an
example of a problem statement:
...
return "p-2 " + (product.price ?? 0 < 50 ? "bg-info" : "bg-warning");
...
The problem arises because the nullish operator has a lower precedence than the less than
operator. Here is the same statement with the addition of parentheses that show how the
statement is evaluated:
...
return "p-2 " + ((product.price ?? (0 < 50)) ? "bg-info" : "bg-warning");
...
The effect is that the less than operator is applied only when the product.price
property is null, and, even then, it is used only to determine if 0 is less than 50. Since
JavaScript comparisons work on truthiness, the outcome from the ternary operator is
always true: the product.price property will be truthy when it is not null, and the
-- 302 of 848 --
292
0 < 50 expression is truthy when the product.price property is null. The effect is
that the statement always returns the string "p-2 bg-info".
The solution is to use parentheses to group related terms together and avoid relying on
JavaScript operator precedence, like this:
...
return "p-2 " + ((product.price ?? 0) < 50 ? "bg-info" : "bg-warning");
...
This ensures that the expression evaluated by the ternary operator behaves as intended.
Listing 11.13. Returning a class map object in the component.ts file in the src/app folder
import { Component, computed } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
products = computed<Product[]>(() => this.model.Products());
count = computed<number>(() => this.products().length);
classes = computed<string>(() =>
this.count() == 5 ? "bg-success" : "bg-warning");
getClasses(key: number) {
return "p-2 " + (((this.products()[key].price ?? 0) > 50)
? "bg-info" : "bg-warning");
}
getClassMap(key: number): Object {
let product = this.products()[key];
return {
"text-center bg-danger": product.name == "Kayak",
"bg-info": (product.price ?? 0) < 50
};
}
}
The getClassMap method returns an object with properties whose values are one or more
class names, with values based on the property values of the Product object whose key is
specified as the method argument. As an example, when the key is 0, the method returns this
object:
...
{
"text-center bg-danger":true,
"bg-info":false
-- 303 of 848 --
293
}
...
The first property will assign the host element to the text-center class (which Bootstrap
uses to center the text horizontally) and the bg-danger class (which sets the element’s
background color). The second property evaluates to false, which means that the host
element will not be added to the bg-info class. It may seem odd to specify a property that
doesn’t result in an element being added to a class, but, as you will s

---

## This binding sets multiple style properties using

the data in a map object.
SETTING A SINGLE STYLE PROPERTY
The standard property binding and the special style bindings are used to set the value of a
single style property. The difference between these bindings is that the standard property
binding must include the units required for the style, while the special binding allows for the
units to be included in the binding target. To demonstrate the difference, listing 11.15 adds
two new properties to the component.
Listing 11.15. Adding properties in the component.ts file in the src/app folder
import { Component, computed } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
products = computed<Product[]>(() => this.model.Products());
count = computed<number>(() => this.products().length);
classes = computed<string>(() =>
this.count() == 5 ? "bg-success" : "bg-warning");
getClasses(key: number) {
return "p-2 " + (((this.products()[key].price ?? 0) > 50)
? "bg-info" : "bg-warning");
}
-- 305 of 848 --
295
getClassMap(key: number): Object {
let product = this.products()[key];
return {
"text-center bg-danger": product.name == "Kayak",
"bg-info": (product.price ?? 0) < 50
};
}
fontSizeWithUnits: string = "30px";
fontSizeWithoutUnits: string= "30";
}
The fontSizeWithUnits property returns a value that includes a quantity and the units that
quantity is expressed in: 30 pixels. The fontSizeWithoutUnits property returns just the
quantity, without any unit information. Listing 11.16 replaces the contents of the
template.html file to show how these properties can be used with the standard and special
bindings.
CAUTION Do not try to use the standard property binding to target the style property
to set multiple style values. The object returned by the style property of the JavaScript
object that represents the host element in the DOM is read-only. Some browsers will ignore
this and allow changes to be made, but the results are unpredictable and cannot be relied
on. If you want to set multiple style properties, then create a binding for each of them or
use the ngStyle directive.
Listing 11.16. Using style bindings in the template.html file in the src/app folder
<div class="text-white">
<div class="p-2 bg-warning">
The <span [style.fontSize]="fontSizeWithUnits">first</span>
product is {{products()[0].name}}
</div>
<div class="p-2 bg-info">
The <span [style.fontSize.px]="fontSizeWithoutUnits">second</span>
product is {{products()[1].name}}
</div>
</div>
The target for the binding is style.fontSize, which sets the size of the font used for the
host element’s content. The expression for this binding uses the fontSizeWithUnits
property, whose value includes the units, px for pixels, required to set the font size.
The target for the special binding is style.fontSize.px, which tells Angular that the
value of the expression specifies t

---

## This chapter covers

▪ 	Using the ngIf and ngSwitch directives to selectively include elements
▪ 	Using the ngFor directive to generate content for each element in a sequence
▪ 	Using micro-templates to repeat content
▪ 	Understanding the restrictions Angular places on data binding expressions
In this chapter, I describe the built-in directives that are responsible for some of the most
commonly required functionality for creating web applications: selectively including content,
choosing between different fragments of content, and repeating content. I also describe some
limitations that Angular puts on the expressions that are used for one-way data bindings and
the directives that provide them. Table 12.1 puts the built-in template directives in context.
Table 12.1. Putting the built-in directives in context
Question 	Answer
What are they? 	The built-in directives described in this chapter are responsible for
selectively including content, selecting between fragments of content,
and repeating content for each item in an array. There are also
directives for setting an element’s styles and class memberships, as
described in chapter 11.
Why are they useful? 	The tasks that can be performed with these directives are the most
common and fundamental in web application development, and they
provide the foundation for adapting the content shown to the user
based on the data in the application.
-- 310 of 848 --
300
How are they used? 	The directives are applied to HTML elements in templates. There are
examples throughout this chapter (and in the rest of the book).

---

## Are there any pitfalls or

limitations?
The syntax for using the built-in template directives requires you to
remember that some of them (including ngIf and ngFor) must be
prefixed with an asterisk, while others (including ngClass,
ngStyle, and ngSwitch) must be enclosed in square brackets. I
explain why this is required in the “Understanding Micro-Template
Directives” sidebar, but it is easy to forget and get an unexpected
result.
Are there any alternatives? 	You could write custom directives—a process that I described in
chapters 14 and 15—but the built-in directives are well-written and
comprehensively tested. For most applications, using the built-in
directives is preferable, unless they cannot provide exactly the
functionality that is required.
Table 12.2 summarizes the chapter.
Table 12.2. Chapter summary
Problem 	Solution 	Listing

---

## Apply a directive without

using an HTML element
Use the ng-container element 	16
Preventing template errors 	Avoid modifying the application state as a side effect of
a data binding expression
17–20
Avoiding context errors 	Ensure that data binding expressions use only the
properties and methods provided by the template’s
component
21–23
-- 311 of 848 --
301
12.1 	Preparing the example project
This chapter relies on the example project from chapter 11. To prepare for this chapter, listing
12.1 simplifies the component class.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
Listing 12.1. The contents of the component.ts file in the src/app folder
import { Component, computed } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
targetName: string = "Kayak";
products = computed<Product[]>(() => this.model.Products());
count = computed<number>(() => this.products().length);
product(key: number): Product | undefined {
return this.model.getProduct(key);
}
removeProduct() {
this.model.deleteProduct(this.model.Products()[0].id ?? 0);
}
}
Listing 12.2 shows the contents of the template file, which displays the number of products in
the data model by calling the component’s new getProductCount method.
Listing 12.2. The contents of the template.html file in the src/app folder
<div class="text-white">
<div class="bg-info p-2">
There are {{ count() }} products.
</div>
</div>
<button class="btn btn-info text-white mt-2" (click)="removeProduct()">

---

## Remove

</button>
Run the following command from the command line in the example folder to start the
TypeScript compiler and the development HTTP server:
ng serve
-- 312 of 848 --
302
Open a new browser window and navigate to http://localhost:4200 to see the content shown
in figure 12.1.
Figure 12.1. Running the example application
12.2 	Using the built-in directives
Angular comes with a set of built-in directives that provide features commonly required in web
applications. Table 12.3 describes the available directives, which I demonstrate in the sections
that follow (except for the ngClass and ngStyle directives, which are covered in chapter
11).
Table 12.3. The built-in directives
Example 	Description
<div *ngIf="expr">
</div>
The ngIf directive is used to include an element and
its content in the HTML document if the expression
evaluates as true. The asterisk before the directive
name indicates that this is a micro-template directive,
as described in the “Understanding micro-template
directives” sidebar.
<div [ngSwitch]="expr">
<span *ngSwitchCase="expr">
</span>
<span *ngSwitchDefault>
</span>
</div>
The ngSwitch directive is used to choose between
multiple elements to include in the HTML document
based on the result of an expression, which is then
compared to the result of the individual expressions
defined using ngSwitchCase directives. If none of
the ngSwitchCase values matches, then the
element to which the ngSwitchDefault directive
has been applied will be used. The asterisks before
the ngSwitchCase and ngSwitchDefault
-- 313 of 848 --
303
directives indicate they are micro-template directives,
as described in the “Understanding micro-template
directives” sidebar.
<div *ngFor="#item of expr">
</div>
The ngFor directive is used to generate the same
set of elements for each object in an array. The
asterisk before the directive name indicates that this
is a micro-template directive, as described in the
“Understanding Micro-Template Directives” sidebar.
<div ngClass="expr">
</div>
The ngClass directive is used to manage class
membership, as described in chapter 11.
<div ngStyle="expr">
</div>
The ngStyle directive is used to manage styles
applied directly to elements (as opposed to applying
styles through classes), as described in chapter 11.
<ng-template [ngTemplateOutlet]
="myTempl">
</ngtemplate>
The ngTemplateOutlet directive is used to
repeat a block of content in a template.
12.2.1 	Using the ngIf directive
ngIf is the simplest of the built-in directives and is used to include a fragment of HTML in the
document when an expression evaluates as true, as shown in listing 12.3.
Listing 12.3. Using the ngIf directive in the template.html file in the src/app folder
<div class="text-white">
<div class="bg-info p-2">
There are {{ count() }} products.
</div>
<div *ngIf="count() > 4" class="bg-info p-2 mt-1">
There are more than 4 products in the model
</div>
<div *ngIf="product(0)?.name != 'Kayak'" class="bg-info p-2 mt-1">
The first product isn't a Ka

---

## Remove

</button>
The ngIf directive has been applied to two div elements, with expressions that check the
number of Product objects in the model and whether the name of the first Product is Kayak.
The first expression evaluates as true, which means that div element and its content will
be included in the HTML document; the second expression evaluates as false, which means
that the second div element will be excluded. Figure 12.2 shows the result.
-- 314 of 848 --
304
NOTE The ngIf directive adds and removes elements from the HTML document, rather
than just showing or hiding them. Use the property or style bindings, described in chapter
11, if you want to leave elements in place and control their visibility, either by setting the
hidden element property to true or by setting the display style property to none.
Figure 12.2. Using the ngIf directive
Understanding micro-template directives
Some directives, such as ngFor, ngIf, and the nested directives used with ngSwitch,
are prefixed with an asterisk, as in *ngFor, *ngIf, and *ngSwitch. The asterisk is
shorthand for using directives that rely on content provided as part of the template, known
as a micro-template. Directives that use micro-templates are known as structural
directives, a description that I revisit in chapter 15 when I show you how to create them.
Listing 12.3 applied the ngIf directive to div elements, telling the directive to use the
div element and its content as the micro-template for each of the objects that it processes.
Behind the scenes, Angular expands the micro-template and the directive like this:
...
<ng-template ngIf="count() > 4">
<div class="bg-info p-2 mt-1">
There are more than 4 products in the model
</div>
</ng-template>
...
-- 315 of 848 --
305
You can use either syntax in your templates, but if you use the compact syntax, then you
must remember to use the asterisk.
Like all directives, the expression used for ngIf will be re-evaluated to reflect changes in the
data model. Click the Remove button to invoke the component’s removeProduct method and
remove the first object from the data repository.
The effect of modifying the data is to remove the first div element because there are too
few Product objects now and to add the second div element because the name property of
the first Product in the array is no longer Kayak. Figure 12.3 shows the change.
Figure 12.3. The effect of reevaluating directive expressions
12.2.2 	Using the ngSwitch directive
The ngSwitch directive selects one of several elements based on the expression result, similar
to a JavaScript switch statement. Listing 12.4 shows the ngSwitch directive being used to
choose an element based on the number of objects in the model.
Listing 12.4. Using the ngSwitch directive in the template.html file in the src/app folder
<div class="text-white">
<div class="bg-info p-2">
There are {{ count() }} products.
</div>
<div class="bg-info p-2 mt-1" [ngSwitch]="count()">
<span *ngSwitchCase="2">There are two products</span>


---

## Remove

-- 316 of 848 --
306
</button>
The ngSwitch directive syntax can be confusing to use. The element that the ngSwitch
directive is applied to is always included in the HTML document, and the directive name isn’t
prefixed with an asterisk. Instead, it must be specified within square brackets, like this:
...
<div class="bg-info p-2 mt-1" [ngSwitch]="count()">
...
Each of the inner elements, which are span elements in this example, is a micro-template,
and the directives that specify the target expression result are prefixed with an asterisk, like
this:
...
<span *ngSwitchCase="5">There are five products</span>
...
The ngSwitchCase directive is used to specify an expression result. If the ngSwitch
expression evaluates to the specified result, then that element and its contents will be included
in the HTML document. If the expression doesn’t evaluate to the specified result, then the
element and its contents will be excluded from the HTML document.
The ngSwitchDefault directive is applied to a fallback element—equivalent to the
default label in a JavaScript switch statement—which is included in the HTML document if
the expression result doesn’t match any of the results specified by the ngSwitchCase
directives.
For the initial data in the application, the directives in listing 12.4 produce the following
HTML:
...
<div class="bg-info p-2 mt-1" ng-reflect-ng-switch="5">
<span>There are five products</span>
</div>
...
The div element, to which the ngSwitch directive has been applied, is always included in the
HTML document. For the initial data in the model, the span element whose ngSwitchCase
directive has a result of 5 is also included, producing the result shown on the left of figure
12.4.
Figure 12.4. Using the ngSwitch directive
-- 317 of 848 --
307
The ngSwitch binding responds to changes in the data model, which you can test by clicking
the Remove button. Neither of the results for the two ngSwitchCase directives matches the
result from the getProductCount expression, so the ngSwitchDefault element is included
in the HTML document, as shown on the right of figure 12.4.
AVOIDING LITERAL VALUE PROBLEMS
A common problem arises when using the ngSwitchCase directive to specify literal string
values, and care must be taken to get the right result, as shown in listing 12.5.
Listing 12.5. Component and string literal values in the template.html file in the src/app
folder
<div class="text-white">
<div class="bg-info p-2">
There are {{ count() }} products.
</div>
<div class="bg-info p-2 mt-1" [ngSwitch]="product(1)?.name">
<span *ngSwitchCase="targetName">Kayak</span>
<span *ngSwitchCase="'Lifejacket'">Lifejacket</span>
<span *ngSwitchDefault>Other Product</span>
</div>
</div>
<button class="btn btn-info text-white mt-2" (click)="removeProduct()">

---

## Remove

</button>
The values assigned to the ngSwitchCase directives are also expressions, which means you
can invoke methods, perform simple inline operations, and read property values, just as you
would for the basic data bindings.
As an example, this expression tells Angular to include the span element to which the
directive has been applied when the result of evaluating the ngSwitch expression matches
the value of the targetName property defined by the component:
...
<span *ngSwitchCase="targetName">Kayak</span>
...
If you want to compare a result to a specific string, then you must double-quote it, like this:
...
<span *ngSwitchCase="'Lifejacket'">Lifejacket</span>
...
This expression tells Angular to include the span element when the value of the ngSwitch
expression is equal to the literal string value Lifejacket, producing the result shown in
figure 12.5.
-- 318 of 848 --
308
Figure 12.5. Using expressions and literal values with the ngSwitch directive
12.2.3 	Using the ngFor directive
The ngFor directive repeats a section of content for each object in an array, providing the
template equivalent of a foreach loop. In listing 12.6, I have used the ngFor directive to
populate a table by generating a row for each Product object in the model.
Listing 12.6. Using the ngFor directive in the template.html file in the src/app folder
<div class="text-white">
<div class="bg-info p-2">
There are {{ count() }} products.
</div>
<div class="p-1">
<table class="table table-sm table-bordered text-dark">
<tr><th>Name</th><th>Category</th><th>Price</th></tr>
<tr *ngFor="let item of products()">
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td>{{item.price}}</td>
</tr>
</table>
</div>
</div>
<button class="btn btn-info text-white mt-2" (click)="removeProduct()">

---

## Remove

</button>
The expression used with the ngFor directive is more complex than for the other built-in
directives, but it will start to make sense when you see how the different parts fit together.
Here is the directive that I used in the example:
...
<tr *ngFor="let item of products()">
-- 319 of 848 --
309
...
The asterisk before the name is required because the directive is using a micro-template, as
described in the “Understanding Micro-Template Directives” sidebar. This will make more sense
as you become familiar with Angular, but at first, you just have to remember that this directive
requires an asterisk (or, as I often do, forget until you see an error displayed in the browser’s
JavaScript console and then remember).
For the expression itself, there are two distinct parts, joined with the of keyword. The
right-hand part of the expression provides the data source that will be enumerated.
...
<tr *ngFor="let item of products()">
...
This example specifies the component’s products signal as the source of data, which allows
content to be produced for each of the Product objects in the model.
The left-hand side of the ngFor expression defines a template variable, denoted by the
let keyword, which is how data is passed between elements within an Angular template.
...
<tr *ngFor="let item of products()">
...
The ngFor directive assigns the variable to each object in the data source so that it is available
for use by the nested elements. The local template variable in the example is called item, and
it is used to access the Product object’s properties for the td elements, like this:
...
<td>{{item.name}}</td>
...
Put together, the directive in the example tells Angular to enumerate the objects returned by
the component’s products signal, assign each of them to a variable called item, and then
generate a tr element and its td children, evaluating the template expressions they contain.
For the example in listing 12.6, the result is a table where the ngFor directive is used to
generate table rows for each of the Product objects in the model and where each table row
contains td elements that display the value of the Product object’s name, category, and
price properties, as shown in figure 12.6.
-- 320 of 848 --
310
Figure 12.6. Using the ngFor directive to create table rows
USING OTHER TEMPLATE VARIABLES
The most important template variable is the one that refers to the data object being processed,
which is item in the previous example. But the ngFor directive supports a range of other
values that can also be assigned to variables and then referred to within the nested HTML
elements, as described in table 12.4 and demonstrated in the sections that follow.
Table 12.4. The ngFor local template values
Name 	Description
index 	This number value is assigned to the position of the current object.
count 	This number value is assigned the number of elements in the data source.
odd 	This boolean value returns true if the current object has an odd-numbered positio

---

## Remove

</button>
A new term is added to the ngFor expression, separated using a semicolon (the ; character).
The new expressions uses the let keyword to assign the index value to a local template
variable called i and the count value to a local template variable named c, like this:
...
<tr *ngFor="let item of products(); let i = index; let c = count">
...
This allows the values to be accessed within the nested elements using bindings, like this:
...
<td>{{ i + 1 }} of {{ c }}</td>
...
The index value is zero-based, and adding 1 to the template variable creates a simple counter,
producing the result shown in figure 12.7.
-- 322 of 848 --
312
Figure 12.7. Using the index value
USING THE ODD AND EVEN VALUES
The odd value is true when the index value for a data item is odd. Conversely, the even
value is true when the index value for a data item is even. In general, you only need to use
either the odd or even value since they are boolean values where odd is true when even
is false, and vice versa. In listing 12.8, the odd value is used to manage the class
membership of the tr elements in the table.
Listing 12.8. Using the odd Value in the template.html File in the src/app Folder
<div class="text-white">
<div class="bg-info p-2">
There are {{count()}} products.
</div>
<div class="p-1">
<table class="table table-sm table-bordered text-dark">
<tr><th></th><th>Name</th><th>Category</th><th>Price</th></tr>
<tr *ngFor="let item of products(); let i = index;
let c = count; let odd = odd"
class="text-white" [class.bg-primary]="odd"
[class.bg-info]="!odd">
-- 323 of 848 --
313
<td>{{ i + 1 }} of {{ c }}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td>{{item.price}}</td>
</tr>
</table>
</div>
</div>
<button class="btn btn-info text-white mt-2" (click)="removeProduct()">

---

## Remove

</button>
I have used a semicolon and added another term to the ngFor expression that assigns the
odd value to a local template variable that is also called odd.
...
<tr *ngFor="let item of products(); let i = index;
let c = count; let odd = odd"
class="text-white" [class.bg-primary]="odd"
[class.bg-info]="!odd">
...
This may seem redundant, but you cannot access the ngFor values directly and must use a
local variable even if it has the same name. I use the class binding and the odd variable to
assign alternate rows to the bg-primary and bg-info classes, which are Bootstrap
background color classes that stripe the table rows, as shown in figure 12.8.
-- 324 of 848 --
314
Figure 12.8. Using the odd value
Expanding the *ngFor directive
Notice that in listing 12.8, I can use the template variable in expressions applied to the
same tr element that defines it. This is possible because ngFor is a micro-template
directive—denoted by the * that precedes the name—and so Angular expands the HTML so
that it looks like this:
...
<table class="table table-sm table-bordered text-dark">
<tr><th></th><th>Name</th><th>Category</th><th>Price</th></tr>
<ng-template ngFor let-item [ngForOf]="products()"
let-i="index" 	let-c="count" let-odd="odd">
<tr class="text-white" [class.bg-primary]="odd"
[class.bg-info]="!odd">
<td>{{ i + 1 }} of {{ c }}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td>{{item.price}}</td>
</tr>
</ng-template>
</table>
-- 325 of 848 --
315
...
You can see that the ng-template element defines the variables, using the somewhat
awkward let-<name> attributes, which are then accessed by the tr and td elements
within it. As with so much in Angular, what appears to happen by magic turns out to be
straightforward once you understand what is going on behind the scenes, and I explain
these features in detail in chapter 15. A good reason to use the *ngFor syntax is that it
provides a more elegant way to express the directive expression, especially when there are
multiple template variables.
USING THE FIRST AND LAST VALUES
The first value is true only for the first object in the sequence provided by the data source
and is false for all other objects. Conversely, the last value is true only for the last object
in the sequence. Listing 12.9 uses these values to treat the first and last objects differently
from the others in the sequence.
Listing 12.9. Using the first and last values in the template.html file in the src/app folder
<div class="text-white">
<div class="bg-info p-2">
There are {{count()}} products.
</div>
<div class="p-1">
<table class="table table-sm table-bordered text-dark">
<tr><th></th><th>Name</th><th>Category</th><th>Price</th></tr>
<tr *ngFor="let item of products(); let i = index;
let c = count; let odd = odd; let first = first;
let last = last"
class="text-white" [class.bg-primary]="odd"
[class.bg-info]="!odd"
[class.bg-warning]="first || last">
<td>{{ i + 1 }} of {{ c }}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>

---

## Remove

</button>
The new terms in the ngFor expression assign the first and last values to template
variables called first and last. These variables are then used by a class binding on the
tr element, which assigns the element to the bg-warning class when either is true, and
are used by the ngIf directive on one of the td elements, which will exclude the element for
the last item in the data source, producing the effect shown in figure 12.9.
-- 326 of 848 --
316
Figure 12.9. Using the first and last values
MINIMIZING ELEMENT OPERATIONS
When there is a change to the data model, the ngFor directive evaluates its expression and
updates the elements that represent its data objects. The update process can be expensive,
especially if the data source is replaced with one that contains different objects representing
the same data. Replacing the data source may seem like an odd thing to do, but it happens
often in web applications, especially when the data is retrieved from a web service, like the
ones I describe in part 3. The same data values are represented by new objects, which presents
an efficiency problem for Angular. To demonstrate the problem, I added a method to the
component that replaces one of the Product objects in the data model, as shown in listing
12.10.
Listing 12.10. Replacing an object in the component.model.ts file in the src/app folder
import { Component, computed } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
-- 327 of 848 --
317
targetName: string = "Kayak";
products = computed<Product[]>(() => this.model.Products());
count = computed<number>(() => this.products().length);
product(key: number): Product | undefined {
return this.model.getProduct(key);
}
removeProduct() {
this.model.deleteProduct(this.model.Products()[0].id ?? 0);
}
swapProduct() {
let p = this.products()[0];
if (p != null && p.id != null) {
this.model.deleteProduct(p.id);
this.model.saveProduct( { ...p, id: 0 });
}
}
}
The swapProduct method removes the first object from the array and adds a new object that
has the same values for the name, category, and price properties. This is an example of
data values being represented by a new object. Listing 12.11 adds a button element to the
component’s template to invoke the new method.
Listing 12.11. Adding a button in the template.html file in the src/app folder
<div class="text-white">
<div class="bg-info p-2">
There are {{count()}} products.
</div>
<div class="p-1">
<table class="table table-sm table-bordered text-dark">
<tr><th></th><th>Name</th><th>Category</th><th>Price</th></tr>
<tr *ngFor="let item of products(); let i = index;
let c = count; let odd = odd; let first = first;
let last = last"
class="text-white" [class.bg-primary]="odd"
[class.bg-info]="!odd"
[class.bg-warning]="first || last">
<td>{{ i + 1 }} of {{ c }}</td>
<td>{{i

---

## Swap

</button>
Save the changes and click the Swap button once the browser reloads the application. The
swapProduct method is invoked, the data model is modified, and the change detection
process is triggered.
When the ngFor directive examines its data source, it sees it has two operations to perform
to reflect the change to the data. The first operation is to destroy the HTML elements that
represent the first object in the array. The second operation is to create a new set of HTML
elements to represent the new object at the end of the array.
Angular has no way of determining that the data objects it is dealing with have the same
values and that it could perform its work more efficiently by moving, rather than recreating,
HTML elements.
This problem affects only two sets of elements in this example, but the problem is much
more severe when the data in the application is refreshed from an external data source, such
as a web service, where all the data model objects can be replaced each time that a response
is received. Since it is not aware that there have been few real changes, the ngFor directive
has to destroy its HTML elements and create new ones, which can be an expensive and time-
consuming operation.
To improve the efficiency of an update, you can define a component method that will help
Angular determine when two different objects represent the same data, as shown in listing
12.12.
Listing 12.12. Adding a comparison in the component.ts file in the src/app folder
import { Component, computed } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
// ...statements omitted for brevity...
getKey(index: number, product: Product) {
return product.name;
}
}
The method has to define two parameters: the position of the object in the data source and
the data object. The result of the method uniquely identifies an object, and two objects are
considered to be equal if they produce the same result.
Two Product objects will be considered equal if they have the same name value. Telling
the ngFor expression to use the comparison method is done by adding a trackBy term to
the expression, as shown in listing 12.13.
-- 329 of 848 --
319
Listing 12.13. Providing an equality method in the template.html file in the src/app folder
<div class="text-white">
<div class="bg-info p-2">
There are {{count()}} products.
</div>
<div class="p-1">
<table class="table table-sm table-bordered text-dark">
<tr><th></th><th>Name</th><th>Category</th><th>Price</th></tr>
<tr *ngFor="let item of products(); let i = index;
let c = count; let odd = odd; let first = first;
let last = last; trackBy:getKey"
class="text-white" [class.bg-primary]="odd"
[class.bg-info]="!odd"
[class.bg-warning]="first || last">
<td>{{ i + 1 }} of {{ c }}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td *ngIf="!last">{{

---

## Swap

</button>
With this change, the ngFor directive will know that the Product that is removed from the
array using the swapProduct method defined in listing 12.13 is considered equivalent to the
one that is added to the array, even though they are different objects. Rather than delete and
create elements, the existing elements can be moved, which is a much simpler and quicker
task to perform.
Changes can still be made to the elements—such as by the ngIf directive, which will
remove one of the td elements because the new object will be the last item in the data
source, but even this is faster than treating the objects separately.

---

## Testing the equality method

Checking whether the equality method has an effect is a little tricky. The best way that I
have found requires using the browser’s F12 developer tools, in this case using the Chrome
browser.
Once the application has loaded, right-click the td element that contains the word Kayak
in the browser window and select Inspect from the pop-up menu. This will open the
Developer Tools window and show the Elements panel.
-- 330 of 848 --
320
Click the ellipsis button (marked ...) in the left margin and select Add Attribute from the
menu. Add an id attribute with the value old. This will result in an element that looks like
this:
<td id="old">Kayak</td>
Adding an id attribute makes it possible to access the object that represents the HTML
element using the JavaScript console. Switch to the Console panel and enter the following
statement:
window.old
When you hit Return, the browser will locate the element by its id attribute value and
display the following result:
<td id="old">Kayak</td>
Now click the Swap button. Once the change to the data model has been processed,
executing the following statement in the JavaScript console will determine whether the td
element to which the id attribute was added has been moved or destroyed:
window.old
If the element has been moved, then you will see the element shown in the console, like
this:
<td id="old">Kayak</td>
If the element has been destroyed, then there won’t be an element whose id attribute is
old, and the browser will display the word undefined.
12.2.4 	Using the ngTemplateOutlet directive
The ngTemplateOutlet directive is used to repeat a block of content at a specified location,
which can be useful when you need to generate the same content in different places. Listing
12.14 replaces the contents of the template.html file to show the ngTemplateOutlet
directive in use.
Listing 12.14. Replacing the contents of the template.html file in the src/app folder
<ng-template #titleTemplate>
<h4 class="p-2 bg-success text-white">Repeated Content</h4>
</ng-template>
<ng-template [ngTemplateOutlet]="titleTemplate"></ng-template>
<div class="bg-info p-2 m-2 text-white">
There are {{count()}} products.
</div>
<ng-template [ngTemplateOutlet]="titleTemplate"></ng-template>
-- 331 of 848 --
321
The first step is to define the template that contains the content that you want to repeat using
the directive. This is done using the ng-template element and assigning it a name using a
reference variable, like this:
...
<ng-template #titleTemplate let-title="title">
<h4 class="p-2 bg-success text-white">Repeated Content</h4>
</ng-template>
...
When Angular encounters the reference variable, it sets its value to the element to which it
has been defined, which is the ng-template element in this case. The second step is to insert
the content into the HTML document, using the ngTemplateOutlet directive, like this:
...
<ng-template [ngTemplateOutlet]="titleTemplate"></ng-template>
...
The expression is the name of the reference variable tha

---

## Bindings cannot contain assignments

...
Angular will report an error if a data binding expression contains an operator that can be used
to perform an assignment, such as =, +=, -+, ++, and --.
When Angular is running in development mode, it performs an additional check to make
sure that one-way data bindings have not been modified after their expressions are evaluated.
To demonstrate, listing 12.19 adds a property to the component that removes and returns a
Product object from the model array.
Listing 12.19. Modifying data in the component.ts file in the src/app folder
import { Component, computed } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
// ...statements omitted for brevity...
counter: number = 1;
get nextProduct(): Product | undefined {
this.removeProduct();
return this.products()[0];
}
}
In listing 12.20, you can see the data binding that I used to read the nextProduct property.
Listing 12.20. Binding to a property in the template.html file in the src/app folder
<div class="bg-info p-2 text-white">
Product Names:
<ng-container *ngFor="let item of products(); let last = last">
{{ item.name}}<ng-container *ngIf="!last">,</ng-container>
-- 336 of 848 --
326
</ng-container>
</div>
<div class="bg-info p-2 text-white">
Next Product is {{nextProduct?.name}}
</div>
When the browser reloads, you will see the following error in the JavaScript console:
...
ERROR Error: NG0600: Writing to signals is not allowed in a `computed` or
an `effect` by default.
...
Angular has detected the attempt to make a change while producing a value for inclusion in a
template and generated an error.
12.3.2 	Understanding the expression context
When Angular evaluates an expression, it does so in the context of the template’s component,
which is how the template can access methods and properties without any kind of prefix, like
this:
...
<div class="bg-info p-2 text-white">
Next Product is {{nextProduct?.name}}
</div>
...
When Angular processes these expressions, the component provides the nextProduct
property, which Angular incorporates into the HTML document. The component is said to
provide the template’s expression context.
The expression context means you can’t access objects defined outside of the template’s
component, and in particular, templates can’t access the global namespace. The global
namespace is used to define common utilities, such as the console object, which defines the
log method I have been using to write out debugging information to the browser’s JavaScript
console in earlier chapters. The global namespace also includes the Math object, which
provides access to some useful arithmetic methods, such as min and max.
To demonstrate this restriction, listing 12.21 adds a string interpolation binding to the
template that relies on the Math.floor method to round down a number value to the nearest
inte

---

## This chapter covers

▪ 	Using bindings to respond to events
▪ 	Using template references
▪ 	Using two-way bindings to synchronize component properties and HTML elements
▪ 	Validating form data and displaying validation error messages
In this chapter, I continue describing the basic Angular functionality, focusing on features that
respond to user interaction. I explain how to create event bindings and how to use two-way
bindings to manage the flow of data between the model and the template. One of the main
forms of user interaction in a web application is the use of HTML forms, and I explain how
event bindings and two-way data bindings are used to support them and validate the content
that the user provides. Table 13.1 puts events and forms in context.
Table 13.1. Putting event bindings and forms in context
Question 	Answer
What are they? 	Event bindings evaluate an expression when an event is triggered,
such as a user pressing a key, moving the mouse, or submitting a form.
The broader form-related features build on this foundation to create
forms that are automatically validated to ensure that the user provides
useful data.
Why are they useful? 	These features allow the user to change the state of the application,
changing or adding to the data in the model.
How are they used? 	Each feature is used differently. See the examples throughout the
chapter for details.
-- 340 of 848 --
330

---

## Are there any pitfalls or

limitations?
In common with all Angular bindings, the main pitfall is using the wrong
kind of bracket to denote a binding. Pay close attention to the examples
in this chapter and check the way you have applied bindings when you
don’t get the results you expect.
Are there any alternatives? 	No. These features are a core part of Angular.
Table 13.2 summarizes the chapter.
Table 13.2. Chapter summary
Problem 	Solution 	Listing
Responding to an event 	Use an event binding 	1–5
Getting details of an event 	Use the $event object 	6–8

---

## Validating the data provided by

the user
Perform form validation 	15–26
13.1 	Preparing the example project
For this chapter, I will continue using the example project that I created in chapter 9 and have
been modifying in the chapters since.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
To prepare for this chapter, listing 13.1 simplifies the component class and adds a writable
signal, named selectedProduct.
Listing 13.1. Simplifying the component in the component.ts file in the src/app folder
import { Component, computed, signal } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "app",
templateUrl: "template.html"
-- 341 of 848 --
331
})
export class ProductComponent {
private model: Model = new Model();
products = computed<Product[]>(() => this.model.Products());
count = computed<number>(() => this.products().length);
product(key: number): Product | undefined {
return this.model.getProduct(key);
}
selectedProduct = signal<string | undefined>(undefined);
}
Listing 13.2 simplifies the component’s template, leaving just a table that is populated using
the ngFor directive.
Listing 13.2. Simplifying the template in the template.html file in the src/app folder
<div class="p-2">
<table class="table table-sm table-bordered">
<tr><th></th><th>Name</th><th>Category</th><th>Price</th></tr>
<tr *ngFor="let item of products(); let i = index">
<td>{{i + 1}}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td>{{item.price}}</td>
</tr>
</table>
</div>
To start the development server, open a command prompt, navigate to the example folder,
and run the following command:
ng serve
Open a new browser window and navigate to http://localhost:4200 to see the table shown in
figure 13.1.
-- 342 of 848 --
332
Figure 13.1. Running the example application
13.2 	Using the event binding
The event binding is used to respond to the events sent by the host element. Listing 13.3
demonstrates the event binding, which allows a user to interact with an Angular application.
Listing 13.3. Using the event binding in the template.html file in the src/app folder
<div class="p-2">
<div class="bg-info text-white p-2">
Selected Product: {{selectedProduct() ?? '(None)'}}
</div>
<table class="table table-sm table-bordered">
<tr><th></th><th>Name</th><th>Category</th><th>Price</th></tr>
<tr *ngFor="let item of products(); let i = index">
<td (mouseover)="selectedProduct.set(item.name)">{{i + 1}}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td>{{item.price}}</td>
</tr>
</table>
</div>
When you save the changes to the template, you can test the binding by moving the mouse
pointer over the first column in the HTML table, which displays a series of numbers. As the
mouse moves from row to row, the name of the product displayed in that row is disp

---

## Filtering key events

The input event is triggered every time the content in the input element is changed.
This provides an immediate and responsive set of changes, but it isn’t what every
application requires, especially if updating the application state involves expensive
operations.
The event binding has built-in support to be more selective when binding to keyboard
events, which means that updates will be performed only when a specific key is pressed.
Here is a binding that responds to every keystroke:
...
<input #product class="form-control"
(keyup)="selectedProduct.set(product.value)" />
...
The keyup event is a standard DOM event, and the result is that application is updated as
the user releases each key while typing in the input element. I can be more specific about
which key I am interested in by specifying its name as part of the event binding, like this:
-- 352 of 848 --
342
...
<input #product class="form-control"
(keyup.enter)="selectedProduct.set(product.value)" />
...
The key that the binding will respond to is specified by appending a period after the DOM
event name, followed by the name of the key. This binding is for the Enter key, and the
result is that the changes in the input element won’t be pushed into the rest of the
application until that key is pressed.
13.3 	Using two-way data bindings
Bindings can be combined to create a two-way flow of data for a single element, allowing the
HTML document to respond when the application model changes and also allowing the
application to respond when the element emits an event, as shown in listing 13.10.
Listing 13.10. Creating a two-way binding in the template.html file in the src/app folder
<div class="p-2">
<div class="bg-info text-white p-2">
Selected Product: {{ selectedProduct() ?? '(None)' }}
</div>
<table class="table table-sm table-bordered">
<tr *ngFor="let item of products(); let i = index"
[class.bg-info]="getSelected(item)">
<td (mouseover)="selectedProduct.set(item.name)">{{i + 1}}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td>{{item.price}}</td>
</tr>
</table>
<div class="form-group">
<label>Product Name</label>
<input class="form-control"
(input)="selectedProduct.set($any($event).target.value)"
[value]="selectedProduct() ?? ''" />
</div>
<div class="form-group">
<label>Product Name</label>
<input class="form-control"
(input)="selectedProduct.set($any($event).target.value)"
[value]="selectedProduct() ?? ''" />
</div>
</div>
Each of the input elements has an event binding and a property binding. The event binding
responds to the input event by updating the component’s selectedProduct signal. The
property binding ties the value of the selectedProduct signal to the element’s value
property.
The result is that the contents of the two input elements are synchronized, and editing
one causes the other to be updated as well. And, since there are other bindings in the template
-- 353 of 848 --
343
that depend on the selectedProduct signal, editing the contents of an input element also
ch

---

## Importing the forms module

The features demonstrated in this chapter rely on the Angular forms module, which I added
to the example application in chapter 10 to demonstrate change detection and signals. As
a reminder, here are the contents of the app.module.ts file with the required
statements emphasized:
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule }
from '@angular/platform-browser/animations';
import { ProductComponent } from './component';
@NgModule({
declarations: [
ProductComponent
],
imports: [
BrowserModule,
BrowserAnimationsModule,
FormsModule
],
providers: [],
bootstrap: [ProductComponent]
})
export class AppModule { }
Adding FormsModule to the list of dependencies enables the form features and makes
them available for use throughout the application.
Listing 13.11. Accessing a signal in the component.ts file in the src/app folder
import { Component, computed, signal } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "app",
templateUrl: "template.html"
-- 355 of 848 --
345
})
export class ProductComponent {
private model: Model = new Model();
products = computed<Product[]>(() => this.model.Products());
count = computed<number>(() => this.products().length);
product(key: number): Product | undefined {
return this.model.getProduct(key);
}
selectedProduct = signal<string | undefined>(undefined);
get selectedProductProp() { return this.selectedProduct(); }
set selectedProductProp(val) { this.selectedProduct.set(val)};
getSelected(product: Product): boolean {
return product.name == this.selectedProduct();
}
handleInputEvent(ev: Event) {
if (ev.target instanceof HTMLInputElement) {
this.selectedProduct.set(ev.target.value);
}
}
}
This awkwardness reflects the Angular transition to signals and is only practical for small
numbers of bindings. Listing 13.12 shows how to replace the separate bindings with the
ngModel directive.
Listing 13.12. Using the ngModel directive in the template.html file in the src/app folder
<div class="p-2">
<div class="bg-info text-white p-2">
Selected Product: {{ selectedProduct() ?? '(None)' }}
</div>
<table class="table table-sm table-bordered">
<tr *ngFor="let item of products(); let i = index"
[class.bg-info]="getSelected(item)">
<td (mouseover)="selectedProduct.set(item.name)">
{{i + 1}}
</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td>{{item.price}}</td>
</tr>
</table>
<div class="form-group">
<label>Product Name</label>
<input class="form-control" [(ngModel)]="selectedProductProp" />
</div>
<div class="form-group">
<label>Product Name</label>
<input class="form-control" [(ngModel)]="selectedProductProp" />
</div>
-- 356 of 848 --
346
</div>
Using the ngModel directive requires combining the syntax of the property and event bindings,
as illustrated in figure 13.7. A co

---

## Create

</button>
</div>
Each input element is grouped with a label and contained in a div element, which is styled
using the Bootstrap form-group class. Individual input elements are assigned to the
Bootstrap form-control class to manage the layout and style.
The ngModel binding has been applied to each input element to create a two-way binding
with the corresponding property on the component’s newProduct object, like this:
-- 359 of 848 --
349
...
<input class="form-control" [(ngModel)]="newProduct.name" />
...
There is also a button element, which has a binding for the click event that calls the
component’s addProduct method, passing in the newProduct value as an argument.
...
<button class="btn btn-primary" (click)="addProduct(newProduct)">

---

## Create

</button>
...
Finally, a string interpolation binding is used to display a JSON representation of the
component’s newProduct property at the top of the template, like this:
...
<div class="bg-info text-white mb-2 p-2">
Model Data: {{jsonProduct}}
</div>
...
The overall result, illustrated in figure 13.8, is a set of input elements that update the
properties of a Product object managed by the component, which are reflected immediately
in the JSON data.
Figure 13.8. Using the form elements to create a new object in the data model
When the Create button is clicked, the JSON representation of the component’s newProduct
property is written to the browser’s JavaScript console, producing a result like this:
-- 360 of 848 --
350
New Product: {"name":"Running Shoes","category":"Running","price":"120.23"}
13.4.2 	Adding form data validation
At the moment, any data can be entered into the input elements in the form. Data validation
is essential in web applications because users will enter a surprising range of data values,
either in error or because they want to get to the end of the process as quickly as possible and
enter garbage values to proceed.
Angular provides an extensible system for validating the content of form elements. Table
13.4 lists the attributes that you can add to input elements, each of which defines a validation
rule.
Table 13.4. The built-in Angular validation attributes
Attribute 	Description
email 	This attribute is used to specify a well-formatted email address.
required 	This attribute is used to specify a value that must be provided.
minlength 	This attribute is used to specify a minimum number of characters.
maxlength 	This attribute is used to specify a maximum number of characters. This type of
validation cannot be applied directly to form elements because it conflicts with the
HTML5 attribute of the same name. It can be used with model-based forms, which
are described later in the chapter.
min 	This attribute is used to specify a minimum value.
max 	This attribute is used to specify a maximum value.
pattern 	This attribute is used to specify a regular expression that the value provided by the
user must match.
You may be familiar with these attributes because they are part of the HTML specification, but
Angular builds on these properties with some additional features. Listing 13.15 removes all but
one of the input elements to demonstrate the process of adding validation to the form as
simply as possible. (I restore the missing elements at the end of the chapter.)
Listing 13.15. Adding form validation in the template.html file in the src/app folder
<div class="p-2">
<div class="bg-info text-white mb-2 p-2">
Model Data: {{jsonProduct}}
</div>
<form (ngSubmit)="addProduct(newProduct)">
<div class="form-group">
<label>Name</label>
<input class="form-control"
name="name"
[(ngModel)]="newProduct.name"
required
-- 361 of 848 --
351
minlength="5"
pattern="^[A-Za-z ]+$" />
</div>
<button class="btn btn-primary mt-2" type="submit">

---

## Create

</button>
</form>
</div>
Angular requires elements being validated to define the name attribute, which is used to
identify the element in the validation system. Since this input element is being used to
capture the value of the Product.name property, the name attribute on the element has been
set to name.
This listing adds three of the validation attributes to the input element. The required
attribute specifies that the user must provide a value, the minlength attribute specifies that
there should be at least three characters, and the pattern attribute specifies that only
alphabetic characters and spaces are allowed.
Finally, notice that a form element has been added to the template. Although you can use
input elements independently, the Angular validation features work only when there is a
form element present, and Angular will report an error if you add the ngControl directive to
an element that is not contained in a form.
When using a form element, the convention is to use an event binding for a special event
called ngSubmit like this:
...
<form (ngSubmit)="addProduct(newProduct)">
...
The ngSubmit binding handles the form element’s submit event. You can achieve the same
effect binding to the click event on individual button elements within the form if you prefer.
STYLING ELEMENTS USING VALIDATION CLASSES
Once you have saved the template changes in listing 13.15 and the browser has reloaded the
HTML, right-click the input element in the browser window and select Inspect or Inspect
Element from the pop-up window. The browser will display the HTML representation of the
element in the Developer Tools window, and you will see that the input element has been
added to three classes, like this:
...
<input name="name" required="" minlength="5" pattern="^[A-Za-z ]+$"
class="form-control ng-pristine ng-invalid ng-touched"
ng-reflect-required="" ng-reflect-minlength="5"
ng-reflect-pattern="^[A-Za-z ]+$" ng-reflect-name="name">
...
The classes to which an input element is assigned provide details of its validation state. There
are three pairs of validation classes, which are described in table 13.5. Elements will always
be members of one class from each pair, for a total of three classes. The same classes are
applied to the form element to show the overall validation status of all the elements it contains.
As the status of the input element changes, the ngControl directive switches the classes
automatically for both the individual elements and the form element.
-- 362 of 848 --
352
Table 13.5. The Angular form validation classes
Name 	Description
ng-untouched
ng-touched
An element is assigned to the ng-untouched class if it has not been visited
by the user, which is typically done by tabbing through the form fields. Once
the user has visited an element, it is added to the ng-touched class.
ng-pristine
ng-dirty
An element is assigned to the ng-pristine class if its contents have not
been changed by the user and to the ng-dirty class otherwise. Once the
con

---

## Product names must be at least

{{ name.errors?.['minlength'].requiredLength }}
characters
</li>
</ul>
</div>
<button class="btn btn-primary mt-2" type="submit">

---

## Create

</button>
</form>
</div>
To get validation working, I have to create a template reference variable to access the
validation state in expressions, which I do like this:
...
<input class="form-control" name="name" [(ngModel)]="newProduct.name"
#name="ngModel" required minlength="5" pattern="^[A-Za-z ]+$"/>
...
I create a template reference variable called name and set its value to ngModel. This use of
an ngModel value is a little confusing: it is a feature provided by the ngModel directive to
give access to the validation status. This will make more sense once you have read the chapters
in which I explain how to create custom directives and you see how they provide access to
their features. For this chapter, it is enough to know that to display validation messages, you
need to create a template reference variable and assign it ngModel to access the validation
data for the input element. The object that is assigned to the template reference variable
defines the properties that are described in table 13.6. All of the properties described in the
table are nullable.
Table 13.6. The validation object properties
Name 	Description
path 	This property returns the name of the element.
valid 	This property returns true if the element’s contents are valid and false otherwise.
invalid 	This property returns true if the element’s contents are invalid and false otherwise.
pristine 	This property returns true if the element’s contents have not been changed.
dirty 	This property returns true if the element’s contents have been changed.
touched 	This property returns true if the user has visited the element.
untouched 	This property returns true if the user has not visited the element.
-- 365 of 848 --
355
errors 	This property returns a ValidationErrors object whose properties correspond to
each attribute for which there is a validation error.
value 	This property returns the value of the element, which is used when defining custom
validation rules, as described in the “Creating Custom Form Validators” section.
Listing 13.17 displays the validation messages in a list. The list should be shown only if there
is at least one validation error, so I applied the ngIf directive to the ul element, with an
expression that uses the dirty and invalid properties, like this:
...
<ul class="text-danger list-unstyled mt-1"
*ngIf="name.dirty && name.invalid">
...
Within the ul element, there is an li element that corresponds to each validation error that
can occur. Each li element has an ngIf directive that uses the errors property described
in table 13.6, like this:
...
<li *ngIf="name.errors?.['required']">

---

## You must enter a product name

</li>
...
The errors.[required] property will be defined only if the element’s contents have failed
the required validation check, which ties the visibility of the li element to the outcome of
that validation check.
Each property defined by the errors object returns an object whose properties provide
details of why the content has failed the validation check for its attribute, which can be used
to make the validation messages more helpful to the user. Table 13.7 describes the error
properties provided for each attribute.
Table 13.7. The Angular form validation error description properties
Name 	Description
email 	This property returns true if the email attribute has been
applied to the input element. This is not especially useful
because this can be deduced from the fact that the property
exists.
required 	This property returns true if the required attribute has been
applied to the input element. This is not especially useful
because this can be deduced from the fact that the property
exists.
minlength.requiredLength 	This property returns the number of characters required to satisfy
the minlength attribute.
-- 366 of 848 --
356
minlength.actualLength 	This property returns the number of characters entered by the
user.
maxlength.requiredLength 	This property returns the number of characters required to satisfy
the maxlength attribute.
maxlength.actualLength 	This property returns the number of characters entered by the
user.
min.actual 	This property returns the value entered by the user.
min.min 	This property returns the minimum value required to satisfy the
min attribute.
max.actual 	This property returns the value entered by the user.
max.max 	This property returns the minimum value required to satisfy the
max attribute.
pattern.requiredPattern 	This property returns the regular expression that has been
specified using the pattern attribute.
pattern.actualValue 	This property returns the contents of the element.
These properties are not displayed directly to the user, who is unlikely to understand an error
message that includes a regular expression, although they can be useful during development
to figure out validation problems. The exception is the minlength.requiredLength
property, which can be useful for avoiding the duplication of the value assigned to the
minlength attribute on the element, like this:
...
<li *ngIf="name.errors?.['minlength']">

---

## Product names must be at least

{{ name.errors?.['minlength'].requiredLength }}
characters
</li>
...
The overall result is a set of validation messages that are shown as soon as the user starts
editing the input element and that change to reflect each new keystroke, as illustrated in
figure 13.10.
-- 367 of 848 --
357
Figure 13.10. Displaying validation messages
USING THE COMPONENT TO DISPLAY VALIDATION MESSAGES
Defining separate elements for all possible validation errors quickly becomes verbose in
complex forms. A better approach is to add logic to the component to prepare the validation
messages in a method, which can then be displayed to the user through the ngFor directive
in the template. Listing 13.18 shows the addition of a component method that accepts the
validation state for an input element and produces an array of validation messages.
Listing 13.18. Generating messages in the component.ts file in the src/app folder
import { Component, computed, signal } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
import { NgModel, ValidationErrors } from "@angular/forms";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
products = computed<Product[]>(() => this.model.Products());
count = computed<number>(() => this.products().length);
product(key: number): Product | undefined {
return this.model.getProduct(key);
}
-- 368 of 848 --
358
newProduct: Product = new Product();
get jsonProduct() {
return JSON.stringify(this.newProduct);
}
addProduct(p: Product) {
console.log("New Product: " + this.jsonProduct);
}
getMessages(errs : ValidationErrors | null, name: string) : string[] {
let messages: string[] = [];
for (let errorName in errs) {
switch (errorName) {
case "required":
messages.push(`You must enter a ${name}`);
break;
case "minlength":
messages.push(`A ${name} must be at least
${errs['minlength'].requiredLength}
characters`);
break;
case "pattern":
messages.push(`The ${name} contains
illegal characters`);
break;
}
}
return messages;
}
getValidationMessages(state: NgModel, thingName?: string) {
let thing: string = state.path?.[0] ?? thingName;
return this.getMessages(state.errors, thing)
}
}
The getValidationMessages and getMessages methods use the properties described in
table 13.6 to produce validation messages for each error, returning them in a string array. To
make this code as widely applicable as possible, the method accepts a value that describes the
data item that an input element is intended to collect from the user, which is then used to
generate error messages, like this:
...
messages.push(`You must enter a ${name}`);
...
This is an example of the JavaScript string interpolation feature, which allows strings to be
defined like templates, without having to use the + operator to include data values. Note that
the template string is denoted with backtick characters (the ` character and not the regular
JavaScript ' character). Th

---

## Create

</button>
</form>
</div>
There is no visual change, but the same method can be used to produce validation messages
for multiple elements, which results in a simpler template that is easier to read and maintain.
13.4.3 	Validating the entire form
Displaying validation error messages for individual fields is useful because it helps emphasize
where problems need to be fixed. But it can also be useful to validate the entire form. Care
must be taken not to overwhelm the user with error messages until they try to submit the
form, at which point a summary of any problems can be useful. In preparation, listing 13.20
adds two new members to the component.
Listing 13.20. Enhancing the component in the component.ts file in the src/app folder
import { Component, computed, signal } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
import { NgModel, ValidationErrors, NgForm } from "@angular/forms";
@Component({
selector: "app",
-- 370 of 848 --
360
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
// ...statements omitted for brevity...
formSubmitted: boolean = false;
submitForm(form: NgForm) {
this.formSubmitted = true;
if (form.valid) {
this.addProduct(this.newProduct);
this.newProduct = new Product();
form.resetForm();
this.formSubmitted = false;
}
}
}
The formSubmitted property will be used to indicate whether the form has been submitted
and will be used to prevent validation of the entire form until the user has tried to submit.
The submitForm method will be invoked when the user submits the form and receives an
NgForm object as its argument. This object represents the form and defines the set of
validation properties; these properties are used to describe the overall validation status of the
form so that, for example, the invalid property will be true if there are validation errors on
any of the elements contained by the form. In addition to the validation property, NgForm
provides the resetForm method, which resets the validation status of the form and returns
it to its original and pristine state.
The effect is that the whole form will be validated when the user performs a submit, and if
there are no validation errors, a new object will be added to the data model before the form is
reset so that it can be used again. Listing 13.21 shows the changes required to the template
to take advantage of these new features and implement form-wide validation.
Listing 13.21. Performing validation in the template.html file in the src/app folder
<div class="p-2">
<form #form="ngForm" (ngSubmit)="submitForm(form)">
<div class="bg-danger text-white p-2 mb-2"
*ngIf="formSubmitted && form.invalid">

---

## There are problems with the form

</div>
<div class="form-group">
<label>Name</label>
<input class="form-control"
name="name"
[(ngModel)]="newProduct.name"
#name="ngModel"
required
minlength="5"
pattern="^[A-Za-z ]+$" />
-- 371 of 848 --
361
<ul class="text-danger list-unstyled mt-1"
*ngIf="(formSubmitted || name.dirty) && name.invalid">
<li *ngFor="let error of getValidationMessages(name)">
{{error}}
</li>
</ul>
</div>
<button class="btn btn-primary mt-2" type="submit">

---

## Create

</button>
</form>
</div>
The form element now defines a reference variable called form, which has been assigned to
ngForm. This is how the ngForm directive provides access to its functionality, through a
process that I describe in chapter 14. For now, however, it is important to know that the
validation information for the entire form can be accessed through the form reference variable.
The listing also changes the expression for the ngSubmit binding so that it calls the
submitForm method defined by the controller, passing in the template variable, like this:
...
<form ngForm="productForm" #form="ngForm" (ngSubmit)="submitForm(form)">
...
It is this object that is received as the argument of the submitForm method and that is used
to check the validation status of the form and to reset the form so that it can be used again.
Listing 13.21 also adds a div element that uses the formSubmitted property from the
component along with the valid property (provided by the form template variable) to show
a warning message when the form contains invalid data, but only after the form has been
submitted.
In addition, the ngIf binding has been updated to display the field-level validation
messages so that they will be shown when the form has been submitted, even if the element
itself hasn’t been edited. The result is a validation summary that is shown only when the user
submits the form with invalid data, as illustrated by figure 13.11.
-- 372 of 848 --
362
Figure 13.11. Displaying a validation summary message
DISPLAYING SUMMARY VALIDATION MESSAGES
In a complex form, it can be helpful to provide the user with a summary of all the validation
errors that have to be resolved. The NgForm object assigned to the form template reference
variable provides access to the individual elements through a property named controls. This
property returns an object that has properties for each of the individual elements in the form.
For example, there is a name property that represents the input element in the example,
which is assigned an object that represents that element and defines the same validation
properties that are available for individual elements. In listing 13.22, I have added a method
to the component that receives the object assigned to the form element’s template reference
variables and uses its controls property to generate a list of error messages for the entire
form.
Listing 13.22. Validation messages in the component.ts file in the src/app folder
import { Component, computed, signal } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
import { NgModel, ValidationErrors, NgForm } from "@angular/forms";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
// ...statements omitted for brevity...
getFormValidationMessages(form: NgForm): string[] {
let messages: string[] = [];
Object.keys(form.controls).forEach(k => {
this.getMessag

---

## There are problems with the form

<ul>
<li *ngFor="let error of getFormValidationMessages(form)">
{{error}}
</li>
</ul>
</div>
<div class="form-group">
<label>Name</label>
<input class="form-control"
name="name"
[(ngModel)]="newProduct.name"
#name="ngModel"
required
minlength="5"
pattern="^[A-Za-z ]+$" />
<ul class="text-danger list-unstyled mt-1"
*ngIf="(formSubmitted || name.dirty) && name.invalid">
<li *ngFor="let error of getValidationMessages(name)">
{{error}}
</li>
</ul>
</div>
<button class="btn btn-primary mt-2" type="submit">

---

## Create

</button>
</form>
</div>
The result is that validation messages are displayed alongside the input element and collected
at the top of the form once it has been submitted, as shown in figure 13.12.
-- 374 of 848 --
364
Figure 13.12. Displaying an overall validation summary
DISABLING THE SUBMIT BUTTON
The next step is to disable the button once the user has submitted the form, preventing the
user from clicking it again until all the validation errors have been resolved. This is a commonly
used technique even though it has little bearing on the example application, which won’t accept
the data from the form while it contains invalid values but provides useful reinforcement to the
user that they cannot proceed until the validation problems have been resolved. In listing
13.24, I used the property binding on the button element.
Listing 13.24. Disabling the button in the template.html file in the src/app folder
<div class="p-2">
<form #form="ngForm" (ngSubmit)="submitForm(form)">
<div class="bg-danger text-white p-2 mb-2"
*ngIf="formSubmitted && form.invalid">

---

## There are problems with the form

<ul>
<li *ngFor="let error of getFormValidationMessages(form)">
-- 375 of 848 --
365
{{error}}
</li>
</ul>
</div>
<div class="form-group">
<label>Name</label>
<input class="form-control"
name="name"
[(ngModel)]="newProduct.name"
#name="ngModel"
required
minlength="5"
pattern="^[A-Za-z ]+$" />
<ul class="text-danger list-unstyled mt-1"
*ngIf="(formSubmitted || name.dirty) && name.invalid">
<li *ngFor="let error of getValidationMessages(name)">
{{error}}
</li>
</ul>
</div>
<button class="btn btn-primary mt-2" type="submit"
[disabled]="formSubmitted && form.invalid"
[class.btn-secondary]="formSubmitted && form.invalid">

---

## Create

</button>
</form>
</div>
For extra emphasis, I used the class binding to add the button element to the btn-
secondary class when the form has been submitted and has invalid data. This class applies
a Bootstrap CSS style, as shown in figure 13.13.
Figure 13.13. Disabling the submit button
-- 376 of 848 --
366
13.4.4 	Completing the form
Now that the validation features are done, I can complete the form. Listing 13.25 restores the
input elements for the category and price fields, which I removed earlier in the chapter. I
also removed the validation messages for the name element so that only the form-wide error
messages are displayed.
Listing 13.25. Adding form elements in the template.html file in the src/app folder
<div class="p-2">
<form #form="ngForm" (ngSubmit)="submitForm(form)">
<div class="bg-danger text-white p-2 mb-2"
*ngIf="formSubmitted && form.invalid">

---

## There are problems with the form

<ul>
<li *ngFor="let error of getFormValidationMessages(form)">
{{error}}
</li>
</ul>
</div>
<div class="form-group">
<label>Name</label>
<input class="form-control"
name="name"
[(ngModel)]="newProduct.name"
#name="ngModel"
required
minlength="5"
pattern="^[A-Za-z ]+$" />
</div>
<div class="form-group">
<label>Category</label>
<input class="form-control" name="category"
[(ngModel)]="newProduct.category" required />
</div>
<div class="form-group">
<label>Price</label>
<input class="form-control" name="price"
[(ngModel)]="newProduct.price" required type="number"/>
</div>
<button class="btn btn-primary mt-2" type="submit"
[disabled]="formSubmitted && form.invalid"
[class.btn-secondary]="formSubmitted && form.invalid">

---

## Create

</button>
</form>
</div>
The final change is to adjust the selectors for the CSS styles that indicate valid and invalid
input elements, as shown in listing 13.26.
-- 377 of 848 --
367
Listing 13.26. Adjusting the CSS selectors in the styles.css file in the src folder
html, body { height: 100%; }
body { margin: 0; font-family: Roboto, "Helvetica Neue", sans-serif; }
form.ng-submitted input.ng-invalid { border: 2px solid #ff0000 }
form.ng-submitted input.ng-valid { border: 2px solid #6bc502 }
In addition to the classes described in table 13.5, Angular adds form elements to the ng-
submitted class when they have been submitted. This allows me to select elements that are
invalid once the form has been submitted, regardless of whether the user has edited the
elements.
Save the changes and click the Create button; you will see the validation messages and
CSS styles shown in figure 13.14. As you address each validation error, the input elements will
turn green, and you will be able to submit the form when no validation errors remain.
Figure 13.14. Finishing the form
13.5 	Summary
In this chapter, I introduced the way that Angular supports user interaction using events and
forms. I explained how to create event bindings, how to create two-way bindings, and how
they can be simplified using the ngModel directive. I also described the support that Angular
provides for managing and validating HTML forms.
▪ 	Event bindings are used to handle events by evaluating expressions.
▪ 	Event binding expressions can invoke component methods or use variables withing the
template.
▪ 	Two-way bindings synchronize the contents of an HTML element with a component
property.
-- 378 of 848 --
368
▪ 	The content entered into form elements can be validated with rules defined in the
template or the component.
In the next chapter, I explain how to create custom directives.
-- 379 of 848 --
14

---

## This chapter covers

▪ 	Creating custom directives that modify a single HTML element
▪ 	Configuring and applying custom directives
▪ 	Receiving data in a custom directive
▪ 	Using the directive lifecycle API
▪ 	Generating custom events from directives
▪ 	Creating directives that support template variables
In this chapter, I describe how custom directives can be used to supplement the functionality
provided by the built-in ones of Angular. The focus of this chapter is attribute directives, which
are the simplest type that can be created and that change the appearance or behavior of a
single element. In chapter 14, I explain how to create structural directives, which are used to
change the layout of the HTML document. Components are also a type of directive, and I
explain how they work in chapter 15.
Throughout these chapters, I describe how custom directives work by re-creating the
features provided by some of the built-in directives. This isn’t something you would typically
do in a real project, but it provides a useful baseline against which the process can be
explained. Table 14.1 puts attribute directives into context.
Table 14.1. Putting attribute directives in context
Question 	Answer
What are they? 	Attribute directives are classes that can modify the behavior or
appearance of the element they are applied to. The style and class
bindings described in chapter 10 are examples of attribute directives.
-- 380 of 848 --
370
Why are they useful? 	The built-in directives cover the most common tasks required in web
application development but don’t deal with every situation. Custom
directives allow application-specific features to be defined.
How are they used? 	Attribute directives are classes to which the @Directive decorator
has been applied. They are enabled in the directives property of
the component responsible for a template and applied using a CSS
selector.

---

## Are there any pitfalls or

limitations?
The main pitfall when creating a custom directive is the temptation to
write code to perform tasks that can be better handled using directive
features such as input and output properties and host element
bindings.
Are there any alternatives? 	Angular supports two other types of directive—structural directives
and components—that may be more suitable for a given task. You
can sometimes combine the built-in directives to create a specific
effect if you prefer to avoid writing custom code, although the result
can be brittle and lead to complex HTML that is hard to read and
maintain.
Table 14.2 summarizes the chapter.
Table 14.2. Chapter summary
Problem 	Solution 	Listing
Creating an attribute directive 	Apply @Directive to a class 	1–5

---

## Accessing host element attribute

values
Apply the @Attribute decorator to a
constructor parameter
6–9
Creating a data-bound input property 	Apply the @Input decorator to a class property 	10–11, 13,
14
Receiving a notification when a data-
bound input property value changes
Implement the ngOnChanges method 	12
Defining an event 	Apply the @Output decorator 	15, 16

---

## Creating a property binding or event

binding on the host element
Apply the @HostBinding or
@HostListener decorator
17–21
Exporting a directive’s functionality
for use in the template
Use the exportAs property of the
@Directive decorator
22, 23
-- 381 of 848 --
371
14.1 	Preparing the example project
As I have been doing throughout this part of the book, I will continue using the example project
from the previous chapter. To prepare for this chapter, I have redefined the form so that it
updates the component’s newProduct property rather than the model-based form used in

---

## chapter 13, as shown in listing 14.1.

TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
Listing 14.1. Replacing the contents of the template.html file in the src/app folder
<div class="container-fluid">
<div class="row p-2">
<div class="col-6">
<form class="m-2" (ngSubmit)="submitForm()">
<div class="form-group">
<label>Name</label>
<input class="form-control" name="name"
[(ngModel)]="newProduct.name" />
</div>
<div class="form-group">
<label>Category</label>
<input class="form-control" name="category"
[(ngModel)]="newProduct.category" />
</div>
<div class="form-group">
<label>Price</label>
<input class="form-control" name="price"
[(ngModel)]="newProduct.price" />
</div>
<button class="btn btn-primary mt-2" type="submit">

---

## Create

</button>
</form>
</div>
<div class="col">
<table class="table table-sm table-bordered table-striped">
<thead>
<tr>
<th></th><th>Name</th>
<th>Category</th><th>Price</th>
</tr>
</thead>
<tbody>
<tr *ngFor="let item of products(); let i = index">
<td>{{i + 1}}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td>{{item.price}}</td>
</tr>
</tbody>
-- 382 of 848 --
372
</table>
</div>
</div>
</div>
This listing uses the Bootstrap grid layout to position the form and the table side by side.
Listing 14.2 simplifies the component and updates the component’s addProduct method so
that it adds a new object to the data model.
Listing 14.2. Replacing the contents of the component.ts file in the src/app folder
import { Component, computed } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
products = computed<Product[]>(() => this.model.Products());
count = computed<number>(() => this.products().length);
product(key: number): Product | undefined {
return this.model.getProduct(key);
}
newProduct: Product = new Product();
addProduct(p: Product) {
this.model.saveProduct(p);
}
submitForm() {
this.addProduct(this.newProduct);
}
}
To start the application, navigate to the example project folder and run the following
command:
ng serve
Open a new browser window and navigate to http://localhost:4200 to see the form in figure
14.1. A new item will be added to the data model and displayed in the table when you submit
the form. When the form is submitted, the CSS validation styles will be displayed because
Angular adds form elements to the validation classes, even when no validation is performed.
-- 383 of 848 --
373
Figure 14.1. Running the example application
14.2 	Creating a simple attribute directive
The best place to start is to jump in and create a directive to see how they work. I added a file
called attr.directive.ts to the src/app folder with the code shown in listing 14.3. The
name of the file indicates that it contains a directive. I set the first part of the filename to attr
to indicate that this is an example of an attribute directive.
Listing 14.3. The Contents of the attr.directive.ts File in the src/app Folder
import { Directive, ElementRef } from "@angular/core";
@Directive({
selector: "[pa-attr]",
})
export class PaAttrDirective {
constructor(element: ElementRef) {
element.nativeElement.classList.add("table-success", "fw-bold");
}
}
Directives are classes to which the @Directive decorator has been applied. The decorator
requires the selector property, which is used to specify how the directive is applied to
elements, expressed using a standard CSS style selector. The selector I used is [pa-attr],
which will match any element that has an attribute called pa-attr, regardless of the element
type or the value assigned to the attribute.
-- 384 of 848 --
374
Custom d

---

## This chapter covers

▪ 	Creating and applying structural directives
▪ 	Creating directives that iterate over data values
▪ 	Understanding the concise directive syntax
▪ 	Responding to changes in a structural directive
▪ 	Querying child content in a structural directive
Structural directives change the layout of the HTML document by adding and removing
elements. They build on the core features available for attribute directives, described in chapter
14, with additional support for micro-templates, which are small fragments of contents defined
within the templates used by components. You can recognize when a structural directive is
being used because its name will be prefixed with an asterisk, such as *ngIf or *ngFor. In
this chapter, I explain how structural directives are defined and applied, how they work, and
how they respond to changes in the data model. Table 15.1 puts structural directives in
context.
Table 15.1. Putting structural directives in context
Question 	Answer
What are they? 	Structural directives use micro-templates to add content to the HTML
document.
Why are they useful? 	Structural directives allow content to be added conditionally based on
the result of an expression or for the same content to be repeated for
each object in a data source, such as an array.
-- 410 of 848 --
400
How are they used? 	Structural directives are applied to an ng-template element, which
contains the content and bindings that comprise its micro-template. The
template class uses objects provided by Angular to control the inclusion
of the content or to repeat the content.

---

## Are there any pitfalls or

limitations?
Unless care is taken, structural directives can make a lot of
unnecessary changes to the HTML document, which can ruin the
performance of a web application. It is important to make changes only
when they are required, as explained in the “Dealing with Collection-
Level Data Changes” section later in the chapter.
Are there any alternatives? 	You can use the built-in directives for common tasks, but writing
custom structural directives provides the ability to tailor behavior to your
application.
Table 15.2 summarizes the chapter.
Table 15.2. Chapter summary
Problem 	Solution 	Listing
Creating a structural directive 	Apply the @Directive decorator to a class that
receives view container and template constructor
parameters
1–7

---

## Querying the content of the

host element to which a
structural directive has been
applied
Use the @ContentChild or @ContentChildren
decorator
21–27
15.1 	Preparing the example project
In this chapter, I continue working with the example project that I created in chapter 9 and
have been using since. To prepare for this chapter, listing 15.1 removes the fgClass input
property from the attribute directive created in chapter 14.
Listing 15.1. Removing a property in the attr.directive.ts file in the src/app folder
import { Directive, ElementRef, Input, SimpleChanges, Output,
EventEmitter, HostListener, HostBinding } from "@angular/core";
import { Product } from "./product.model";
@Directive({
-- 411 of 848 --
401
selector: "[pa-attr]"
})
export class PaAttrDirective {
// constructor(private element: ElementRef) {
// 	// this.element.nativeElement.addEventListener("click", () => {
// 	// 	if (this.product != null) {
// 	// 	this.click.emit(this.product.category);
// 	// 	}
// 	// });
// }
@Input("pa-attr")
@HostBinding("class")
bgClass: string | null = "";
// @Input({ required: true, alias: "fg-class"})
// fgClass: string | undefined;
@Input("pa-product")
product: Product = new Product();
@Output("pa-category")
click = new EventEmitter<string>();
// ngOnChanges(changes: SimpleChanges) {
// 	let change = changes["fgClass"];
// 	if (change) {
// 	let classList = this.element.nativeElement.classList;
// 	if (!change.isFirstChange() &&
// 	classList.contains(change.previousValue)) {
// 	classList.remove(change.previousValue);
// 	}
// 	if (!classList.contains(change.currentValue)) {
// 	classList.add(change.currentValue);
// 	}
// 	}
// }
@HostListener("click")
triggerCustomEvent() {
if (this.product != null) {
this.click.emit(this.product.category);
}
}
}
In listing 15.2, I simplified the template to remove the form, leaving only the table. (I’ll add
the form back in later in the chapter.)
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
Listing 15.2. Simplifying the template in the template.html file in the src/app folder
-- 412 of 848 --
402
<div class="p-2">
<table class="table table-bordered table-striped">
<thead>
<tr><th></th><th>Name</th><th>Category</th><th>Price</th></tr>
</thead>
<tbody>
<tr *ngFor="let item of products(); let i = index"
[pa-attr]="count() < 6
? 'table-success' : 'table-warning'"
[pa-product]="item"
(pa-category)="newProduct.category = $event">
<td>{{i + 1}}</td>
<td>{{item.name}}</td>
<td [pa-attr]="item.category == 'Soccer'
? 'table-info' : null">
{{item.category}}
</td>
<td [pa-attr]="'table-info'">{{item.price}}</td>
</tr>
</tbody>
</table>
</div>
Run the following command in the example folder to start the development tools:
ng serve
Open a new browser window and navigate to http://localhost:4200 to see the content shown
in figure 15.1.
Figure 15.1. Running the example ap

---

## Create

</button>
</form>
</div>
<div class="col">
<table class="table table-sm table-bordered table-striped">
<thead>
<tr><th></th><th>Name</th><th>Category</th>
<th>Price</th></tr>
</thead>
-- 430 of 848 --
420
<tbody>
<tr *paFor="let item of products(); let i = index;
let odd = odd; let even = even"
[class.table-info]="odd"
[class.table-warning]="even">
<td>{{i + 1}}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td>{{item.price}}</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
When you save the changes to the template, the HTML form will be displayed alongside the
table of products, as shown in figure 15.6.
Figure 15.6. Restoring the table in the template
Angular doesn’t make any assumptions about how the data relates to the directive’s content
and so the ngDoCheck method is that it is invoked every time Angular detects a change
anywhere in the application.
NOTE This behavior may change when signals are fully integrated into Angular, but for the
moment, the conventional change detection is applied to directives even when the source
of the data is a value read from a signal.
-- 431 of 848 --
421
This is a variation of the problem I described in chapter 10 and it requires directives to be
written with efficiency in mind. To give a sense of how an inefficient directive behaves, I added
a call to the console.log method within the directive’s ngDoCheck method in listing 15.15
so that a message will be displayed in the browser’s JavaScript console each time the
ngDoCheck method is called. Use the HTML form to create a new product and see how many
messages are written out to the browser’s JavaScript console, each of which represents a
change detected by Angular and which results in a call to the ngDoCheck method.
A new message is displayed each time an input element gets the focus, each time a key
event is triggered, and so on. A quick test adding a Running Shoes product in the Running
category with a price of 100 generates 27 messages on my system, although the exact number
will vary based on how you navigate between elements, whether you need to correct typos,
and so on.
For each of those 27 times, the structural directive destroys and re-creates its content,
which means producing new tr and td elements with new directive and binding objects.
There are only a few rows of data in the example application, but these are expensive
operations, and a real application can grind to a halt as the content is repeatedly destroyed
and re-created. The worst part of this problem is that all the changes except one were
unnecessary because the content in the table didn’t need to be updated until the new Product
object was added to the data model. For all the other changes, the directive destroyed its
content and created an identical replacement.
MINIMIZING UPDATES
Fortunately, Angular provides some tools for managing updates more efficiently and updating
content only when it is required, as shown in listing 15.17. This is not related to the signals
feature and

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
...
The button elements have click event bindings that call the component’s deleteProduct
method. I also assigned the tr element to the align-middle class so the text in the table cells
is aligned with the button text. The final step is to process the data changes in the structural
directive so that it responds when an object is removed from the data source, as shown in
listing 15.20.
Listing 15.20. Removing an item in the iterator.directive.ts file in the src/app folder
import { Directive, ViewContainerRef, TemplateRef, Input,
IterableDiffer, IterableDiffers,
IterableChangeRecord, ViewRef } from "@angular/core";
import { interval } from "rxjs";
@Directive({
selector: "[paForOf]"
})
export class PaIteratorDirective {
private differ: IterableDiffer<any> | undefined;
private views: Map<any, PaIteratorContext>
= new Map<any, PaIteratorContext>();
constructor(private container: ViewContainerRef,
private template: TemplateRef<Object>,
private differs: IterableDiffers) { }
@Input("paForOf")
dataSource: any;
ngOnInit() {
this.differ =
<IterableDiffer<any>> this.differs
.find(this.dataSource).create();
}
ngDoCheck() {
let changes = this.differ?.diff(this.dataSource);
if (changes != null) {
let arr: IterableChangeRecord<any>[] = [];
changes.forEachAddedItem(addition => arr.push(addition));
arr.forEach(addition => {
if (addition.currentIndex != null) {
let context = new PaIteratorContext(addition.item,
addition.currentIndex, arr.length);
-- 437 of 848 --
427
context.view = this.container
.createEmbeddedView(this.template,
context);
this.views.set(addition.trackById, context);
}
});
let removals = false;
changes.forEachRemovedItem(removal => {
removals = true;
let context = this.views.get(removal.trackById);
if (context != null && context.view != null) {
this.container.remove(
this.container.indexOf(context.view));
this.views.delete(removal.trackById);
}
});
if (removals) {
let index = 0;
this.views.forEach(context =>
context.setData(index++, this.views.size));
}
}
}
}
class PaIteratorContext {
index: number = 0;
odd: boolean = false; even: boolean = false;
first: boolean = false; last: boolean = false;
view: ViewRef | undefined;
constructor(public $implicit: any,
public position: number, total: number ) {
this.setData(position, total);
}
setData(index: number, total: number) {
this.index = index;
this.odd = index % 2 == 1;
this.even = !this.odd;
this.first = index == 0;
this.last = index == total - 1;
}
}
Two tasks are required to handle removed objects. The first task is updating the set of views
by removing the ones that correspond to the items provided by the forEachRemovedItem
method. This means keeping track of the mapping between the data objects and the views
that represent them, which I have done by adding a ViewRef property to the
PaIteratorContext class and using a Map to collect them, indexed by the value of the
IterableChangeRecord.trackById property.
When processing the collection changes, the directive 

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
</div>
...
Listing 15.24 adds the darkColor property to the component.
Listing 15.24. Defining a property in the component.ts file in the src/app folder
import { Component, computed } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
private model: Model = new Model();
showTable: boolean = false;
darkColor: boolean = false;
products = computed<Product[]>(() => this.model.Products());
count = computed<number>(() => this.products().length);
product(key: number): Product | undefined {
return this.model.getProduct(key);
}
newProduct: Product = new Product();
addProduct(p: Product) {
this.model.saveProduct(p);
}
deleteProduct(key: number) {
this.model.deleteProduct(key);
}
submitForm() {
this.addProduct(this.newProduct);
}
}
The final step is to register the new directives with the Angular module’s declarations
property, as shown in listing 15.25.
Listing 15.25. Registering new directives in the app.module.ts file in the src/app folder
-- 442 of 848 --
432
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule }
from '@angular/platform-browser/animations';
import { ProductComponent } from './component';
import { PaAttrDirective } from "./attr.directive";
import { PaModel } from "./twoway.directive";
import { PaStructureDirective } from "./structure.directive";
import { PaIteratorDirective } from "./iterator.directive";
import { PaCellColor } from "./cellColor.directive";
import { PaCellColorSwitcher } from "./cellColorSwitcher.directive";
@NgModule({
declarations: [
ProductComponent, PaAttrDirective, PaModel, PaStructureDirective,
PaIteratorDirective, PaCellColor, PaCellColorSwitcher
],
imports: [
BrowserModule,
BrowserAnimationsModule,
FormsModule
],
providers: [],
bootstrap: [ProductComponent]
})
export class AppModule { }
When you save the changes, you will see a new checkbox above the table. When you check
the box, the ngModel directive will cause the PaCellColorSwitcher directive’s input
property to be updated, which will call the setColor method of the PaCellColor directive
object that was found using the @ContentChild decorator. The visual effect is small because
only the first PaCellColor directive is affected, which is the cell that displays the number 1,
at the top-left corner of the table, as shown in figure 15.8. (If you don’t see the color change,
then restart the Angular development tools and reload the browser.)
-- 443 of 848 --
433
Figure 15.8. Operating on a content child
15.4.1 	Querying multiple content children
The @ContentChild decorator finds the first directive object that matches the argument and
assigns it to the decorated property. If you want to receive all the dire

---

## This chapter covers

▪ 	Defining component classes and templates
▪ 	Binding templates to component classes
▪ 	Using input and output properties in components
▪ 	Styling content generated by components
▪ 	Querying content generated by components
Components are directives that have their own templates, rather than relying on content
provided from elsewhere. Components have access to all the directive features described in
earlier chapters and still have a host element, can still define input and output properties, and
so on. But they also define their own content using templates.
It can be easy to underestimate the importance of the template, but attribute and structural
directives have limitations. Directives can do useful and powerful work, but they don’t have
much insight into the elements they are applied to. Directives are most useful when they are
general-purpose tools, such the ngModel directive, which can be applied to any data model
property and any form element, without regard to what the data or the element is being used
for.
Components, by contrast, are closely tied to the contents of their templates. Components
provide the data and logic that will be used by the data bindings that are applied to the HTML
elements in the template, which provide the context used to evaluate data binding expressions
and act as the glue between the directives and the rest of the application. Components are
also a useful tool in allowing large Angular projects to be broken up into manageable chunks.
In this chapter, I explain how components work and explain how to restructure an
application by introducing some additional components. Table 16.1 puts components in
context.
-- 449 of 848 --
439
Table 16.1. Putting components in context
Question 	Answer
What are they? 	Components are directives that define their own HTML content and,
optionally, CSS styles.
Why are they useful? 	Components make it possible to define self-contained blocks of
functionality, which makes projects more manageable and allows for
functionality to be more readily reused.
How are they used? 	The @Component decorator is applied to a class, which is
registered in the application’s Angular module.

---

## Are there any pitfalls or

limitations?
No. Components provide all the functionality of directives, with the
addition of providing their own templates.
Are there any alternatives? 	An Angular application must contain at least one component, which
is used in the bootstrap process. Aside from this, you don’t have to
add additional components, although the resulting application
becomes unwieldy and difficult to manage.
Table 16.2 summarizes the chapter.
Table 16.2. Chapter summary
Problem 	Solution 	Listing
Creating a component 	Apply the @Component directive to a
class
1–5

---

## Defining the content displayed by a

component
Create an inline or external template 	6–8
Including data in a template 	Use a data binding in the component’s
template
9
Coordinating between components 	Use input or output properties 	10–17

---

## Displaying content in an element to which a

component has been applied
Project the host element’s content 	18–21
Styling component content 	Create component styles 	22–25
Querying the content in the component’s
template
Use the @ViewChildren decorator 	26
-- 450 of 848 --
440
16.1 	Preparing the example project
In this chapter, I continue using the example project that I created in chapter 9 and have been
modifying since. No changes are required to prepare for this chapter.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
Run the following command in the example folder to start the Angular development tools:
ng serve
Open a new browser and navigate to http://localhost:4200 to see the content in figure 16.1.
Figure 16.1. Running the example project
16.2 	Structuring an application with components
At the moment, the example project contains only one component and one template. Angular
applications require at least one component, known as the root component, which is the entry
point specified in the Angular module.
The problem with having only one component is that it ends up containing the logic required
for all the application’s features, with its template containing all the markup required to expose
those features to the user. The result is that a single component and its template are
responsible for handling a lot of tasks. The component in the example application is responsible
for the following:
-- 451 of 848 --
441
▪ 	Providing Angular with an entry point into the application, as the root component
▪ 	Providing access to the application’s data model so that it can be used in data bindings
▪ 	Defining the HTML form used to create new products
▪ 	Defining the HTML table used to display products
▪ 	Defining the layout that contains the form and the table
▪ 	Maintaining state information used to prevent invalid data from being used to create
data
▪ 	Maintaining state information about whether the table should be displayed
A lot is going on for such a simple application, and not all of these tasks are related. This effect
tends to creep up gradually as development proceeds, but it means that the application is
harder to test because individual features can’t be isolated effectively, and it is harder to
enhance and maintain because the code and markup become increasingly complex.
Adding components to the application allows features to be separated into building blocks
that can be used repeatedly in different parts of the application and tested in isolation. In the
sections that follow, I create components that break up the functionality contained in the
example application into manageable, reusable, and self-contained units. Along the way, I’ll
explain the different features that components provide beyond those available to directives.
To prepare for these changes, I have simplified the existing component’s temp

---

## Form will go here

</div>
<div class="col p-2 bg-primary text-white">
table will go here
</div>
</div>
</div>
When you save the changes to the template, you will see the content in figure 16.2. The
placeholders will be replaced with application functionality as I develop the new components
and add them to the application.
-- 452 of 848 --
442
Figure 16.2. Simplifying the existing template
16.2.1 	Creating new components
To create a new component, I added a file called productTable.component.ts to the
src/app folder and used it to define the component shown in listing 16.2.
Listing 16.2. The contents of the productTable.component.ts file in the src/app folder
import { Component } from "@angular/core";
@Component({
selector: "paProductTable",
template: "<div>This is the table component</div>"
})
export class ProductTableComponent {
}
A component is a class to which the @Component decorator has been applied. This is as simple
as a component can get, and it provides just enough functionality to count as a component
without doing anything useful.
The naming convention for the files that define components is to use a descriptive name
that suggests the purpose of the component, followed by a period and then component.ts.
For this component, which will be used to generate the table of products, the filename is
productTable.component.ts. The name of the class should be equally descriptive. This
component’s class is named ProductTableComponent.
The @Component decorator describes and configures the component. The most useful
decorator properties are described in table 16.3, which also includes details of where they are
described (not all of them are covered in this chapter).
Table 16.3. Useful component decorator properties
Name 	Description
selector This property is used to specify the CSS selector used to match host
elements, as described after the table.
-- 453 of 848 --
443
styles
This property is used to define CSS styles that are applied only to the
component’s template. The styles are defined inline, as part of the TypeScript
file. See the “Using Component Styles” section for details.
styleUrls
This property is used to define CSS styles that are applied only to the
component’s template. The styles are defined in separate CSS files. See the
“Using Component Styles” section for details.
template This property is used to specify an inline template, as described in the
“Defining Templates” section.
templateUrl This property is used to specify an external template, as described in the
“Defining Templates” section.
For the second component, I created a file called productForm.component.ts in the
src/app folder and added the code shown in listing 16.3.
Listing 16.3. The contents of the productForm.component.ts file in the src/app folder
import { Component } from "@angular/core";
@Component({
selector: "paProductForm",
template: "<div>This is the form component</div>"
})
export class ProductFormComponent {
}
This component is equally simple and is just a placeholder for the mo

---

## This is a multiline template

</div>`
})
export class ProductTableComponent {
}
-- 457 of 848 --
447
Multiline strings allow the structure of the HTML elements in a template to be preserved, which
makes it easier to read and increases the size of the template that can be practically included
inline before it becomes too unwieldy to manage. Figure 16.5 shows the effect of the template
in listing 16.6.
Figure 16.5. Using a multiline inline template
My advice is to use external templates (explained in the next section) for any template that
contains more than two or three simple elements, largely to take advantage of the HTML
editing and syntax highlighting features provided by modern editors, which can go a long way
to reduce the number of errors you discover when running the application.
DEFINING EXTERNAL TEMPLATES
External templates are defined in a different file from the rest of the component. The advantage
of this approach is that the code and HTML are not mixed together, which makes both easier
to read and unit test, and it also means that code editors will know they are working with HTML
content when you are working on a template file, which can help reduce coding-time errors by
highlighting errors.
The drawback of external templates is that you have to manage more files in the project
and ensure that each component is associated with the correct template file. The best way to
do this is to follow a consistent file naming strategy so that it is immediately obvious that a
file contains a template for a given component. The convention for Angular is to create pairs
of files using the convention <componentname>.component.<type> so that when you see
a file called productTable.component.ts, you know it contains a component called
Products 	written 	in 	TypeScript, 	and 	when 	you 	see 	a 	file 	called
productTable.component.html, you know that it contains an external template for the
Products component.
TIP The syntax and features for both types of template are the same, and the only
difference is where the content is stored, either in the same file as the component code or
in a separate file.
To define an external template using the naming convention, I created a file called
productTable.component.html in the src/app folder and added the markup shown in
listing 16.7.
-- 458 of 848 --
448
Listing 16.7. The productTable.component.html file in the src/app folder
<div class="bg-info p-2">

---

## This is an external template

</div>
To specify an external template, the templateURL property is used in the @Component
decorator, as shown in listing 16.8.
Listing 16.8. The productTable.component.ts file in the src/app folder
import { Component } from "@angular/core";
@Component({
selector: "paProductTable",
// template: `<div class='bg-info p-2'>
// 	This is a multiline template
// 	</div>`
templateUrl: "productTable.component.html"
})
export class ProductTableComponent {
}
Notice that different properties are used: template is for inline templates, and templateUrl
is for external templates. Figure 16.6 shows the effect of using an external template.
Figure 16.6. Using an external template
USING DATA BINDINGS IN COMPONENT TEMPLATES
A component’s template can contain the full range of data bindings and target any of the built-
in directives or custom directives that have been registered in the application’s Angular
module. Each component class provides the context for evaluating the data binding
expressions in its template, and by default, each component is isolated from the others. This
means the component doesn’t have to worry about using the same property and method
names that other components use and can rely on Angular to keep everything separate. As an
example, listing 16.9 shows the addition of a property called model to the form child
component, which would conflict with the property of the same name in the root component
were they not kept separate.
Listing 16.9. Adding a property in the productForm.component.ts file in the src/app
folder
-- 459 of 848 --
449
import { Component } from "@angular/core";
@Component({
selector: "paProductForm",
template: "<div>{{model}}</div>"
})
export class ProductFormComponent {
model: string = "This is the model";
}
The component class uses the model property to store a message that is displayed in the
template using a string interpolation binding. Figure 16.7 shows the result.
Figure 16.7. Using a data binding in a child component
USING INPUT PROPERTIES TO COORDINATE BETWEEN COMPONENTS
Few components exist in isolation and need to share data with other parts of the application.
Components can define input properties to receive the value of data binding expressions on
their host elements. The expression will be evaluated in the context of the parent component,
but the result will be passed to the child component’s property.
To demonstrate, listing 16.10 adds an input property to the table component, which it will
use to receive the model data that it should display.
Listing 16.10. Defining an input property in the productTable.component.ts file in the
src/app folder
import { Component, Input, Signal } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "paProductTable",
templateUrl: "productTable.component.html"
})
export class ProductTableComponent {
@Input({ alias: "model", required: true})
dataModel!: Model;
get Products(): Signal<Product[]> {
retur

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
The same HTML elements, data bindings, and directives (including custom directives like paIf
and paFor) are used, producing the result shown in figure 16.10. The key difference is not in
the appearance of the table but in the way that it is now managed by a dedicated component.
-- 463 of 848 --
453
Figure 16.10. Restoring the table display
USING OUTPUT PROPERTIES TO COORDINATE COMPONENTS
Child components can use output properties that define custom events that signal important
changes and that allow the parent component to respond when they occur. Listing 16.15
changes the form component, adding an external template and an output property that will be
triggered when the user creates a new Product object when invoking the submitForm
method.
Listing 16.15. Defining an output property in the productForm.component.ts file in the
src/app folder
import { Component, Output, EventEmitter } from "@angular/core";
import { Product } from "./product.model";
@Component({
selector: "paProductForm",
templateUrl: "productForm.component.html"
})
export class ProductFormComponent {
newProduct: Product = new Product();
@Output("paNewProduct")
newProductEvent = new EventEmitter<Product>();
submitForm(form: any) {
this.newProductEvent.emit(this.newProduct);
this.newProduct = new Product();
form.resetForm();
}
-- 464 of 848 --
454
}
The output property is called newProductEvent, and the component triggers it when the
submitForm method is called. Aside from the output property, the additions in the listing are
based on the logic in the root controller, which previously managed the form. I also removed
the inline template and created a file called productForm.component.html in the src/app
folder, with the content shown in listing 16.16.
Listing 16.16. The productForm.component.html file in the src/app folder
<form #form="ngForm" (ngSubmit)="submitForm(form)">
<div class="form-group">
<label>Name</label>
<input class="form-control"
name="name" [(ngModel)]="newProduct.name" />
</div>
<div class="form-group">
<label>Category</label>
<input class="form-control"
name="category" [(ngModel)]="newProduct.category" />
</div>
<div class="form-group">
<label>Price</label>
<input class="form-control"
name="name" [(ngModel)]="newProduct.price" />
</div>
<button class="btn btn-primary mt-2" type="submit">

---

## Create

</button>
</form>
The form contains standard elements, configured using two-way bindings. The child
component’s host element acts as the bridge to the parent component, which can register
interest in the custom event, as shown in listing 16.17.
Listing 16.17. Using the event in the template.html file in the src/app folder
<div class="container-fluid">
<div class="row p-2">
<div class="col-4 p-2 text-dark">
<paProductForm (paNewProduct)="addProduct($event)">
</paProductForm>
</div>
<div class="col p-2">
<paProductTable [model]="model"></paProductTable>
</div>
</div>
</div>
The new binding handles the custom event by passing the event object to the addProduct
method. The child component is responsible for managing the form elements and validating
their contents. When the data passes validation, the custom event is triggered, and the data
binding expression is evaluated in the context of the parent component, whose addProduct
method adds the new object to the model. Since the model has been shared with the table
child component through its input property, the new data is displayed to the user, as shown in
-- 465 of 848 --
455
figure 16.11. (You may need to restart the Angular development tools to include the new
template file in the build process.)
Figure 16.11. Using a custom event in a child component
PROJECTING HOST ELEMENT CONTENT
If the host element for a component contains content, it can be included in the template using
the special ng-content element. This is known as content projection, and it allows
components to be created that combine the content in their template with the content in the
host element. To demonstrate, I added a file called toggleView.component.ts to the
src/app folder and used it to define the component shown in listing 16.18.
Listing 16.18. The contents of the toggleView.component.ts file in the src/app folder
import { Component } from "@angular/core";
@Component({
selector: "paToggleView",
templateUrl: "toggleView.component.html"
})
export class PaToggleView {
showContent: boolean = true;
}
This component defines a showContent property that will be used to determine whether the
host element’s content will be displayed within the template. To provide the template, I added
a file called toggleView.component.html to the src/app folder and added the elements
shown in listing 16.19.
Listing 16.19. The contents of the toggleView.component.html file in the src/app folder
<div class="form-check">
<label class="form-check-label">Show Content</label>
-- 466 of 848 --
456
<input class="form-check-input" type="checkbox"
[(ngModel)]="showContent" />
</div>
<ng-content *ngIf="showContent"></ng-content>
The important element is ng-content, which Angular will replace with the content of the host
element. The ngIf directive has been applied to the ng-content element so that it will be
visible only if the checkbox in the template is checked. Listing 16.20 registers the component
with the Angular module.
Listing 16.20. Registering the com

---

## Selecting components dynamically

The 	ViewContainerRef 	class, 	introduced 	in 	chapter 	15, 	defines 	the
createComponent method, which can be used to select a component programmatically,
without having to specify a fixed element in a template. I have not demonstrated this
feature because it has serious limitations and causes more problems than it addresses, at
least in my experience. If you want to explore this feature, see the Angular documentation
at https://angular.io/guide/dynamic-component-loader, but proceed with caution.
-- 468 of 848 --
458
16.2.3 	Completing the component restructure
The functionality that was previously contained in the root component has been distributed to
the new child components. All that remains is to tidy up the root component to remove the
code that is no longer required, as shown in listing 16.22.
Listing 16.22. Removing obsolete code in the component.ts file in the src/app folder
import { Component, computed } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
model: Model = new Model();
// showTable: boolean = false;
// darkColor: boolean = false;
// products = computed<Product[]>(() => this.model.Products());
// count = computed<number>(() => this.products().length);
// product(key: number): Product | undefined {
// 	return this.model.getProduct(key);
// }
// newProduct: Product = new Product();
addProduct(p: Product) {
this.model.saveProduct(p);
}
// deleteProduct(key: number) {
// 	this.model.deleteProduct(key);
// }
// submitForm() {
// 	this.addProduct(this.newProduct);
// }
}
Many of the responsibilities of the root component have been moved elsewhere in the
application. Of the original list from the start of the chapter, only the following remain the
responsibility of the root component:
▪ 	Providing Angular with an entry point into the application, as the root component
▪ 	Providing access to the application’s data model so that it can be used in data bindings
The child components have assumed the rest of the responsibilities, providing self-contained
blocks of functionality that are simpler, easier to develop, and easier to maintain and that can
be reused as required.
-- 469 of 848 --
459
16.3 	Using component styles
Components can define styles that apply only to the content in their templates, which allows
content to be styled by a component without it being affected by the styles defined by its
parents or other antecedents and without affecting the content in its child and other
descendant components. Styles can be defined inline using the styles property of the
@Component decorator, as shown in listing 16.23.
Listing 16.23. Defining inline styles in the productForm.component.ts file in the src/app
folder
import { Component, Output, EventEmitter } from "@angular/core";
import { Product } from "./product.model";
@Component({
selector: "paProductForm",
templateUrl: "productForm.com

---

## This chapter covers

▪ 	Creating and applying pipes
▪ 	Using pure and impure pipes to update HTML content
▪ 	Formatting data values using the built-in Angular pipes
Pipes are small fragments of code that transform data values so they can be displayed to the
user in templates. Pipes allow transformation logic to be defined in self-contained classes so
that it can be applied consistently throughout an application. Table 17.1 puts pipes in context.
Table 17.1. Putting pipes in context
Question 	Answer
What are they? 	Pipes are classes that are used to prepare data for display to the user.
Why are they useful? 	Pipes allow preparation logic to be defined in a single class that can be
used throughout an application, ensuring that data is presented
consistently.
How are they used? 	The @Pipe decorator is applied to a class and used to specify a name
by which the pipe can be used in a template.

---

## Are there any pitfalls or

limitations?
Pipes should be simple and focused on preparing data. It can be
tempting to let the functionality creep into areas that are the
responsibility of other building blocks, such as directives or
components.
Are there any alternatives? 	You can implement data preparation code in components or directives,
but that makes it harder to reuse in other parts of the application.
-- 476 of 848 --
466
Table 17.2 summarizes the chapter.
Table 17.2. Chapter summary
Problem 	Solution 	Listing

---

## Chain the pipe names together using the bar

character
9
Specifying when Angular
should reevaluate the output
from a pipe
Use the pure property of the @Pipe decorator 	10–13
Formatting numerical values 	Use the number pipe 	14, 15
Formatting currency values 	Use the currency pipe 	16, 17
Formatting percentage values 	Use the percent pipe 	18
Formatting dates 	Use the date pipe 	19–21
Changing the case of strings 	Use the uppercase or lowercase pipe 	22, 23

---

## Display events from an

observable
Use the async pipe 	31–33
17.1 	Preparing the example project
I am going to continue working with the example project that was first created in chapter 9
and that has been expanded and modified in the chapters since. In the final examples in the
previous chapter, component styles and view children queries left the application with a
strikingly garish appearance that I am going to tone down for this chapter. In listing 17.1, I
have disabled the inline component styles applied to the form elements.
-- 477 of 848 --
467
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
Listing 17.1. Disabling CSS styles in the productForm.component.ts file in the src/app
folder
import { Component, Output, EventEmitter } from "@angular/core";
import { Product } from "./product.model";
@Component({
selector: "paProductForm",
templateUrl: "productForm.component.html",
//styles: ["div { background-color: lightgreen }"]
// styleUrls: ["productForm.component.css"]
})
export class ProductFormComponent {
newProduct: Product = new Product();
@Output("paNewProduct")
newProductEvent = new EventEmitter<Product>();
submitForm(form: any) {
this.newProductEvent.emit(this.newProduct);
this.newProduct = new Product();
form.resetForm();
}
}
To disable the checkerboard coloring of the table cells, I changed the selector for the
PaCellColor directive so that it matches an attribute that is not currently applied to the
HTML elements, as shown in listing 17.2.
Listing 17.2. Changing the selector in the cellColor.directive.ts file in the src/app folder
import { Directive, HostBinding } from "@angular/core";
@Directive({
selector: "td[paApplyColor]"
})
export class PaCellColor {
@HostBinding("class")
bgClass: string = "";
setColor(dark: Boolean) {
this.bgClass = dark ? "table-dark" : "";
}
}
The next change is to simplify the ProductTableComponent class to remove methods and
properties that are no longer required and add new properties that will be used in later
examples, as shown in listing 17.3.
Listing 17.3. Simplifying the productTable.component.ts file in the src/app folder
-- 478 of 848 --
468
import { Component, Input, Signal, QueryList, ViewChildren,
ChangeDetectorRef } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
//import { PaCellColor } from "./cellColor.directive";
@Component({
selector: "paProductTable",
templateUrl: "productTable.component.html"
})
export class ProductTableComponent {
constructor(private changeRef: ChangeDetectorRef) {}
@Input({ alias: "model", required: true})
dataModel!: Model;
get Products(): Signal<Product[]> {
return this.dataModel.Products;
}
getProduct(key: number): Product | undefined {
return this.dataModel?.getProduct(key);
}
deleteProduct(key: number) {
this.dataModel.deleteProduct(key);
}
// @Vie

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
The syntax for applying a pipe is similar to the style used by command prompts, where a value
is “piped” for transformation using the vertical bar symbol (the | character). Figure 17.2 shows
the structure of the data binding that contains the pipe.
Figure 17.2. The anatomy of data binding with a pipe
The name of the pipe used in listing 17.5 is currency, and it formats numbers into currency
values. Arguments to the pipe are separated by colons (the : character). The first pipe
argument specifies the currency code that should be used, which is USD in this case,
representing U.S. dollars. The second pipe argument, which is symbol, specifies whether the
currency symbol, rather than its code, should be displayed.
When Angular processes the expression, it obtains the data value and passes it to the pipe
for transformation. The result produced by the pipe is then used as the expression result for
-- 481 of 848 --
471
the data binding. In the example, the bindings are string interpolations, and figure 17.3 shows
the results.
Figure 17.3. The effect of using the currency pipe
17.3 	Creating a custom pipe
I will return to the built-in pipes that Angular provides later in the chapter, but the best way
to understand how pipes work and what they are capable of is to create a custom pipe. I added
a file called addTax.pipe.ts in the src/app folder and defined the class shown in listing
17.6.
Listing 17.6. The contents of the addTax.pipe.ts file in the src/app folder
import { Pipe } from "@angular/core";
@Pipe({
name: "addTax"
})
export class PaAddTaxPipe {
defaultRate: number = 10;
transform(value: any, rate?: any): number {
let valueNumber = Number.parseFloat(value);
let rateNumber = rate == undefined ?
this.defaultRate : Number.parseInt(rate);
return valueNumber + (valueNumber * (rateNumber / 100));
}
}
-- 482 of 848 --
472
Pipes are classes to which the Pipe decorator has been applied and that implement a method
called transform. The Pipe decorator defines two properties, which are used to configure
pipes, as described in table 17.3.
Table 17.3. The pipe decorator properties
Name 	Description
name 	This property specifies the name by which the pipe is applied in templates.
pure 	When true, this pipe is reevaluated only when its input value or its arguments are
changed. This is the default value. See the “Creating impure pipes” section for details.
The example pipe is defined in a class called PaAddTaxPipe, and its decorator name property
specifies that the pipe will be applied using addTax in templates. The transform method
must accept at least one argument, which Angular uses to provide the data value that the pipe
formats. The pipe does its work in the transform method, and its result is used by Angular
in the binding expression. In this example, the transform method accepts a number value,
and its result is the received value plus sales tax.
The transform method can also define additional arguments that are used to

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
Just for variety, I defined the tax rate entirely within the template. The select element has
a binding that sets its value property to a component variable called taxRate or defaults to
0 if the property has not been defined. The event binding handles the change event and sets
the value of the taxRate property. You cannot specify a fallback value when using the
ngModel directive, which is why I have split up the bindings.
In applying the custom pipe, I used the vertical bar character, followed by the value
specified by the name property in the pipe’s decorator. The name of the pipe is followed by a
colon, which is followed by an expression that is evaluated to provide the pipe with its
argument. In this case, the taxRate property will be used if it has been defined, with a fallback
value of zero.
Pipes are part of the dynamic nature of Angular data bindings, and the pipe’s transform
method will be called to get an updated value if the underlying data value changes or if the
expression used for the arguments changes. The dynamic nature of pipes can be seen by
changing the value displayed by the select element, which will define or change the taxRate
property, which will, in turn, update the amount added to the price property by the custom
pipe, as shown in figure 17.4.
-- 485 of 848 --
475
Figure 17.4. Using a custom pipe
17.3.3 	Combining pipes
The addTax pipe is applying the tax rate, but the fractional amounts that are produced by the
calculation are unsightly—and unhelpful since few tax authorities insist on accuracy to 15
fractional digits.
I could fix this by adding support to the custom pipe to format the number values as
currencies, but that would require duplicating the functionality of the built-in currency pipe
that I used earlier in the chapter. A better approach is to combine the functionality of both
pipes so that the output from the custom addTax pipe is fed into the built-in currency pipe,
which is then used to produce the value displayed to the user.
Pipes are chained together in this way using the vertical bar character, and the names of
the pipes are specified in the order that data should flow, as shown in listing 17.9.
Listing 17.9. Combining pipes in the productTable.component.html file in the src/app
folder
...
<td>{{item.price | addTax:(taxRate || 0) | currency:"USD":"symbol" 	}}</td>
...
The value of the item.price property is passed to the addTax pipe, which adds the sales
tax, and then to the currency pipe, which formats the number value into a currency amount,
as shown in figure 17.5.
-- 486 of 848 --
476
Figure 17.5. Combining the functionality of pipes
17.3.4 	Creating impure pipes
The pure decorator property is used to tell Angular when to call the pipe’s transform
method. The default value for the pure property is true, which tells Angular that the pipe’s
transform method will generate a new value only if the input data value—the data value before
the vertical bar character i

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
To see the problem, use the select element to filter the products in the table so that only
those in the Soccer category are shown. Then use the form elements to create a new product
in that category. Clicking the Create button will add the product to the data model, but the
new product won’t be shown in the table, as illustrated in figure 17.6.
Figure 17.6. A problem caused by a pure pipe
The table isn’t updated because, as far as Angular is concerned, none of the inputs to the
filter pipe has changed. The component’s getProducts method returns the same array
object, and the categoryFilter property is still set to Soccer. The fact that there is a new
object inside the array returned by the getProducts method isn’t recognized by Angular.
The solution is to set the pipe’s pure property to false, as shown in listing 17.13.
Listing 17.13. An impure pipe in the categoryFilter.pipe.ts file in the src/app folder
import { Pipe } from "@angular/core";
import { Product } from "./product.model";
@Pipe({
name: "filter",
pure: false
-- 490 of 848 --
480
})
export class PaCategoryFilterPipe {
transform(products: Product[] | undefined,
category: string | undefined): Product[] {
if (products == undefined) {
return [];
}
return category == undefined ?
products : products.filter(p => p.category == category);
}
}
If you repeat the test, you will see that the new product is now correctly displayed in the table,
as shown in figure 17.7.
Figure 17.7. Using an impure pipe
17.4 	Using the built-in pipes
Angular includes a set of built-in pipes that perform commonly required tasks. These pipes are
described in table 17.4 and demonstrated in the sections that follow.
Table 17.4. The built-in pipes
Name 	Description
number 	This pipe performs location-sensitive formatting of number values. See the
“Formatting numbers” section for details.
currency 	This pipe performs location-sensitive formatting of currency amounts. See the
“Formatting currency values” section for details.
-- 491 of 848 --
481
percent 	This pipe performs location-sensitive formatting of percentage values. See the
“Formatting percentages” section for details.
date 	This pipe performs location-sensitive formatting of dates. See the “Formatting dates”
section for details.
uppercase 	This pipe transforms all the characters in a string to uppercase. See the “Changing
string case” section for details.
Lowercase 	This pipe transforms all the characters in a string to lowercase. See the “Changing
string case” section for details.
titlecase 	This pipe transforms all the characters in a string to title case. See the “Changing
string case” section for details.
json 	This pipe transforms an object into a JSON string. See the “Serializing data as JSON”
section for details.
slice 	This pipe selects items from an array or characters from a string, as described in the
“Slicing data arrays” section.
keyvalue 	This pipe transforms an object or map into a series of key-value pairs, a

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
The number pipe accepts a single argument that specifies the number of digits that are
included in the formatted result. The argument is in the following format (note the period and
hyphen that separate the values and that the entire argument is quoted as a string):
"<minIntegerDigits>.<minFactionDigits>-<maxFractionDigits>"
Table 17.5 describes each element of the formatting argument.
Table 17.5. The elements of the number pipe argument
Name 	Description
minIntegerDigits 	This value specifies the minimum number of digits. The default value is 1.
minFractionDigits 	This value specifies the minimum number of fractional digits. The default
value is 0.
-- 493 of 848 --
483
maxFractionDigits 	This value specifies the maximum number of fractional digits. The default
value is 3.
The argument used in the listing is "3.2-2", which specifies that at least three digits should
be used to display the integer portion of the number and that two fractional digits should
always be used. This produces the result shown in figure 17.8.
Figure 17.8. Formatting number values
The number pipe is location-sensitive, which means that the same format argument will
produce differently formatted results based on the user’s locale setting. Angular applications
default to the en-US locale by default and require other locales to be loaded explicitly, as
shown in listing 17.15.
Listing 17.15. Setting the locale in the app.module.ts file in the src/app folder
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-
browser/animations';
import { ProductComponent } from './component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaAttrDirective } from "./attr.directive";
import { PaModel } from "./twoway.directive";
import { PaStructureDirective } from "./structure.directive";
import { PaIteratorDirective } from "./iterator.directive";
import { PaCellColor } from "./cellColor.directive";
import { PaCellColorSwitcher } from "./cellColorSwitcher.directive";
-- 494 of 848 --
484
import { ProductTableComponent } from "./productTable.component";
import { ProductFormComponent } from "./productForm.component";
import { PaToggleView } from "./toggleView.component";
import { PaAddTaxPipe } from "./addTax.pipe";
import { PaCategoryFilterPipe } from "./categoryFilter.pipe";
import { LOCALE_ID } from "@angular/core";
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeFr);
@NgModule({
declarations: [ProductComponent, PaAttrDirective, PaModel,
PaStructureDirective, PaIteratorDirective,
PaCellColor, PaCellColorSwitcher, ProductTableComponent,
ProductFormComponent, PaToggleView, PaAddTaxPipe,
PaCategoryFilterPipe],
imports: [
BrowserModule,
BrowserAnimationsModule,
FormsModule, ReactiveFormsModule
],

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
The currency pipe can be configured using four arguments, which are described in table 17.6.
Table 17.6. The arguments for the currency pipe
Name 	Description
currencyCode 	This string argument specifies the currency using an ISO 4217 code. The default
value is USD if this argument is omitted. You can see a list of currency codes at
http://en.wikipedia.org/wiki/ISO_4217.
display 	This string indicates whether the currency symbol or code should be displayed.
The supported values are code (use the currency code), symbol (use the
currency symbol), and symbol-narrow (which shows the concise form when a
currency has narrow and wide symbols). You can also specify a string to use. The
default value is symbol.
digitInfo 	This string argument specifies the formatting for the number, using the same
formatting instructions supported by the number pipe, as described in the
“Formatting Numbers” section.
locale 	This string argument specifies the locale for the currency. This defaults to the
LOCALE_ID value, the configuration of which is shown in listing 17.15.
The arguments specified in listing 17.16 tell the pipe to use the U.S. dollar as the currency
(which has the ISO code USD), to display the symbol rather than the code in the output, and
to format the number so that it has at least two integer digits and exactly two fraction digits.
This pipe relies on the Internationalization API to get details of the currency—especially its
symbol—but doesn’t select the currency automatically to reflect the user’s locale setting.
This means that the formatting of the number and the position of the currency symbol are
affected by the application’s locale setting, regardless of the currency that has been specified
by the pipe. The example application is still configured to use the fr-FR locale, which produces
the results shown in figure 17.10.
-- 497 of 848 --
487
Figure 17.10. Location-sensitive currency formatting
To revert to the default locale, listing 17.17 removes the fr-FR setting from the application’s
root module.
Listing 17.17. Removing the locale setting in the app.module.ts file in the src/app folder
...
@NgModule({
declarations: [
ProductComponent, PaAttrDirective, PaModel, PaStructureDirective,
PaIteratorDirective, PaCellColor, PaCellColorSwitcher,
ProductTableComponent, ProductFormComponent, PaToggleView,
PaAddTaxPipe, PaCategoryFilterPipe
],
imports: [
BrowserModule,
BrowserAnimationsModule,
FormsModule
],
//providers: [{ provide: LOCALE_ID, useValue: "fr-FR" }],
bootstrap: [ProductComponent]
})
export class AppModule { }
...
Figure 17.11 shows the result.
-- 498 of 848 --
488
Figure 17.11. Formatting currency values
17.4.3 	Formatting percentages
The percent pipe formats number values as percentages, where values between 0 and 1 are
formatted to represent 0 to 100 percent. This pipe has optional arguments that are used to
specify the number formatting options, using the same format as the number pipe, and
override 

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
Values that are greater than 1 are formatted into percentages greater than 100 percent. You
can see this in the last item shown in figure 17.12, where the value 1.5 produces a formatted
value of 150 percent.
Figure 17.12. Formatting percentage values
-- 500 of 848 --
490
The formatting of percentage values is location-sensitive, although the differences between
locales can be subtle. As an example, while the en-US locale produces a result such as 10
percent, with the numerals and the percent sign next to one another, many locales, including
fr-FR, will produce a result such as 10 %, with a space between the numerals and the percent
sign.
17.4.4 	Formatting dates
The date pipe performs location-sensitive formatting of dates. Dates can be expressed using
JavaScript Date objects, as a number value representing milliseconds since the beginning of
1970 	or 	as 	a 	well-formatted 	string. 	Listing 	17.19 	adds 	three 	properties 	to 	the
ProductTableComponent class, each of which encodes a date in one of the formats
supported by the date pipe.
Listing 17.19. Defining dates in the productTable.component.ts file in the src/app folder
import { Component, Input, Signal, QueryList, ViewChildren,
ChangeDetectorRef } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "paProductTable",
templateUrl: "productTable.component.html"
})
export class ProductTableComponent {
constructor(private changeRef: ChangeDetectorRef) {}
@Input({ alias: "model", required: true})
dataModel!: Model;
get Products(): Signal<Product[]> {
return this.dataModel.Products;
}
getProduct(key: number): Product | undefined {
return this.dataModel?.getProduct(key);
}
deleteProduct(key: number) {
this.dataModel.deleteProduct(key);
}
taxRate: number = 0;
categoryFilter: string | undefined;
itemCount: number = 3;
dateObject: Date = new Date(2020, 1, 20);
dateString: string = "2020-02-20T00:00:00.000Z";
dateNumber: number = 1582156800000;
}
-- 501 of 848 --
491
All three properties describe the same date, which is February 20, 2020. No time has been
specified, which means that these values will represent midnight, with no time specified. In
listing 17.20, I have used the date pipe to format all three properties.
Listing 17.20. Formatting dates in the productTable.component.html file in the src/app
folder
<div class="bg-info p-2 text-white">
<div>Date formatted from object: {{ dateObject | date }}</div>
<div>Date formatted from string: {{ dateString | date }}</div>
<div>Date formatted from number: {{ dateNumber | date }}</div>
</div>
<table class="table table-sm table-bordered table-striped">
<thead class="table-light">
<tr><th></th><th>Name</th><th>Category</th><th>Price</th>
<th></th></tr>
</thead>
<tbody>
<tr *paFor="let item of Products() | filter:categoryFilter;
let i = index; let odd = odd;
let even = even"
[class.table-info]="odd"
[class.table-warning]="even"
class="align

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
The pipe works out which data type it is working with, parses the value to get a date, and then
formats it, as shown in figure 17.13.
-- 502 of 848 --
492
Figure 17.13. Formatting dates
If you are in a time zone that is to the left of GMT, then you will see Feb 19, 2020, for two of
the dates. The first date is expressed relative to the application’s time zone, but the others are
expressed in the UTC time zone, which means that the dates will be adjusted, as shown in
figure 17.14.
Figure 17.14. The effect of a different time zone
The date pipe accepts an argument that specifies the date format that should be used.
Individual date components can be selected for the output using the symbols described in table
17.7. A complete set of supported symbols can be found in the Angular API documentation at
https://angular.io/api/common/DatePipe.
Table 17.7. Useful date pipe format symbols
-- 503 of 848 --
493
Name 	Description
y, yy, yyyy 	These symbols select the year.
M, MMM, MMMM 	These symbols select the month.
d, dd 	These symbols select the day (as a number).
E, EE, EEE, EEEE, EEEEE 	These symbols select the day (as a name).
h, hh, H, HH 	These symbols select the hour in 12- and 24-hour forms.
m, mm 	These symbols select the minutes.
s, ss 	These symbols select the seconds.
Z 	This symbol selects the time zone.
The symbols in table 17.7 provide access to the date components in differing levels of brevity
so that M will return 2 if the month is February, MM will return 02, MMM will return Feb, and
MMMM will return February, assuming that you are using the en-US locale. The date pipe
also supports predefined date formats for commonly used combinations, the most useful of
which are described in table 17.8.
Table 17.8. Useful predefined date pipe formats
Name 	Description
short 	This format is equivalent to the component string M/d/yy, h:mm a. It presents
the date in a concise format, including the time component.
medium 	This format is equivalent to the component string MMM d, y, h:mm:ss a. It
presents the date as a more expansive format, including the time component.
shortDate 	This format is equivalent to the component string M/d/yy. It presents the date in a
concise format and excludes the time component.
mediumDate 	This format is equivalent to the component string MMM d, y. It presents the date in
a more expansive format and excludes the time component.
longDate 	This format is equivalent to the component string MMMM d, y. It presents the date
and excludes the time component.
fullDate 	This format is equivalent to the component string EEEE, MMMM d, y. It presents
the date fully and excludes the date format.
shortTime 	This format is equivalent to the component string h:mm a.
mediumTime 	This format is equivalent to the component string h:mm:ss a.
-- 504 of 848 --
494
The date pipe also accepts arguments that specify a time zone and a locale. Listing 17.21
shows the use of the predefined formats as arguments to

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
Formatting arguments are specified as literal strings. Take care to capitalize the format string
correctly because shortDate will be interpreted as one of the predefined formats from table
17.8, but shortdate (with a lowercase letter d) will be interpreted as a series of characters
from table 17.7 and produce nonsensical output.
CAUTION Date parsing/formatting is a complex and time-consuming process. As a
consequence, the pure property for the date pipe is true; as a result, changes to
individual components of a Date object won’t trigger an update. If you need to reflect
changes in the way that a date is displayed, then you must change the reference to the
Date object that the binding containing the date pipe refers to.
Figure 17.15 shows the formatted dates, in the en-US and fr-FR locales.
Figure 17.15. Location-sensitive date formatting

---

## Understanding the impact of lazy localization

Localizing a product takes time, effort, and resources, and it needs to be done by someone
who understands the linguistic, cultural, and monetary conventions of the target country
or region. If you don’t localize properly, then the result can be worse than not localizing at
all.
-- 506 of 848 --
496
It is for this reason that I don’t describe localization features in detail in this book—or any
of my books. Describing features outside of the context in which they will be used feels like
setting up readers for a self-inflicted disaster. At least if a product isn’t localized, the user
knows where they stand and doesn’t have to try to figure out whether you just forgot to
change the currency code or whether those prices are really in U.S. dollars. (This is an issue
that I see all the time living in the United Kingdom.)
You should localize your products. Your users should be able to do business or perform
other operations in a way that makes sense to them. But you must take it seriously and
allocate the time and effort required to do it properly.
17.4.5 	Changing string case
The uppercase, lowercase, and titlecase pipes convert all the characters in a string to
uppercase or lowercase, respectively. Listing 17.22 shows the first two pipes applied to cells
in the product table. This listing also removes the dates used in the previous section.
Listing 17.22. Changing character case in the productTable.component.html file in the
src/app folder
<!-- <div class="bg-info p-2 text-white">
<div>
Date formatted from object: {{ dateObject | date:"shortDate" }}
</div>
<div>
Date formatted from string: {{ dateString | date:"mediumDate" }}
</div>
<div>
Date formatted from number: {{ dateNumber | date:"longDate" }}
</div>
</div>
<div class="bg-info p-2 text-white">
<div>
Date formatted from object:
{{ dateObject | date:"shortDate":"UTC":"fr-FR" }}
</div>
<div>
Date formatted from string:
{{ dateString | date:"mediumDate":"UTC":"fr-FR" }}
</div>
<div>
Date formatted from number:
{{ dateNumber | date:"longDate":"UTC":"fr-FR" }}
</div>
</div> -->
<table class="table table-sm table-bordered table-striped">
<thead class="table-light">
<tr><th></th><th>Name</th><th>Category</th><th>Price</th>
<th></th></tr>
</thead>
-- 507 of 848 --
497
<tbody>
<tr *paFor="let item of Products() | filter:categoryFilter;
let i = index; let odd = odd;
let even = even"
[class.table-info]="odd"
[class.table-warning]="even"
class="align-middle">
<td>{{i + 1}}</td>
<td>{{item.name | uppercase }}</td>
<td>{{item.category | lowercase }}</td>
<td>{{item.price | addTax:(taxRate || 0)
| currency:"USD":"symbol":"2.2-2" }}
</td>
<td class="text-center">
<button class="btn btn-danger btn-sm"
(click)="deleteProduct(item.id)">

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
These pipes use the standard JavaScript string methods toUpperCase and toLowerCase,
which are not sensitive to locale settings, as shown in figure 17.16.
Figure 17.16. Changing character case
The titlecase pipe capitalizes the first character of each word and uses lowercase for the
remaining characters. Listing 17.23 applies the titlecase pipe to the table cells.
-- 508 of 848 --
498
Listing 17.23. Applying the pipe in the productTable.component.html file in the src/app
folder
<table class="table table-sm table-bordered table-striped">
<thead class="table-light">
<tr><th></th><th>Name</th><th>Category</th><th>Price</th>
<th></th></tr>
</thead>
<tbody>
<tr *paFor="let item of Products() | filter:categoryFilter;
let i = index; let odd = odd;
let even = even"
[class.table-info]="odd"
[class.table-warning]="even"
class="align-middle">
<td>{{i + 1}}</td>
<td>{{item.name | titlecase }}</td>
<td>{{item.category | lowercase }}</td>
<td>{{item.price | addTax:(taxRate || 0)
| currency:"USD":"symbol":"2.2-2" }}
</td>
<td class="text-center">
<button class="btn btn-danger btn-sm"
(click)="deleteProduct(item.id)">

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
Figure 17.17 shows the effect of the pipe.
Figure 17.17. Using the titlecase pipe
-- 509 of 848 --
499
17.4.6 	Serializing data as JSON
The json pipe creates a JSON representation of a data value. No arguments are accepted by
this pipe, which uses the browser’s JSON.stringify method to create the JSON string.
Listing 17.24 applies this pipe to create a JSON representation of the objects in the data model.
Listing 17.24. Creating a JSON string in the productTable.component.html file in the
src/app folder
<div class="bg-info p-2 text-white">
<div>{{ Products() | json }}</div>
</div>
<table class="table table-sm table-bordered table-striped">
<thead class="table-light">
<tr><th></th><th>Name</th><th>Category</th><th>Price</th>
<th></th></tr>
</thead>
<tbody>
<tr *paFor="let item of Products() | filter:categoryFilter;
let i = index; let odd = odd;
let even = even"
[class.table-info]="odd"
[class.table-warning]="even"
class="align-middle">
<td>{{i + 1}}</td>
<td>{{item.name | titlecase }}</td>
<td>{{item.category | lowercase }}</td>
<td>{{item.price | addTax:(taxRate || 0)
| currency:"USD":"symbol":"2.2-2" }}
</td>
<td class="text-center">
<button class="btn btn-danger btn-sm"
(click)="deleteProduct(item.id)">

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
This pipe is useful during debugging, and its decorator’s pure property is false so that any
change in the application will cause the pipe’s transform method to be invoked, ensuring
that even collection-level changes are shown. Figure 17.18 shows the JSON generated from
the objects in the example application’s data model.
-- 510 of 848 --
500
Figure 17.18. Generating JSON strings for debugging
17.4.7 	Slicing data arrays
The slice pipe operates on an array or string and returns a subset of the elements or
characters it contains. This is an impure pipe, which means it will reflect any changes that
occur within the data object it is operating on but also means that the slice operation will be
performed after any change in the application, even if that change was not related to the
source data.
The objects or characters selected by the slice pipe are specified using two arguments,
which are described in table 17.9.
Table 17.9. The slice pipe arguments
Name 	Description
start 	This argument must be specified. If the value is positive, the start index for items to be
included in the result counts from the first position in the array. If the value is negative,
then the pipe counts back from the end of the array.
end 	This optional argument is used to specify how many items from the start index
should be included in the result. If this value is omitted, all the items after the start
index (or before in the case of negative values) will be included.
Listing 17.25 demonstrates the use of the slice pipe in combination with a select element
that specifies how many items should be displayed in the product table.
Listing 17.25. Using the slice pipe in the productTable.component.html file in the
src/app folder
<div class="form-group my-2">
<label>Number of items:</label>
<select class="form-select" [value]="itemCount || 1"
-- 511 of 848 --
501
(change)="itemCount=$any($event).target.value">
<option *ngFor="let item of Products(); let i = index"
[value]="i + 1" [selected]="(i + 1) === itemCount">
{{i + 1}}
</option>
</select>
</div>
<table class="table table-sm table-bordered table-striped">
<thead class="table-light">
<tr><th></th><th>Name</th><th>Category</th><th>Price</th>
<th></th></tr>
</thead>
<tbody>
<tr *paFor="let item of Products() | slice:0:(itemCount ?? 1);
let i = index; let odd = odd;
let even = even" [class.table-info]="odd"
[class.table-warning]="even"
class="align-middle">
<td>{{i + 1}}</td>
<td>{{item.name | titlecase }}</td>
<td>{{item.category | lowercase }}</td>
<td>{{item.price | addTax:(taxRate || 0)
| currency:"USD":"symbol":"2.2-2" }}
</td>
<td class="text-center">
<button class="btn btn-danger btn-sm"
(click)="deleteProduct(item.id)">

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
The select element is populated with option elements created with the ngFor directive.
This directive doesn’t directly support iterating a specific number of times, so I have used the
index variable to generate the values that are required. The select element sets a property
called itemCount, which is used as the second argument of the slice pipe, like this:
...
<tr *paFor="let item of getProducts() | slice:0:(itemCount ?? 1);
let i = index; let odd = odd;
let even = even" [class.table-info]="odd" [class.table-warning]="even"
class="align-middle">
...
The effect is that changing the value displayed by the select element changes the number
of items displayed in the product table, as shown in figure 17.19.
-- 512 of 848 --
502
Figure 17.19. Using the slice pipe
17.4.8 	Formatting key-value pairs
The keyvalue pipe operates on an object or a map and returns a sequence of key-value pairs.
Each object in the sequence is represented as an object with key and value properties, and
listing 17.26 replaces the contents of the productTable.component.html file to
demonstrate the use of the pipe to enumerate the contents of the array returned by the
getProducts method.
Listing 17.26. Using the keyvalue pipe in the productTable.component.html file in the
src/app folder
<table class="table table-sm table-bordered table-striped">
<thead><tr><th>Key</th><th>Value</th></tr></thead>
<tbody>
<tr *paFor="let item of Products() | keyvalue">
<td>{{ item.key }}</td>
<td>{{ item.value | json }}</td>
</tr>
</tbody>
</table>
When used on an array, the keys are the array indexes, and the values are the objects in the
array. The objects in the array are formatted using the json filter, producing the results shown
in figure 17.20.
-- 513 of 848 --
503
Figure 17.20. Using the keyvalue pipe
17.4.9 	Selecting values
The i18nSelect pipe selects a string based on a value, allowing context-sensitive values to
be displayed to the user. The mapping between values and strings is defined as a simple map,
as shown in listing 17.27.
Listing 17.27. Mapping values to strings in the productTable.component.ts file in the
src/app folder
import { Component, Input, Signal, QueryList, ViewChildren,
ChangeDetectorRef } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "paProductTable",
templateUrl: "productTable.component.html"
})
export class ProductTableComponent {
constructor(private changeRef: ChangeDetectorRef) {}
@Input({ alias: "model", required: true})
dataModel!: Model;
get Products(): Signal<Product[]> {
return this.dataModel.Products;
}
getProduct(key: number): Product | undefined {
-- 514 of 848 --
504
return this.dataModel?.getProduct(key);
}
deleteProduct(key: number) {
this.dataModel.deleteProduct(key);
}
taxRate: number = 0;
categoryFilter: string | undefined;
itemCount: number = 3;
// dateObject: Date = new Date(2020, 1, 20);
// dateString: string = "2020-02-20

---

## This book covers

▪ 	Understanding services and the problems they solve
▪ 	Defining and registering services
▪ 	Consuming services using dependency injection
▪ 	Using services in components, pipes, and directives
▪ 	Using services to isolate components
Services are objects that provide common functionality to support other building blocks in an
application, such as directives, components, and pipes. What’s important about services is the
way that they are used, which is through a process called dependency injection. Using services
can increase the flexibility and scalability of an Angular application, but dependency injection
can be a difficult topic to understand. To that end, I start this chapter slowly and explain the
problems that services and dependency injection can be used to solve, how dependency
injection works, and why you should consider using services in your projects. Table 18.1 puts
services in context.
Table 18.1. Putting services in context
Question 	Answer
What are they? 	Services are objects that define the functionality required by other
building blocks such as components or directives. What separates
services from regular objects is that they are provided to building
blocks by an external provider, rather than being created directly
using the new keyword or received by an input property.
-- 522 of 848 --
512
Why are they useful? 	Services simplify the structure of applications, make it easier to move
or reuse functionality, and make it easier to isolate building blocks for
effective unit testing.
How are they used? 	Classes declare dependencies on services using constructor
parameters, which are then resolved using the set of services for
which the application has been configured. Services are classes to
which the @Injectable decorator has been applied.

---

## Dependency injection is a contentious topic and not all developers

like using it. If you don’t perform unit tests or if your applications are
relatively simple, the extra work required to implement dependency
injection is unlikely to pay any long-term dividends.
Are there any alternatives? 	Services and dependency injection are hard to avoid because
Angular uses them to provide access to built-in functionality. But you
are not required to define services for your custom functionality if that
is your preference.
Table 18.2 summarizes the chapter.
Table 18.2. Chapter summary
Problem 	Solution 	Listing

---

## 9. To prepare for this chapter, I have replaced the contents of the template for the

ProductTable component with the elements shown in listing 18.1.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
Listing 18.1. Replacing the productTable.component.html file in the src/app folder
<table class="table table-sm table-bordered table-striped">
<thead>
<tr><th></th><th>Name</th><th>Category</th><th>Price</th>
<th></th></tr>
</thead>
<tbody>
-- 523 of 848 --
513
<tr *paFor="let item of Products(); let i = index">
<td>{{i + 1}}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td>{{item.price | currency:"USD":"symbol" }}</td>
<td class="text-center">
<button class="btn btn-danger btn-sm"
(click)="deleteProduct(item.id)">

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
Run the following command in the example folder to start the TypeScript compiler and the
development HTTP server:
ng serve
Open a new browser window and navigate to http://localhost:4200 to see the content shown
in figure 18.1.
Figure 18.1. Running the example application
18.2 	Understanding the object distribution problem
In chapter 16, I added components to the project to help break up the monolithic structure of
the application. In doing this, I used input and output properties to connect components, using
host elements to bridge the isolation that Angular enforces between a parent component and
its children. I also showed you how to query the contents of the template for view children,
which complements the content children feature described in chapter 15.
These techniques for coordinating between directives and components can be powerful and
useful if applied carefully. But they can also end up as a general tool for distributing shared
objects throughout an application, where the result is to increase the complexity of the
application and to tightly bind components together.
-- 524 of 848 --
514
18.2.1 	Demonstrating the problem
To help demonstrate the problem, I am going to add a shared object to the project and two
components that rely on it. I created a file called discount.service.ts to the src/app
folder and defined the class shown in listing 18.2. I’ll explain the significance of the service
part of the filename later in the chapter.
Listing 18.2. The contents of the discount.service.ts file in the src/app folder
export class DiscountService {
private discountValue: number = 10;
public get discount(): number {
return this.discountValue;
}
public set discount(newValue: number) {
this.discountValue = newValue ?? 0;
}
public applyDiscount(price: number) {
return Math.max(price - this.discountValue, 5);
}
}
The DiscountService class defines a private property called discountValue that is used
to store a number that will be used to reduce the product prices in the data model. This value
is exposed through getters and setters called discount, and there is a convenience method
called applyDiscount that reduces a price while ensuring that a price is never less than $5.
For the first component that makes use of the DiscountService class, I added a file
called discountDisplay.component.ts to the src/app folder and added the code shown
in listing 18.3.
Listing 18.3. The contents of the discountDisplay.component.ts file in the src/app folder
import { Component, Input } from "@angular/core";
import { DiscountService } from "./discount.service";
@Component({
selector: "paDiscountDisplay",
template: `<div class="bg-info text-white p-2 my-2">
The discount is {{discounter.discount }}
</div>`
})
export class PaDiscountDisplayComponent {
@Input({alias: "discounter", required: true})
discounter!: DiscountService;
}
The DiscountDisplayComponent uses an inline template to display the discount amount,
which is obtained

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
<paDiscountEditor [discounter]="discounter"></paDiscountEditor>
<paDiscountDisplay [discounter]="discounter"></paDiscountDisplay>
These elements correspond to the components’ selector properties in listing 18.3 and listing
18.4 and use data bindings to set the value of the input properties. The final step is to create
-- 527 of 848 --
517
an object in the parent component that will provide the value for the data binding expressions,
as shown in listing 18.7.
Listing 18.7. Creating the shared object in the productTable.component.ts file in the
src/app folder
import { Component, Input, Signal, QueryList, ViewChildren,
ChangeDetectorRef } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
import { interval } from "rxjs";
import { DiscountService } from "./discount.service";
@Component({
selector: "paProductTable",
templateUrl: "productTable.component.html"
})
export class ProductTableComponent {
discounter: DiscountService = new DiscountService();
//constructor(private changeRef: ChangeDetectorRef) {}
@Input({ alias: "model", required: true})
dataModel!: Model;
get Products(): Signal<Product[]> {
return this.dataModel.Products;
}
getProduct(key: number): Product | undefined {
return this.dataModel?.getProduct(key);
}
deleteProduct(key: number) {
this.dataModel.deleteProduct(key);
}
taxRate: number = 0;
categoryFilter: string | undefined;
itemCount: number = 3;
// selectMap = {
// 	"Watersports": "stay dry",
// 	"Soccer": "score goals",
// 	"other": "have fun"
// }
// numberMap = {
// 	"=1": "one product",
// 	"=2": "two products",
// 	"other": "# products"
// }
// numbers = interval(1000);
}
-- 528 of 848 --
518
Figure 18.2 shows the content from the new components. Changes to the value in the input
element provided by one of the components will be reflected in the content presented by the
other component, reflecting the use of the shared DiscountService object and its
discount property.
Figure 18.2. Adding components to the example application
The process for adding the new components and the shared object was straightforward and
logical, until the final stage. The problem arises in the way that I had to create and distribute
the shared object: the instance of the DiscountService class.
Because Angular isolates components from one another, I had no way to share the
DiscountService 	object 	directly 	between 	the 	DiscountEditorComponent 	and
DiscountDisplayComponent. 	Each 	component 	could 	have 	created 	its 	own
DiscountService object, but that means changes from the editor component wouldn’t be
shown in the display component.
That is what led me to create the DiscountService object in the product table
component, which is the first shared ancestor of the discount editor and display components.
This allowed me to distribute the DiscountService object through the product table
component’s template, ensuring that a single object was shared with both o

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
<paDiscountEditor></paDiscountEditor>
<paDiscountDisplay></paDiscountDisplay>
REGISTERING THE SERVICE
The final change is to configure the dependency injection feature so that it can provide
DiscountService objects to the components that require them. To make the service
available throughout the application, it is registered in the Angular module, as shown in listing
18.13.
Listing 18.13. Registering a service in the app.module.ts file in the src/app folder
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule }
from '@angular/platform-browser/animations';
-- 533 of 848 --
523
import { ProductComponent } from './component';
import { PaAttrDirective } from "./attr.directive";
import { PaModel } from "./twoway.directive";
import { PaStructureDirective } from "./structure.directive";
import { PaIteratorDirective } from "./iterator.directive";
import { PaCellColor } from "./cellColor.directive";
import { PaCellColorSwitcher } from "./cellColorSwitcher.directive";
import { ProductTableComponent } from "./productTable.component";
import { ProductFormComponent } from "./productForm.component";
import { PaToggleView } from "./toggleView.component";
import { PaAddTaxPipe } from './addTax.pipe';
import { PaCategoryFilterPipe } from './categoryFilter.pipe';
import { LOCALE_ID } from "@angular/core";
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
import { PaDiscountDisplayComponent } from "./discountDisplay.component";
import { PaDiscountEditorComponent } from "./discountEditor.component";
import { DiscountService } from "./discount.service";
registerLocaleData(localeFr);
@NgModule({
declarations: [
ProductComponent, PaAttrDirective, PaModel, PaStructureDirective,
PaIteratorDirective, PaCellColor, PaCellColorSwitcher,
ProductTableComponent, ProductFormComponent, PaToggleView,
PaAddTaxPipe, PaCategoryFilterPipe, PaDiscountDisplayComponent,
PaDiscountEditorComponent
],
imports: [
BrowserModule,
BrowserAnimationsModule,
FormsModule
],
providers: [DiscountService],
bootstrap: [ProductComponent]
})
export class AppModule { }
The NgModule decorator’s providers property is set to an array of the classes that will be
used as services. There is only one service at the moment, which is provided by the
DiscountService class.
When you save the changes to the application, there won’t be any visual changes, but the
dependency 	injection 	feature 	will 	be 	used 	to 	provide 	the 	components 	with 	the
DiscountService object they require.
REVIEWING THE DEPENDENCY INJECTION CHANGES
Angular seamlessly integrates dependency injection into its feature set. Each time Angular
encounters an element that requires a new building block, such as a component or a pipe, it
examines the class constructor to check what d

---

## Create

</button>
</form>
<paDiscountEditor></paDiscountEditor>
<paDiscountDisplay></paDiscountDisplay>
These new elements duplicate the discount display and editor components so they appear
below the form used to create new products, as shown in figure 18.3.
-- 535 of 848 --
525
Figure 18.3. Duplicating components with dependencies
There are two points of note. First, using dependency injection made this a simple process of
adding elements to a template, without needing to modify the ancestor components to provide
a DiscountService object using input properties.
The second point of note is that all the components in the application that have declared a
dependency on DiscountService have received the same object. If you edit the value in
either of the input elements, the changes will be reflected in the other input element and
the string interpolation bindings, as shown in figure 18.4.
Figure 18.4. Checking that the dependency is resolved using a shared object
-- 536 of 848 --
526
18.2.3 	Declaring dependencies in other building blocks
It isn’t just components that can declare constructor dependencies. Once you have defined a
service, you can use it more widely, including other building blocks in the application, such as
pipes and directives, as demonstrated in the sections that follow.
DECLARING A DEPENDENCY IN A PIPE
Pipes can declare dependencies on services by defining a constructor with arguments for each
required service. To demonstrate, I added a file called discount.pipe.ts to the src/app
folder and used it to define the pipe shown in listing 18.15.
Listing 18.15. The contents of the discount.pipe.ts file in the src/app folder
import { Pipe } from "@angular/core";
import { DiscountService } from "./discount.service";
@Pipe({
name: "discount",
pure: false
})
export class PaDiscountPipe {
constructor(private discount: DiscountService) { }
transform(price: number): number {
return this.discount.applyDiscount(price);
}
}
The PaDiscountPipe class is a pipe that receives a price and generates a result by calling
the DiscountService.applyDiscount method, where the service is received through the
constructor. The pure property in the Pipe decorator is false, which means that the pipe
will be asked to update its result when the value stored by the DiscountService changes,
which won’t be recognized by the Angular change-detection process.
TIP This feature should be used with caution because it means that the transform
method will be called after every change in the application, not just when the service is
changed. This is an issue that I expect will be resolved when signals are fully integrated
into the Angular framework.
Listing 18.16 shows the new pipe being registered in the application’s Angular module.
Listing 18.16. Registering a pipe in the app.module.ts file in the src/app folder
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent }

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
<paDiscountEditor></paDiscountEditor>
<paDiscountDisplay></paDiscountDisplay>
The discount pipe processes the price to apply the discount and then passes on the value to
the currency pipe for formatting. You can see the effect of using the service in the pipe by
changing the value in one of the discount input elements, as shown in figure 18.5.
Figure 18.5. Using a service in a pipe
DECLARING DEPENDENCIES IN DIRECTIVES
Directives can also use services. As I explained in chapter 16, components are just directives
with templates, so anything that works in a component will also work in a directive.
To 	demonstrate 	using 	a 	service 	in 	a 	directive, 	I 	added 	a 	file 	called
discountAmount.directive.ts to the src/app folder and used it to define the directive
shown in listing 18.18.
Listing 18.18. The contents of the discountAmount.directive.ts file in the src/app folder
import { Directive, Input,SimpleChange, KeyValueDiffer,
KeyValueDiffers } from "@angular/core";
import { DiscountService } from "./discount.service";
-- 539 of 848 --
529
@Directive({
selector: "td[pa-price]",
exportAs: "discount"
})
export class PaDiscountAmountDirective {
private differ?: KeyValueDiffer<any, any>;
constructor(private keyValueDiffers: KeyValueDiffers,
private discount: DiscountService) { }
@Input({ alias: "pa-price", required: true})
originalPrice!: number;
discountAmount?: number;
ngOnInit() {
this.differ =
this.keyValueDiffers.find(this.discount).create();
}
ngOnChanges(changes: { [property: string]: SimpleChange }) {
if (changes["originalPrice"] != null) {
this.updateValue();
}
}
ngDoCheck() {
if (this.differ?.diff(this.discount) != null) {
this.updateValue();
}
}
private updateValue() {
this.discountAmount
= this.discount.applyDiscount(this.originalPrice);
}
}
Directives don’t have an equivalent to the pure property used by pipes and must take direct
responsibility for responding to changes propagated through services. This directive displays
the discounted amount for a product. The selector property matches td elements that have
a pa-price attribute, which is also used as an input property to receive the price that will be
discounted. The directive exports its functionality using the exportAs property and provides
a property called discountAmount whose value is set to the discount that has been applied
to the product.
There are two other points to note about this directive. The first is that the
DiscountService object isn’t the only constructor parameter in the directive’s class.
...
constructor(private keyValueDiffers: KeyValueDiffers,
private discount: DiscountService) { }
...
-- 540 of 848 --
530
The KeyValueDiffers parameter is also a dependency that Angular will have to resolve
when it creates a new instance of the directive class. This is an example of the built-in services
that Angular provides that deliver commonly required functionality.
The second point of note is what the directive does with the services it 

---

## Delete

</button>
</td>
</tr>
</tbody>
</table>
<paDiscountEditor></paDiscountEditor>
<paDiscountDisplay></paDiscountDisplay>
-- 542 of 848 --
532
The directive could have created a host binding on the textContent property to set the
contents of its host element, but that would have prevented the currency pipe from being
used. Instead, the directive is assigned to the discount template variable, which is then used
in the string interpolation binding to access and then format the discountAmount value.
Figure 18.6 shows the results. Changes to the discount amount in either of the discount editor
input elements will be reflected in the new table column.
Figure 18.6. Using a service in a directive
18.3 	Understanding the test isolation problem
The example application contains a related problem that services and dependency injection
can be used to solve. Consider how the Model class is used in the root component:
import { Component, computed } from "@angular/core";
import { Model } from "./repository.model";
import { Product } from "./product.model";
@Component({
selector: "app",
templateUrl: "template.html"
})
export class ProductComponent {
model: Model = new Model();
addProduct(p: Product) {
this.model.saveProduct(p);
}
}
-- 543 of 848 --
533
The root component is defined as the ProductComponent class, and it sets up a value for its
model property by creating a new instance of the Model class. This works—and is a legitimate
way to create an object—but it makes it harder to perform unit testing effectively.
Unit testing works best when you can isolate one small part of the application and focus on
it to perform tests. But when you create an instance of the ProductComponent class, you
are implicitly creating an instance of the Model class as well. If you were to run tests on the
root component’s addProduct method and find a problem, you would receive no indication
of whether the problem was in the ProductComponent or Model class.
18.3.1 	Isolating components using services and dependency injection
The underlying problem is that the ProductComponent class is tightly bound to the Model
class, which is, in turn, tightly bound to the SimpleDataSource class. Dependency injection
can be used to tease apart the building blocks in an application so that each class can be
isolated and tested on its own. In the sections that follow, I walk through the process of
breaking up these tightly coupled classes, following essentially the same process as in the
previous section but delving deeper into the example application.
PREPARING THE SERVICES
The @Injectable decorator is used to denote services, just as in the previous example.
Listing 18.21 shows the decorator applied to the SimpleDataSource class.
Listing 18.21. Denoting a service in the datasource.model.ts file in the src/app folder
import { Injectable } from "@angular/core";
import { Product } from "./product.model";
@Injectable()
export class SimpleDataSource {
private data: Product[];
constructor() {
this.data = ne

---

## This chapter covers

▪ 	Understanding the role of modules in an Angular application
▪ 	Understanding the root module
▪ 	Creating and using feature modules
In this chapter, I describe the last of the Angular building blocks: modules. In the first part of
the chapter, I describe the root module, which every Angular application uses to describe the
configuration of the application to Angular. In the second part of the chapter, I describe feature
modules, which are used to add structure to an application so that related features can be
grouped as a single unit. Table 19.1 puts modules in context.
Table 19.1. Putting modules in context
Question 	Answer
What are they? 	Modules provide configuration information to Angular.
Why are they useful? 	The root module describes the application to Angular, setting up
essential features such as components and services. Feature
modules are useful for adding structure to complex projects, which
makes them easier to manage and maintain.
How are they used? 	Modules are classes to which the @NgModule decorator has been
applied. The properties used by the decorator have different
meanings for root and feature modules.

---

## Are there any pitfalls or

limitations?
There is no module-wide scope for providers, which means that the
providers defined by a feature module will be available as though
they had been defined by the root module.
-- 551 of 848 --
541
Are there any alternatives? 	Every application must have a root module, but the use of feature
modules is entirely optional. However, if you don’t use feature
modules, then the files in an application can become difficult to
manage.
Table 19.2 summarizes the chapter.
Table 19.2. Chapter summary
Problem 	Solution 	Listing

---

## Grouping related features

together
Create a feature module 	8–27
19.1 	Preparing the example project
As with the other chapters in this part of the book, I am going to use the example project that
was created in chapter 9 and has been expanded and extended in each chapter since.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
To prepare for this chapter, I have removed some functionality from the component templates.
Listing 19.1 shows the template for the product table, in which I have commented out the
elements for the discount editor and display components.
Listing 19.1. The contents of the productTable.component.html file in the src/app folder
<table class="table table-sm table-bordered table-striped">
<thead>
<tr><th></th><th>Name</th><th>Category</th><th>Price</th>
<th></th></tr>
</thead>
<tbody>
<tr *paFor="let item of Products(); let i = index">
<td>{{i + 1}}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td [pa-price]="item.price" #discount="discount">
{{ discount.discountAmount | currency:"USD":"symbol"}}
</td>
<td class="text-center">
<button class="btn btn-danger btn-sm"
(click)="deleteProduct(item.id)">

---

## Delete

</button>
-- 552 of 848 --
542
</td>
</tr>
</tbody>
</table>
<!-- <paDiscountEditor></paDiscountEditor> -->
<!-- <paDiscountDisplay></paDiscountDisplay> -->
Listing 19.2 shows the template from the product form component, in which I have commented
out the elements that I used to demonstrate the difference between providers for view children
and content children.
Listing 19.2. The contents of the productForm.component.html file in the src/app folder
<form #form="ngForm" (ngSubmit)="submitForm(form)">
<div class="form-group">
<label>Name</label>
<input class="form-control"
name="name" [(ngModel)]="newProduct.name" />
</div>
<div class="form-group">
<label>Category</label>
<input class="form-control"
name="category" [(ngModel)]="newProduct.category" />
</div>
<div class="form-group">
<label>Price</label>
<input class="form-control"
name="name" [(ngModel)]="newProduct.price" />
</div>
<button class="btn btn-primary mt-2" type="submit">

---

## Create

</button>
</form>
<!-- <paDiscountEditor></paDiscountEditor> -->
<!-- <paDiscountDisplay></paDiscountDisplay> -->
Run the following command in the example folder to start the Angular development tools:
ng serve
Open a new browser window and navigate to http://localhost:4200 to see the content shown
in figure 19.1.
-- 553 of 848 --
543
Figure 19.1. Running the example application
19.2 	Understanding the root module
Every Angular has at least one module, known as the root module. The root module is
conventionally defined in a file called app.module.ts in the src/app folder, and it contains
a class to which the @NgModule decorator has been applied. Listing 19.3 shows the root
module from the example application.
Listing 19.3. The root module in the app.module.ts file in the src/app folder
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule }
from '@angular/platform-browser/animations';
import { ProductComponent } from './component';
import { PaAttrDirective } from "./attr.directive";
import { PaModel } from "./twoway.directive";
import { PaStructureDirective } from "./structure.directive";
import { PaIteratorDirective } from "./iterator.directive";
import { PaCellColor } from "./cellColor.directive";
import { PaCellColorSwitcher } from "./cellColorSwitcher.directive";
import { ProductTableComponent } from "./productTable.component";
import { ProductFormComponent } from "./productForm.component";
import { PaToggleView } from "./toggleView.component";
import { PaAddTaxPipe } from './addTax.pipe';
import { PaCategoryFilterPipe } from './categoryFilter.pipe';
import { LOCALE_ID } from "@angular/core";
import localeFr from '@angular/common/locales/fr';
-- 554 of 848 --
544
import { registerLocaleData } from '@angular/common';
import { PaDiscountDisplayComponent } from "./discountDisplay.component";
import { PaDiscountEditorComponent } from "./discountEditor.component";
import { DiscountService } from "./discount.service";
import { PaDiscountPipe } from "./discount.pipe";
import { PaDiscountAmountDirective } from "./discountAmount.directive";
import { SimpleDataSource } from "./datasource.model";
import { Model } from "./repository.model";
registerLocaleData(localeFr);
@NgModule({
declarations: [
ProductComponent, PaAttrDirective, PaModel, PaStructureDirective,
PaIteratorDirective, PaCellColor, PaCellColorSwitcher,
ProductTableComponent, ProductFormComponent, PaToggleView,
PaAddTaxPipe, PaCategoryFilterPipe, PaDiscountDisplayComponent,
PaDiscountEditorComponent, PaDiscountPipe,
PaDiscountAmountDirective
],
imports: [
BrowserModule,
BrowserAnimationsModule,
FormsModule
],
providers: [DiscountService, SimpleDataSource, Model],
bootstrap: [ProductComponent]
})
export class AppModule { }
There can be multiple modules in a project, but the root module is the one used in the bootstrap
fil

---

## Using standalone components

Angular supports creating applications without modules, to streamline the development
process. I have not covered standalone components in this book because they are
-- 555 of 848 --
545
surprisingly difficult to work with and also because the structure introduced by modules is
helpful in all but the simplest projects. Future editions of this book may include standalone
components 	if 	they 	mature 	into 	something 	useful 	but 	until 	then, 	see
https://angular.io/guide/standalone-components for details.
When defining the root module, the @NgModule decorator properties described in table 19.3
are used. (There are additional decorator properties, which are described later in the chapter.)
Table 19.3. The @NgModule decorator root module properties
Name 	Description
imports 	This property specifies the Angular modules that are required to support the
directives, components, and pipes in the application.
declarations 	This property is used to specify the directives, components, and pipes that are
used in the application.
providers 	This property defines the services available for use with dependency injection,
as described in chapter 18.
bootstrap 	This property specifies the root components of the application.
19.2.1 	Understanding the imports property
The imports property is used to list the other modules that the application requires. In the
example application, these are all modules provided by the Angular framework.
...
imports: [
BrowserModule,
BrowserAnimationsModule,
FormsModule
],
...
The BrowserModule provides the functionality required to run Angular applications in web
browsers. The BrowserAnimationsModule module was added to the project by the Angular
Material package and enables the features used to animate content, typically in response to
user interaction or data changes. The FormsModule module contains the features for working
with HTML form elements, which are described in part 3.
The imports property is also used to declare dependencies on custom modules, which are
used to manage complex Angular applications and to create units of reusable functionality. I
explain how custom modules are defined in the “Creating feature modules” section.
19.2.2 	Understanding the declarations property
The declarations property is used to provide Angular with a list of the directives,
components, and pipes that the application requires, known collectively as the declarable
-- 556 of 848 --
546
classes. The declarations property in the example project root module contains a long list
of classes, each of which is available for use elsewhere in the application only because it is
listed here.
...
declarations: [
ProductComponent, PaAttrDirective, PaModel, PaStructureDirective,
PaIteratorDirective, PaCellColor, PaCellColorSwitcher,
ProductTableComponent, ProductFormComponent, PaToggleView,
PaAddTaxPipe, PaCategoryFilterPipe, PaDiscountDisplayComponent,
PaDiscountEditorComponent, PaDiscountPipe,
PaDiscountAmountDirective
],
...
Notice that the built-in de

---

## Creating the example project

Throughout the chapters in the previous part of the book, I added classes and content to the
example project to demonstrate different Angular features and then, in chapter 19, introduced
feature modules to add some structure to the project. The result is a project with a lot of
redundant and unused functionality, and for this part of the book, I am going to start a new
project that takes some of the core features from earlier chapters and provides a clean
foundation on which to build in the chapters that follow.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
20.1 	Starting the example project
To create the project with tools and placeholder content, open a new command prompt,
navigate to a convenient location, and run the command shown in listing 20.1.
Listing 20.1. Creating the example project
ng new exampleApp --routing false --style css --skip-git --skip-tests
To distinguish the project used in this part of the book from earlier examples, I created a
project called exampleApp. The project initialization process will take a while to complete as
all the required packages are downloaded.
20.1.1 	Adding and configuring the Bootstrap CSS package
I continue to use the Bootstrap CSS framework to style the HTML elements in this chapter and
the rest of the book. Run the command shown in listing 20.2 in the exampleApp folder to add
the Bootstrap package to the project.
Listing 20.2. Adding a package to the project
-- 579 of 848 --
569
npm install bootstrap@5.2.3
The Bootstrap package isn’t specific to Angular development and doesn’t use the schematics
API, which means that a manual change must be made to the angular.config file to include
the Bootstrap CSS stylesheet in the styles bundle. For Linux, run the command shown in listing
20.3 in the exampleApp folder. Take care to enter the command exactly as shown and do not
introduce additional spaces or quotes.
Listing 20.3. Changing the application configuration
ng config projects.exampleApp.architect.build.options.styles
'["src/styles.css", "node_modules/bootstrap/dist/css/bootstrap.min.css"]'
If you are using Windows, then use a PowerShell prompt to run the command shown in listing
20.4 in the exampleApp folder.
Listing 20.4. Changing the application configuration using PowerShell
ng config projects.exampleApp.architect.build.options.styles `
'[""src/styles.css"",
""node_modules/bootstrap/dist/css/bootstrap.min.css""]'
20.1.2 	Creating the project structure
Create the folders shown in table 20.1 in preparation for the feature modules that the example
project will contain.
Table 20.1. The folders required for the example application
Name 	Description
src/app/model 	This folder will contain a feature module containing the data model.
src/app/core 	This folder will contain a feature module containing components that
provide 

---

## Edit

</button>
</td>
</tr>
</tbody>
</table>
<button class="btn btn-primary mt-1" (click)="createProduct()">
Create New Product
</button>
This template uses the ngFor directive to create rows in a table for each product in the data
model, including buttons that call the deleteProduct and editProduct methods. There is
also a button element outside of the table that calls the component’s createProduct
method when it is clicked.
20.4.3 	Creating the form component
For this project, I am going to create a form component that will manage an HTML form that
will allow new products to be created and allow existing products to be modified. To define the
component, I added a file called form.component.ts to the src/app/core folder and
added the code shown in listing 20.17.
Listing 20.17. The contents of the form.component.ts file in the src/app/core folder
import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Product } from "../model/product.model";
import { Model } from "../model/repository.model"
import { Message 	} from "../messages/message.model"
import { MessageService } from "../messages/message.service";
import { MODES, SharedState } from "./sharedState.service";
import { toObservable } from "@angular/core/rxjs-interop";
@Component({
selector: "paForm",
templateUrl: "form.component.html",
styleUrls: ["form.component.css"]
})
export class FormComponent {
product: Product = new Product();
editing: boolean = false;
constructor(private model: Model, private stateService: SharedState,
messageService: MessageService) {
-- 587 of 848 --
577
toObservable(stateService.state).subscribe(state => {
this.editing = state.mode == MODES.EDIT;
if (this.editing && state.id) {
this.product = Product.fromProduct(
this.model.getProduct(state.id) ?? new Product()) ;
} else {
this.product = new Product;
}
messageService.reportMessage(state.id
? new Message(`Editing ${this.product.name}`)
: new Message("Creating New Product"));
});
}
submitForm(form: NgForm) {
if (form.valid) {
this.model.saveProduct(this.product);
this.product = new Product();
this.stateService.update(MODES.CREATE);
form.resetForm();
}
}
}
A single component will present a form used to both create new products and edit existing
ones. The component depends on two services. The signals provided by the SharedState
service provide updates that change the details of the form shown to the user, based on
whether a product is being created or edited. I want to respond to changes in the state signal
in a way that will allow me to use two-way data bindings, and so I have used the
toObservable function to create an observable sequence that will produce a value every
time the underlying signal changes.
The other service is MessageService, which is used to send messages that indicate the
create/edit mode so they can be displayed to the user.
CREATING THE FORM COMPONENT TEMPLATE
To 	provide 	the 	component 	with 	a 	template, 	I 	added 	an 	HTML 	file 	called
form.component.html to the

---

## This chapter covers

▪ 	Using the Angular API to create and manage form elements
▪ 	Validating form elements created with the API
▪ 	Grouping form elements programmatically
In this chapter, I describe the Angular forms API, which provides an alternative to the
template-based approach to forms introduced in chapter 13. The forms API is a more
complicated way of creating forms, but it allows fine-grained control over how forms behave,
how they respond to user interaction, and how they are validated. Table 21.1 puts the forms
API in context.
Table 21.1. Putting the forms API in context
Question 	Answer
What is it? 	The forms API allows for the creation of reactive forms, which are
managed using the code in a component class.
Why is it useful? 	The forms API provides a component with more control over the
elements in forms and allows their behavior to be customized.
How is it used? 	FormControl and FormGroup objects are created by the
component class and associated with elements in the template using
directives.

---

## Are there any pitfalls or

limitations?
The forms API is complex, and additional work is required to ensure
that features such as validation behave consistently.
-- 592 of 848 --
582
Are there any alternatives? 	The forms API is optional. Forms can be defined using the basic
features described in chapter 13.
Table 21.2 summarizes the chapter.
Table 21.2. Chapter summary
Problem 	Solution 	Listing
Creating a reactive form 	Create a FormControl object in the component
class and associate it with a form element in the
template using the formControl directive
1–3

---

## Responding to element value

changes
Use the observable valueChanges property
defined by the FormControl class
4, 5
Managing element state 	Use the properties defined by the FormControl
class
6

---

## Displaying validation

messages for controls in a
group
Obtain a FormControl object through the
enclosing FormGroup object
19–20, 27,
28
21.1 	Preparing for this chapter
For this chapter, I will continue using the exampleApp project that I created in chapter 20.
No changes are required for this chapter.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
To start the development server, open a command prompt, navigate to the exampleApp
folder, and run the following command:
ng serve
Open a new browser window and navigate to http://localhost:4200 to see the content shown
in figure 21.1.
-- 593 of 848 --
583
Figure 21.1. Running the example application
21.2 	Understanding the reactive forms API
The simplest way to use HTML forms is to use Angular two-way bindings to connect input
elements to component properties, which is the approach I demonstrated in part 2 and which
I used to create the form in the example project in chapter 20. These are known as template-
driven forms.
For more complex forms, Angular provides a complete API that exposes the state of HTML
forms and allows their data and structure to be managed, known as reactive forms. You can
get a glimpse of the API in the way that the form element is defined in the
form.component.html file in the src/app folder:
...
<form #form="ngForm" (ngSubmit)="submitForm(form)"
(reset)="form.resetForm()">
...
The template variable named form is assigned the value ngForm, which is then used in the
event bindings, as a method argument in the ngSubmit event or to invoke a method in the
reset event. The ngForm value and the events themselves are defined as part of the Angular
form API.
One of the themes of this book has been that nothing in Angular is magic. Every feature is
implanted using the capabilities of the browser or builds on other Angular features. This
includes ngForm, which is a directive that acts as a wrapper around a FormGroup object,
-- 594 of 848 --
584
exposing its capabilities using the directive features described in chapter 13. The FormGroup
class, which is defined in the @angular/forms package, provides an API for working with a
form and can be used directly in a component class, allowing forms to be manipulated in code
and not just through HTML elements in a template. In turn, the FormGroup is a container for
FormControl objects, each of which represents an element in the form. As you will learn, the
FormGroup and FormControl classes are the building blocks of the reactive forms API, and
the ngForm directive, with which you are already familiar, simply presents this API so it can
be used easily in templates.
21.3 	Rebuilding the form using the API
The simplest way to get started is with a single form element so you can understand the basic
building 	blocks 	of 	the 	API. 	The 	reactive 	form 	features 	require 	a 	new 	module,
Rea

---

## chapter 13 for details of how to process a ValidationErrors object to display validation

messages that are more usefully presented to the user.)
Figure 21.6. Responding to status changes
The message shown in figure 21.6 isn’t especially useful to the user, but the formControl
directive uses the exportAs property to provide an identifier named ngForm for use in
template variables, and this can be used to generate more helpful validation messages for a
control. To prepare, add a file named validationHelper.pipe.ts to the src/app/core
folder with the content shown in listing 21.9, which creates a pipe to format validation
messages.
Listing 21.9. The contents of the validationHelper.pipe.ts file in the src/app/core folder
import { Pipe } from "@angular/core";
import { FormControl, ValidationErrors } from "@angular/forms";
@Pipe({
name: "validationFormat"
})
export class ValidationHelper {
-- 607 of 848 --
597
transform(source: any, name: any) : string[] {
if (source instanceof FormControl) {
return this.format((source as FormControl).errors, name)
}
return this.format(source as ValidationErrors, name)
}
format(errors: ValidationErrors | null, name: string): string[] {
let messages: string[] = [];
for (let errorName in errors) {
switch (errorName) {
case "required":
messages.push(`You must enter a ${name}`);
break;
case "minlength":
messages.push(`A ${name} must be at least
${errors['minlength'].requiredLength}
characters`);
break;
case "pattern":
messages.push(`The ${name} contains
illegal characters`);
break;
}
}
return messages;
}
}
This code is based on the approach I took in chapter 13 to generate user-friendly messages
for template-driven forms. Listing 21.10 registers the pipe so that it will be available in the
rest of the module.
Listing 21.10. Registering a pipe in the core.modules.ts file in the src/app/core folder
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModelModule } from "../model/model.module";
import { TableComponent } from "./table.component";
import { FormComponent } from "./form.component";
import { SharedState } from "./sharedState.service";
import { ValidationHelper } from "./validationHelper.pipe";
@NgModule({
imports: [BrowserModule, FormsModule, ModelModule,
ReactiveFormsModule],
declarations: [TableComponent, FormComponent, ValidationHelper],
exports: [ModelModule, TableComponent, FormComponent],
providers: [SharedState]
})
export class CoreModule { }
Listing 21.11 uses a template variable to obtain a reference for the FormControl object,
which is used to get validation messages that can be displayed to the user.
-- 608 of 848 --
598
Listing 21.11. Generating error messages in the form.component.html file in the
src/app/core folder
<div class="form-group">
<label>Name</label>
<input class="form-control" name="name" [formControl]="nameField"
#name="ngForm" />
<ul class="text-danger list-unstyled mt-1"
*ngIf="name.dirty && name.invalid">
<li *ngFor="let err of name.errors | validati

---

## Cancel

</button>
</div>
-- 618 of 848 --
608
</form>
I used the directive’s ngForm property to create a template variable named form, through
which I can check the overall validation status for the Save/Create button. The ngSubmit
form is used to invoke a method named submitForm, and I used the form element’s reset
event to invoke a method named resetForm. Listing 21.18 shows the changes required to
the component class to support the additions to the template.
Listing 21.18. Completing the form in the form.component.ts file in the src/app/core
folder
import { Component } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators }
from "@angular/forms";
import { Product } from "../model/product.model";
import { Model } from "../model/repository.model"
import { Message 	} from "../messages/message.model"
import { MessageService } from "../messages/message.service";
import { MODES, SharedState } from "./sharedState.service";
import { toObservable } from "@angular/core/rxjs-interop";
@Component({
selector: "paForm",
templateUrl: "form.component.html",
styleUrls: ["form.component.css"]
})
export class FormComponent {
product: Product = new Product();
editing: boolean = false;
productForm: FormGroup = new FormGroup({
name: 	new FormControl("", {
validators: [
Validators.required,
Validators.minLength(3),
Validators.pattern("^[A-Za-z ]+$")
],
updateOn: "change"
}),
category: new FormControl("", { validators: Validators.required }),
price: new FormControl("", {
validators: [
Validators.required,
Validators.pattern("^[0-9\.]+$")
]
})
});
constructor(private model: Model, private stateService: SharedState,
messageService: MessageService) {
toObservable(stateService.state).subscribe(state => {
this.editing = state.mode == MODES.EDIT;
if (this.editing && state.id) {
this.product = Product.fromProduct(
this.model.getProduct(state.id) ?? new Product()) ;
-- 619 of 848 --
609
} else {
this.product = new Product;
}
this.productForm.reset(this.product);
messageService.reportMessage(state.id
? new Message(`Editing ${this.product.name}`)
: new Message("Creating New Product"));
});
// this.productForm.statusChanges.subscribe(newStatus => {
// 	if (newStatus == "INVALID") {
// 	let invalidControls: string[] = [];
// 	for (let controlName in this.productForm.controls) {
// 	if (this.productForm.controls[controlName].invalid) {
// 	invalidControls.push(controlName)
// 	}
// 	}
// 	messageService.reportMessage(
// 	new Message(`INVALID: ${invalidControls.join(", ")}`))
// 	} else {
// 	messageService.reportMessage(new Message(newStatus));
// 	}
// })
}
submitForm() {
if (this.productForm.valid) {
Object.assign(this.product, this.productForm.value);
this.model.saveProduct(this.product);
this.product = new Product();
this.productForm.reset();
}
}
resetForm() {
this.editing = true;
this.product = new Product();
this.productForm.reset();
}
}
This listing adds a FormControl named price, adds validation to the category control and
defines the submitForm and resetForm

---

## Cancel

</button>
</div>
</form>
The directive is configured with the FormGroup property defined by the component class and
the name of the FormControl object for which errors are required. This is an indirect way of
working, but it works as seamlessly as dealing with individual elements once the building blocks
are in place, as shown in figure 21.12.
-- 624 of 848 --
614
Figure 21.12. Displaying validation messages from a form group
21.5 	Summary
In this chapter, I introduced the Angular reactive forms API and showed you how it can be
used to create and manage forms, providing a more code-centered approach than the standard
template-driven forms described in chapter 13.
▪ 	Angular provides an API for working with form elements.
▪ 	The form API allows control validation and behavior to be defined in code.
▪ 	The API provides events that describe changes in control content and validation state.
▪ 	Controls can be grouped and operated on as a single unit.
In the next chapter, I continue to describe the forms API, explaining how to create controls
dynamically and how to create custom validators.
-- 625 of 848 --
615
22
Using the forms API, part 2

---

## This chapter covers

▪ 	Creating form components dynamically
▪ 	Validating dynamically created form components
▪ 	Using the asynchronous validation features
▪ 	Writing custom form validators.
In this chapter, I continue to describe the Angular forms API, explaining how to create form
controls dynamically and how to create custom validation. Table 22.1 summarizes the chapter.
Table 22.1. Chapter summary
Problem 	Solution 	Listing

---

## Performing complex or remote

validation
Create an asynchronous validator 	24–27
22.1 	Preparing for this chapter
For this chapter, I will continue using the exampleApp project from chapter 21. No changes
are required for this chapter.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
To start the development server, open a command prompt, navigate to the exampleApp
folder, and run the following command:
ng serve
Open a new browser window and navigate to http://localhost:4200 to see the content shown
in figure 22.1.
Figure 22.1. Running the example application
-- 627 of 848 --
617
22.2 	Creating form components dynamically
The FormGroup class is useful when the structure and number of elements in the form are
known in advance. For applications that need to dynamically add and remove elements,
Angular provides the FormArray class. Both FormArray and FormControl are derived from
the AbstractControl class and provide the same features for managing FormGroup
objects; the difference is that the FormArray class allows FormControl objects to be created
without specifying names and stores its controls as an array, making it easier to add and
remove controls. To prepare, listing 22.1 adds an array of keywords to the Product model
class.
Listing 22.1. Adding a property in the product.model.ts file in the src/app/model folder
export class Product {
constructor(public id?: number,
public name?: string,
public category?: string,
public price?: number,
public keywords?: string[]) { }
static fromProduct(p: Product) {
return new Product(p.id, p.name, p.category, p.price, p.keywords);
}
}
Listing 22.2 updates the static example data to reflect the addition of the keywords property.
Listing 22.2. Updating data in the static.datasource.ts file in the src/app/model folder
import { Injectable } from "@angular/core";
import { Product } from "./product.model";
@Injectable()
export class StaticDataSource {
private data: Product[];
constructor() {
this.data = new Array<Product>(
new Product(1, "Kayak", "Watersports", 275, ["boat", "small"]),
new Product(2, "Lifejacket", "Watersports", 48.95, ["safety"]),
new Product(3, "Soccer Ball", "Soccer", 19.50),
new Product(4, "Corner Flags", "Soccer", 34.95),
new Product(5, "Thinking Cap", "Chess", 16));
}
getData(): Product[] {
return this.data;
}
}
Listing 22.3 adds a new column to the template for the table component so the keywords are
displayed to the user.
Listing 22.3. Adding a column in the table.component.html file in the src/app/core folder
-- 628 of 848 --
618
<table class="table table-sm table-bordered table-striped">
<thead>
<tr>
<th>ID</th><th>Name</th><th>Category</th>
<th>Price</th><th>Keywords</th><th></th>
</tr>
</thead>
<tbody>
<tr *ngFor="let item of Products()">
<td>{{item.id}}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td>{{item.price | currency:"

---

## Edit

</button>
</td>
</tr>
</tbody>
</table>
<button class="btn btn-primary mt-1" (click)="createProduct()">
Create New Product
</button>
22.2.1 	Using a form array
The FormArray class stores its child controls in an array and provides the properties and
methods described in table 22.2 for managing the array, in addition to those it inherits from
the AbstractControl class and that are shared with the FormGroup and FormControl
classes.
Table 22.2. Useful FormArray members for managing controls
Name 	Description
controls 	This property returns an array containing the child controls.
length 	This property returns the number of controls that are in the
FormArray.
at(index) 	This property returns the control at the specified index in the
FormArray.
push(control) 	This method adds a control to the end of the array.
insert(index, control) 	This method inserts a control at the specified index.
-- 629 of 848 --
619
setControl(index,
control)
This method replaces the control at the specified index.
removeAt(index) 	This method removes the control at the specified index.
clear() 	This method removes all of the controls from the FormArray.
The FormArray class also provides methods for setting the values of the controls it manages
using arrays, rather than name-value maps, as described in table 22.3.
Table 22.3. The FormArray methods for setting values
Name 	Description
setValue(values) 	This method accepts an array of values and uses them to set the values of
the child controls based on the order in which they are defined. The
number of elements in the values array must match the number of controls
in the FormArray.
patchValue(values) 	This method accepts an array of values and uses them to set the values of
the child controls based on the order in which they are defined. Unlike the
setValue method, the number of elements in the values array does not
have to match the number of controls in the FormArray, and this method
will ignore values for which there are no controls and will ignore controls
for which there are no values.
reset(values) 	This method resets the controls in the FormArray and sets their values
using the optional array argument. The number of elements in the values
array does not have to match the number of controls in the FormArray.
Values for which there are no controls are ignored, and controls for which
there are no values are reset to their default state.
Listing 22.4 uses the features described in these tables to vary the number of controls
displayed for the keywords model property.
Listing 22.4. Using a FormArray in the form.components.ts file in the src/app/core folder
import { Component } from "@angular/core";
import { FormArray, FormControl, FormGroup, NgForm, Validators }
from "@angular/forms";
import { Product } from "../model/product.model";
import { Model } from "../model/repository.model"
import { Message 	} from "../messages/message.model"
import { MessageService } from "../messages/message.service";
import { MODES, SharedState } fr

---

## Cancel

</button>
</div>
</form>
It is important to reflect the structure of the FormGroup and FormArray objects when
creating HTML elements, ensuring that each is correctly configured with the formGroupName
directive. I used the ng-container element to avoid introducing an HTML element for the
FormArray object and used the ngFor directive to create elements for each FormControl
in the FormArray:
...
<div class="form-group" *ngFor="let c of keywordGroup.controls;
let i = index">
...
Each input element must be configured with the formControlName directive, using an array
position as its value, instead of a name:
...
<input class="form-control" [formControlName]="i" [value]="c.value" />
...
The result is that the number of form controls displayed to the user varies based on the
Product value that is selected, as shown in figure 22.2. Notice that Angular correctly
populates the input elements through the FormArray, mapping the values in the keywords
model array to the elements in the form.
-- 634 of 848 --
624
Figure 22.2. Using a form array
22.2.2 	Adding and removing form controls
To complete the support for multiple keywords, I am going to allow the user to add and remove
controls. Listing 22.6 adds methods to the control class.
Listing 22.6. Adding methods in the form.component.ts file in the src/app/core folder
import { Component } from "@angular/core";
import { FormArray, FormControl, FormGroup, NgForm, Validators } from
"@angular/forms";
import { Product } from "../model/product.model";
import { Model } from "../model/repository.model"
import { Message 	} from "../messages/message.model"
import { MessageService } from "../messages/message.service";
import { MODES, SharedState } from "./sharedState.service";
import { toObservable } from "@angular/core/rxjs-interop";
@Component({
selector: "paForm",
templateUrl: "form.component.html",
styleUrls: ["form.component.css"]
})
export class FormComponent {
// ...statements omitted for brevity...
addKeywordControl() {
this.keywordGroup.push(this.createKeywordFormControl());
}
removeKeywordControl(index: number) {
-- 635 of 848 --
625
this.keywordGroup.removeAt(index);
}
}
The new methods use the FormArray features described in table 22.2 to add and remove
FormGroup objects. Listing 22.7 adds elements to the template that will invoke the new
component methods and allow the user to manage the number of keywords fields.
Listing 22.7. Adding elements in the form.component.html file in the src/app/core folder
...
<div formGroupName="keywords">
<button class="btn btn-sm btn-primary my-2"
(click)="addKeywordControl()" type="button">
Add Keyword
</button>
<div class="form-group" *ngFor="let c of keywordGroup.controls;
let i = index; let count = count">
<label>Keyword {{ i + 1 }}</label>
<div class="input-group">
<input class="form-control"
[formControlName]="i" [value]="c.value" />
<button class="btn btn-danger" type="button"
*ngIf="count > 1" (click)="removeKeywordControl(i)">

---

## Delete

</button>
</div>
</div>
</div>
...
I use the count variable exported by the ngForm directive to display a Delete button only
when there are multiple controls in the form array. The number of keyword fields will be initially
determined by the selected Product object, after which the user can add and remove fields,
as shown in figure 22.3.
-- 636 of 848 --
626
Figure 22.3. Adding and removing form controls in a form array
22.2.3 	Validating dynamically created form controls
Validation for the controls in a FormArray is similar to validating the controls in a FormGroup,
as shown in listing 22.8.
Listing 22.8. Adding validation in the form.component.ts file in the src/app/core folder
...
createKeywordFormControl() {
return new FormControl("", {
validators: Validators.pattern("^[A-Za-z ]+$")
});
}
...
The advantage of using a method to create FormControl objects for the FormArray is that
I can define the validation policy in a single place. Listing 22.9 displays validation messages to
the user.
Listing 22.9. Displaying validation messages in the form.component.html file in the
src/app/core folder
...
<div formGroupName="keywords">
-- 637 of 848 --
627
<button class="btn btn-sm btn-primary my-2"
(click)="addKeywordControl()" type="button">
Add Keyword
</button>
<div class="form-group" *ngFor="let c of keywordGroup.controls;
let i = index; let count = count">
<label>Keyword {{ i + 1 }}</label>
<div class="input-group">
<input class="form-control"
[formControlName]="i" [value]="c.value" />
<button class="btn btn-danger" type="button"
*ngIf="count > 1" (click)="removeKeywordControl(i)">

---

## Delete

</button>
</div>
<ul class="text-danger list-unstyled mt-1">
<li *validationErrors="productForm;
control:'keywords.' + i; label: 'keyword'; let err">
{{ err }}
</li>
</ul>
</div>
</div>
...
The path to the control uses the position in the array, rather than a name, like this:
...
<li *validationErrors="productForm; control:'keywords.' + i;
label: 'keyword'; let err">
...
It is important to ensure you specify the correct position; otherwise, you will display validation
messages for a different control. The user is presented with a validation error if a disallowed
character is entered into a keyword field, as shown in figure 22.4.
Figure 22.4. Validation for a form array control
-- 638 of 848 --
628
22.2.4 	Filtering the FormArray values
When dealing with variable numbers of controls in a FormArray, the user may not enter
values in all of the controls, which can cause a problem when processing the contents of the
form. Figure 22.5 illustrates the problem.
Figure 22.5. The effect of empty fields in form array controls
I left one of the keyword fields empty when I submitted the form, which means that an empty
string has been included in the array of values assigned to the Product model object’s
keywords field.
I could prevent this problem using the required validator, but this requires the user to
remove any empty controls before submitting the form, which would be an awkward
interruption to their workflow.
My preference is to give the user some flexibility and create a custom class that will filter
out unwanted values. Add a file named filteredFormArray.ts to the src/app/core
folder with the contents shown in listing 22.10.
Listing 22.10. The contents of the filteredFormArray.ts file in the src/app/core folder
import { FormArray } from "@angular/forms";
-- 639 of 848 --
629
export type ValueFilter = (value: any) => boolean;
export class FilteredFormArray extends FormArray {
filter: ValueFilter | undefined = (val) => val == "" || val == null;
_updateValue() {
(this as {value: any}).value =
this.controls.filter((control) =>
(control.enabled || this.disabled)
&& !this.filter?.(control.value)
).map((control) => control.value);
}
}
The FilteredFormArray class defines an _updateValue method, which applies a filter
function that, by default, excludes empty string and null values.
The code in listing 22.10 is on the edge of what I would consider acceptable meddling with
the Angular API. You won’t see the _updateValue method in the API documentation for the
FormArray class because it is part of the internal API, which was originally defined as an
abstract method in the AbstractControl class and then overridden in the FormArray class.
These methods are marked as internal, and I located them by looking at the Angular source
code to figure out how these classes set the value property.
There are two issues with using methods like this. The first is that internal methods are
subject to change or removal without notice, which means that figure releases of Angular 

---

## Delete

</button>
</div>
<ul class="text-danger list-unstyled mt-1">
<li *validationErrors="productForm;
control:'keywords.' + i; label: 'keyword'; let err">
{{ err }}
</li>
-- 650 of 848 --
640
</ul>
</div>
</div>
...
To see the effect, click the Edit button for the Kayak product and change the value of the
second keyword field to boat. The validator will detect the duplicate value and display a
validation message, as shown in figure 22.9.
Figure 22.9. Validating across fields
The validator works as expected, but there is an important mismatch between the validation
message and the color coding applied to the individual elements, which I will improve upon in
the next section.
IMPROVING CROSS-FIELD VALIDATION
Improving the cross-field validation experience can be done, but it requires careful navigation
around the way that Angular expects groups of form controls to behave. Unlike an earlier
example in this chapter, no internal methods are used, but the code relies on the setTimeout
function to trigger changes after the current update cycle to perform updates without creating
an infinite update loop.
The problem is that Angular expects changes to propagate up through the structure of form
controls so that the user edits a field, which triggers validation in the FormControl, and then
in its enclosing FormGroup or FormArray, working its way to the top-level FormGroup. To
-- 651 of 848 --
641
achieve the effect I want, I have to push updates in the opposite direction so that a change in
validation status in the FormArray triggers validation updates in the enclosed FormControl
objects. Listing 22.23 updates the unique custom validator so that it alters the validation
status of contained FormControl elements that contain the same value.
Listing 22.23. Improving validation in the unique.ts file in the src/app/validation folder
import { AbstractControl, FormArray, ValidationErrors, ValidatorFn }
from "@angular/forms";
export class UniqueValidator {
static uniquechild(control: AbstractControl)
: ValidationErrors | null {
return control.parent?.hasError("unique")
? {"unique-child": {}} : null;
}
static unique() : ValidatorFn {
return (control: AbstractControl) : ValidationErrors | null => {
let badElems: AbstractControl[] = [];
let goodElems: AbstractControl[] = [];
if (control instanceof FormArray) {
control.controls.forEach((child, index) => {
if (control.controls.filter((c, i2) => i2 != index)
.some(target => target.value != ""
&& target.value == child.value)) {
badElems.push(child);
} else {
goodElems.push(child);
}
})
setTimeout(() => {
badElems.forEach(c => {
if (!c.hasValidator(this.uniquechild)) {
c.markAsDirty();
c.addValidators(this.uniquechild)
c.updateValueAndValidity({onlySelf: true,
emitEvent: false});
}
})
goodElems.forEach(c => {
if (c.hasValidator(this.uniquechild)) {
c.removeValidators(this.uniquechild);
}
c.updateValueAndValidity({ onlySelf: true,
emitEvent: false})
})
}, 0);
}
return badElems.length > 0 ? {"unique": {}} : null;
}
}
}
-- 652 of 

---

## chapter 21.

22.4 	Summary
In this chapter, I described the Angular forms API features for creating controls dynamically
using a FormArray and explained the different ways in which custom validation can be
performed, including the use of asynchronous validators.
▪ 	Angular provides an API for creating form components dynamically.
▪ 	The FormGroup class is used to represent dynamically created components.
▪ 	The API includes support for validating data, which can be done synchronously or
asynchronously.
In the next chapter, I describe the features that Angular provides for making HTTP requests.
-- 657 of 848 --
647
23
Making HTTP Requests

---

## This chapter covers

▪ 	Using the built-in Angular features for HTTP requests
▪ 	Receiving data from HTTP requests
▪ 	Setting headers in HTTP requests
▪ 	Handling HTTP request errors
All the examples since chapter 9 have relied on static data that has been hardwired into the
application. In this chapter, I demonstrate how to use asynchronous HTTP requests, often
called Ajax requests, to interact with a web service to get real data into an application. Table
23.1 puts HTTP requests in context.
Table 23.1. Putting Asynchronous HTTP Requests in Context
Question 	Answer
What are they? 	Asynchronous HTTP requests are HTTP requests sent by the
browser on behalf of the application. The term asynchronous refers
to the fact that the application continues to operate while the browser
is waiting for the server to respond.
Why are they useful? 	Asynchronous HTTP requests allow Angular applications to interact
with web services so that persistent data can be loaded into the
application and changes can be sent to the server and saved.
How are they used? 	Requests are made using the HttpClient class, which is
delivered as a service through dependency injection. This class
provides an Angular-friendly wrapper around the browser’s
XMLHttpRequest feature.
-- 658 of 848 --
648

---

## Are there any pitfalls or

limitations?
Using the Angular HTTP feature requires the use of Reactive
Extensions Observable objects.
Are there any alternatives? 	You can work directly with the browser’s XMLHttpRequest object
if you prefer, and some applications—those that don’t need to deal
with persistent data—can be written without making HTTP requests
at all.
Table 23.2 summarizes the chapter.
Table 23.2. Chapter Summary
Problem 	Solution 	Listing
Sending HTTP requests in an

---

## Angular application

Use the Http service 	1–7
Performing REST operations 	Use the HTTP method and URL to specify an
operation and a target for that operation
8–10
Making cross-origin requests 	Use the HttpClient service to support CORS
automatically
11
Including headers in a request 	Set the headers property in the Request object 	12–13
Responding to an HTTP error 	Create an error handler class 	14, 15
23.1 	Preparing the example project
This chapter uses the exampleApp project created in chapter 20 and modified in the chapters
that followed. For this chapter, I rely on a server that responds to HTTP requests with JSON
data. Run the command shown in listing 23.1 in the exampleApp folder to add the json-
server package to the project.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
Listing 23.1. Adding a package to the project
npm install json-server@0.17.3
I added an entry in the scripts section of the package.json file to run the json-server
package, as shown in listing 23.2.
Listing 23.2. Adding a script entry in the package.json file in the exampleApp folder
...
"scripts": {
"ng": "ng",
-- 659 of 848 --
649
"start": "ng serve",
"build": "ng build",
"watch": "ng build --watch --configuration development",
"test": "ng test",
"json": "json-server --p 3500 restData.js"
},
...
23.1.1 	Configuring the model feature module
The @angular/common/http JavaScript module contains an Angular module called
HttpClientModule, which must be imported into the application in either the root module
or one of the feature modules before HTTP requests can be created. In listing 23.3, I imported
the module to the model module, which is the natural place in the example application because
I will be using HTTP requests to populate the model with data.
Listing 23.3. Importing a module in the model.module.ts file in the src/app/model folder
import { NgModule } from "@angular/core";
import { StaticDataSource } from "./static.datasource";
import { Model } from "./repository.model";
import { HttpClientModule } from "@angular/common/http";
@NgModule({
imports: [HttpClientModule],
providers: [Model, StaticDataSource]
})
export class ModelModule { }
23.1.2 	Creating the data file
To provide the json-server package with some data, I added a file called restData.js to
the exampleApp folder and added the code shown in listing 23.4.
Listing 23.4. The contents of the restData.js file in the exampleApp folder
module.exports = function () {
var data = {
products: [
{ id: 1, name: "Kayak", category: "Watersports", price: 275,
keywords: ["boat", "small"] },
{ id: 2, name: "Lifejacket", category: "Watersports",
price: 48.95, keywords: ["safety"] },
{ id: 3, name: "Soccer Ball", category: "Soccer",
price: 19.50 },
{ id: 4, name: "Corner Flags", category: "Soccer",
price: 34.95 },
{ id: 5, name: "Stadium", category: "Soccer", pr

---

## Edit

</button>
</td>
</tr>
</tbody>
</table>
<button class="btn btn-primary mt-1" (click)="createProduct()">
Create New Product
</button>
<button class="btn btn-danger mt-1 mx-1" (click)="deleteProduct(-1)">
Generate HTTP Error
</button>
The button element invokes the component’s deleteProduct method with an argument of
-1. The component will ask the repository to delete this object, which will lead to an HTTP
DELETE request being sent to /products/-1, which does not exist. If you open the browser’s
JavaScript console and click the Generate HTTP Error button, you will see the response from
the server displayed, like this:
DELETE http://localhost:3500/products/-1 404 (Not Found)
Improving this situation means detecting this kind of error when it occurs and notifying the
user, who won’t typically be looking at the JavaScript console. A real application might also
respond to errors by logging them so they can be analyzed later, but I am going to keep things
simple and just display an error message.
-- 675 of 848 --
665
23.7.1 	Generating user-ready messages
The first step in handling errors is to convert the HTTP exception into something that can be
displayed to the user. The default error message, which is the one written to the JavaScript
console, contains too much information to display to the user. Users don’t need to know the
URL that the request was sent to; just having a sense of the kind of problem that has occurred
will be enough.
The best way to transform error messages is to use the catchError method. The
catchError method is used with the pipe method to receive any errors that occur within an
Observable sequence, as shown in listing 23.13.
Listing 23.13. Transforming errors in the rest.datasource.ts file in the src/app/model
folder
import { Injectable, Signal } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Product } from "./product.model";
import { Observable, catchError } from "rxjs";
export const REST_URL = `http://${location.hostname}:3500/products`;
@Injectable()
export class RestDataSource {
constructor(private http: HttpClient) { }
getData(): Observable<Product[]> {
return this.sendRequest<Product[]>("GET", REST_URL);
}
saveProduct(product: Product): Observable<Product> {
return this.sendRequest<Product>("POST", REST_URL, product);
}
updateProduct(product: Product): Observable<Product> {
return this.sendRequest<Product>("PUT",
`${REST_URL}/${product.id}`, product);
}
deleteProduct(id: number): Observable<Product> {
return this.sendRequest<Product>("DELETE", `${REST_URL}/${id}`);
}
private sendRequest<T>(verb: string, url: string, body?: Product)
: Observable<T> {
return this.http.request<T>(verb, url, {
body: body,
headers: new HttpHeaders({
"Access-Key": "<secret>",
"Application-Name": "exampleApp"
})
}).pipe(catchError((error: Response) => {
throw(`Network Error: ${error.statusText} (${error.status})`)
-- 676 of 848 --
666
}));
}
}
The function passed to the catchError method is invoked

---

## This chapter covers

▪ 	Using the Angular routing system to select components based on the current URL
▪ 	Defining and using routes
▪ 	Using directives to enable navigation to different URLs
▪ 	Inspecting the active route within components
▪ 	Receiving events that describe route changes
The Angular routing feature allows applications to change the components and templates that
are displayed to the user by responding to changes to the browser’s URL. This allows complex
applications to be created that adapt the content they present openly and flexibly, with minimal
coding. To support this feature, data bindings and services can be used to change the browser’s
URL, allowing the user to navigate around the application.
Routing is useful as the complexity of a project increases because it allows the structure of
an application to be defined separately from the components and directives, meaning that
changes to the structure can be made in the routing configuration and do not have to be
applied to the individual components.
In this chapter, I demonstrate how the basic routing system works and apply it to the
example application. In chapters 25 and 26, I explain the more advanced routing features.
Table 24.1 puts routing in context.
Table 24.1. Putting routing and navigation in context
Question 	Answer
What is it? 	Routing uses the browser’s URL to manage the content displayed to
the user.
-- 680 of 848 --
670
Why is it useful? 	Routing allows the structure of an application to be kept apart from
the components and templates in the application. Changes to the
structure of the application are made in the routing configuration
rather than in individual components and directives.
How is it used? 	The routing configuration is defined as a set of fragments that are
used to match the browser’s URL and to select a component whose
template is displayed as the content of an HTML element called
router-outlet.

---

## Are there any pitfalls or

limitations?
The routing configuration can become unmanageable, especially if
the URL schema is being defined gradually on an ad hoc basis.
Are there any alternatives? 	You don’t have to use the routing feature. You could achieve similar
results by creating a component whose view selects the content to
display to the user with the ngIf or ngSwitch directive, although
this approach becomes more difficult than using routing as the size
and complexity of an application increases.
Table 24.2 summarizes the chapter.
Table 24.2. Chapter summary
Problem 	Solution 	Listing
Using URL navigation to select
the content shown to users
Use URL routing 	1–4
Navigating using an HTML
element
Apply the routerLink attribute 	5–7
Responding to route changes 	Use the routing services to receive notifications 	8
Including information in URLs 	Use route parameters 	9–17
Navigating using code 	Use the Router service 	18

---

## Receiving notifications of

routing activity
Handle routing events 	19–23
24.1 	Preparing the example project
This chapter uses the exampleApp project created in chapter 23. No changes are required for
this chapter.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
-- 681 of 848 --
671
Open a new command prompt, navigate to the exampleApp folder, and run the following
command to start the server that provides the RESTful web server:
npm run json
Open a separate command prompt, navigate to the exampleApp folder, and run the following
command to start the Angular development tools:
ng serve
Open a new browser window and navigate to http://localhost:4200 to see the content shown
in figure 24.1.
Figure 24.1. Running the example application
24.2 	Getting started with routing
At the moment, all the content in the application is visible to the user all of the time. For the
example application, this means that both the table and the form are always visible, and it is
up to the user to keep track of which part of the application they are using for the task at
hand.
-- 682 of 848 --
672
That’s fine for a simple application, but it becomes unmanageable in a complex project,
which can have many areas of functionality that would be overwhelming if they were all
displayed at once.
URL routing adds structure to an application using a natural and well-understood aspect of
web applications: the URL. In this section, I am going to introduce URL routing by applying it
to the example application so that either the table or the form is visible, with the active
component being chosen based on the user’s actions. This will provide a good basis for
explaining how routing works and set the foundation for more advanced features.
24.2.1 	Creating a routing configuration
The first step when applying routing is to define the routes, which are mappings between URLs
and the components that will be displayed to the user. Routing configurations are
conventionally defined in a file called app.routing.ts, defined in the src/app folder. I
created this file and added the statements shown in listing 24.1.
Listing 24.1. The contents of the app.routing.ts file in the src/app folder
import { Routes, RouterModule } from "@angular/router";
import { tableComponent } from "./core/table.component";
import { FormComponent } from "./core/form.component";
const routes: Routes = [
{ path: "form/edit", component: FormComponent },
{ path: "form/create", component: FormComponent },
{ path: "", component: tableComponent }]
export const routing = RouterModule.forRoot(routes);
The Routes class defines a collection of routes, each of which tells Angular how to handle a
specific URL. This example uses the most basic properties, where the path specifies the URL
and the component property specifies the component that will be displayed to the user.
The pa

---

## chapter 26.

resolve 	This property is used to define work that must be completed before a route
can be activated, as described in chapter 26.
canActivate 	This property is used to control when a route can be activated, as described
in chapter 26.
canActivateChild 	This property is used to control when a child route can be activated, as
described in chapter 26.
canDeactivate 	This property is used to control when a route can be deactivated so that a
new route can be activated, as described in chapter 26.
loadChildren 	This property is used to configure a module that is loaded only when it is
needed, as described in chapter 26.
canLoad 	This property is used to control when an on-demand module can be loaded.
-- 684 of 848 --
674

---

## Understanding route ordering

The order in which routes are defined is significant. Angular compares the URL to which the
browser has navigated with the path property of each route in turn until it finds a match.
This means that the most specific routes should be defined first, with the routes that follow
decreasing in specificity. This isn’t a big deal for the routes in listing 24.1, but it becomes
significant when using route parameters (described in the “Using Route Parameters” section
of this chapter) or adding child routes (described in chapter 25).
If you find that your routing configuration doesn’t result in the behavior you expect, then
the order in which the routes have been defined is the first thing to check.
24.2.2 	Creating the routing component
When using routing, the root component is dedicated to managing the navigation between
different parts of the application. This is the typical purpose of the app.component.ts file
that was added to the project by the ng new command when it was created. This component
is a vehicle for its template, which is the app.component.html file in the src/app folder.
In listing 24.2, I have replaced the default contents.
Listing 24.2. Replacing the contents of the app.component.html file in the src/app file
<paMessages></paMessages>
<router-outlet></router-outlet>
The paMessages element displays any messages and errors in the application. For routing,
it is the router-outlet element—known as the outlet—that is important because it tells
Angular that this is where the component matched by the routing configuration should be
displayed.
24.2.3 	Updating the root module
The next step is to update the root module so that the new root component is used to bootstrap
the application, as shown in listing 24.3, which also imports the module that contains the
routing configuration.
Listing 24.3. Enabling routing in the app.module.ts file in the src/app folder
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { AppComponent } from './app.component';
import { ModelModule } from "./model/model.module";
import { CoreModule } from "./core/core.module";
import { TableComponent } from "./core/table.component";
import { FormComponent } from "./core/form.component";
import { MessageModule } from "./messages/message.module";
import { MessageComponent } from "./messages/message.component";
import { AppComponent } from './app.component';
import { routing } from "./app.routing";
-- 685 of 848 --
675
@NgModule({
declarations: [AppComponent],
imports: [BrowserModule, ModelModule, CoreModule, MessageModule,
routing],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }
24.2.4 	Completing the Configuration
The final step is to update the index.html file, as shown in listing 24.4.
Listing 24.4. Configuring routing in the index.html file in the src folder
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>ExampleApp</title>
<base href="/">
<meta name="viewport" conte

---

## Edit

</button>
</td>
</tr>
</tbody>
</table>
<button class="btn btn-primary mt-1" (click)="createProduct()"
routerLink="/form/create">
Create New Product
</button>
<button class="btn btn-danger mt-1 mx-1" (click)="deleteProduct(-1)">
Generate HTTP Error
</button>
The routerLink attribute applies a directive from the routing package that performs the
navigation change. This directive can be applied to any element, although it is typically applied
to button and anchor (a) elements. The expression for the routerLink directive applied to
the Edit buttons tells Angular to target the /form/edit route.
...
<button class="btn btn-warning btn-sm" (click)="editProduct(item.id)"
routerLink="/form/edit">

---

## Edit

</button>
...
The same directive applied to the Create New Product button tells Angular to target the
/create route.
...
<button class="btn btn-primary m-1" (click)="createProduct()"
routerLink="/form/create">
Create New Product
</button>
...
The routing links added to the table component’s template will allow the user to navigate to
the form. The addition to the form component’s template shown in listing 24.6 will allow the
user to navigate back again using the Cancel button.
Listing 24.6. Adding a link in the form.component.html file in the src/app/core folder
...
<div class="mt-2">
<button type="submit" class="btn btn-primary"
[class.btn-warning]="editing"
[disabled]="form.invalid">
{{editing ? "Save" : "Create"}}
</button>
<button type="reset" class="btn btn-secondary m-1" routerLink="/">
-- 688 of 848 --
678

---

## Cancel

</button>
</div>
...
The value assigned to the routerLink attribute targets the route that displays the product
table. Listing 24.7 updates the feature module that contains the template so that it imports
the RouterModule, which is the Angular module that contains the directive that selects the
routerLink attribute.
Listing 24.7. Enabling the directive in the core.module.ts file in the src/app/core folder
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, NG_VALIDATORS, ReactiveFormsModule }
from "@angular/forms";
import { ModelModule } from "../model/model.module";
import { TableComponent } from "./table.component";
import { FormComponent } from "./form.component";
import { SharedState } from "./sharedState.service";
import { ValidationHelper } from "./validationHelper.pipe";
import { ValidationErrorsDirective } from "./validationErrors.directive";
import { HiLowValidatorDirective } from "../validation/hilow";
import { RouterModule } from "@angular/router";
@NgModule({
imports: [BrowserModule, FormsModule, ModelModule,
ReactiveFormsModule, RouterModule],
declarations: [TableComponent, FormComponent, ValidationHelper,
ValidationErrorsDirective, HiLowValidatorDirective],
exports: [ModelModule, TableComponent, FormComponent],
providers: [SharedState]
})
export class CoreModule { }
24.2.6 	Understanding the effect of routing
Restart the Angular development tools, and you will be able to navigate around the application
using the Edit, Create New Product, and Cancel buttons, as shown in figure 24.3.
-- 689 of 848 --
679
Figure 24.3. Using routes to navigate around the application
Not all the features in the application work yet, but this is a good time to explore the effect of
adding routing to the application. Enter the root URL for the application (http://localhost:4200)
and then click the Create New Product button. When you clicked the button, the Angular routing
system changed the URL that the browser displays to this:
http://localhost:4200/form/create
If you watch the requests made by the application in the F12 development tools during the
transition, you will notice that no requests are sent to the server for new content. This change
is done entirely within the Angular application and does not produce any new HTTP requests.
The new URL is processed by the Angular routing system, which can match the new URL to
this route from the app.routing.ts file.
{ path: "form/create", component: FormComponent },
The routing system takes into account the base element in the index.html file when it
matches the URL to a route. The base element is configured with an href value of / that is
combined with the path in the route to make a match when the URL is /form/create.
The component property tells the Angular routing system that it should display the
FormComponent to the user. A new instance of the FormComponent class is created, and its
template content is used as the content for the route

---

## Edit

</button>
</td>
...
The routerLink attribute is now enclosed in square brackets, telling Angular that it should
treat the attribute value as a data binding expression. The expression is set out as an array,
with each element containing the value for one segment. The first two segments are literal
strings and will be included in the target URL without modification. The third segment will be
evaluated to include the id property value for the current Product object being processed by
the ngIf directive, just like the other expressions in the template. The routerLink directive
will combine the individual segments to create a URL such as /form/edit/2.
Listing 24.15 shows how the form component gets the value of the new route parameter
and uses it to select the product that is to be edited.
Listing 24.15. Using the new route parameter in the form.component.ts file in the
src/app/core folder
...
ngOnInit() {
this.editing = this.mode == "edit";
if (this.id != null) {
let idVal = parseInt(this.id);
Object.assign(this.product,
this.model.getProduct(idVal) || new Product());
this.productForm.patchValue(this.product);
}
}
@Input()
mode?: string;
@Input()
id?: string;
...
-- 699 of 848 --
689
When the user clicks an Edit button, the routing URL that is activated tells the form component
that an edit operation is required and specifies the product is to be modified, allowing the form
to be populated correctly, as shown in figure 24.5.
Figure 24.5. Using URLs segments to provide information

---

## Understanding direct user navigation

The introduction of routing has revealed a problem with the way that data is obtained from
the web service. If the user starts by requesting http://localhost:4200 and clicks one of the
Edit buttons, then the application works as expected and the form is correctly populated
with data.
But if the user navigates directly to the URL for editing a product, such as
http://localhost:4200/form/edit/2, then the form is never populated with data. This is
because the RestDataSource class has been written to assume that individual Product
objects will be accessed only by clicking an Edit button, which can be done only once the
data has been received from the web service.
-- 700 of 848 --
690
In chapter 26, I explain how you can stop routes from being activated until a specific
condition is true, such as the arrival of the data.
USING OPTIONAL ROUTE PARAMETERS
Optional route parameters allow URLs to include information to provide hints or guidance to
the rest of the application, but this is not essential for the application to work.
This type of route parameter is expressed using URL matrix notation, which isn’t part of
the specification for URLs but which browsers support nonetheless. Here is an example of a
URL that has optional route parameters:
http://localhost:4200/form/edit/2;name=Lifejacket;price=48.95
The optional route parameters are separated by semicolons (the ; character), and this URL
includes optional parameters called name and price.
As a demonstration of how to use optional parameters, listing 24.16 shows the addition of
an optional route parameter that includes the object to be edited as part of the URL.
Listing 24.16. An optional route parameter in the table.component.html file in the
src/app/core folder
...
<button class="btn btn-warning btn-sm"
(click)="editProduct(item.id)"
[routerLink]="['/form', 'edit', item.id,
{name: item.name, category: item.category,
price: item.price}]">

---

## Edit

</button>
...
The optional values are expressed as literal objects, where property names identify the optional
parameter. In this example, there are name, category, and price properties, and their
values are set.
Listing 24.17 shows how the form component checks to see whether the optional
parameters are present. If they have been included in the URL, then the parameter values are
used to avoid a request to the data model.
Listing 24.17. Receiving optional parameters in the form.component.ts file in the
src/app/core folder
...
@Input("name")
optionalName?: string;
@Input("category")
optionalCategory?: string;
@Input("price")
optionalPrice?: string;
ngOnInit() {
-- 701 of 848 --
691
this.editing = this.mode == "edit";
if (this.id != null) {
let idVal = parseInt(this.id);
Object.assign(this.product,
this.model.getProduct(idVal) || new Product());
this.product.name = this.optionalName ?? this.product.name;
this.product.category = this.optionalCategory
?? this.product.category;
if (this.optionalPrice != undefined) {
this.product.price = Number.parseFloat(this.optionalPrice);
}
this.productForm.patchValue(this.product);
}
}
...
The optional parameters in listing 24.16 will produce a URL like this one for the Edit buttons:
http://localhost:4200/form/edit/5;name=Stadium;category=Soccer;price=79500
Optional route parameters are accessed in the same way as required parameters, and it is the
responsibility of the component to check to see whether they are present and to proceed
anyway if they are not part of the URL. In this case, the component uses the optional parameter
values to override the values from the repository, which you can see by requesting this URL:
http://localhost:4200/form/edit/3;name=Soccer%20Ball;category=Football;pric
e=19.5
The supplied values are used to populate the form, as shown in figure 24.6. This is an example
of direct navigation and, as noted in the sidebar, the content is displayed before the repository
is populated with data from the web service.
-- 702 of 848 --
692
Figure 24.6. Using optional route parameters
24.3.3 	Navigating in code
Using the routerLink attribute makes it easy to set up navigation in templates, but
applications will often need to initiate navigation on behalf of the user within a component or
directive.
To give access to the routing system to building blocks such as directives and components,
Angular provides the Router class, which is available as a service through dependency
injection and whose most useful methods and properties are described in table 24.9.
Table 24.9. Selected Router methods and properties
Name 	Description
navigated 	This boolean property returns true if there has been at least one
navigation event and false otherwise.
url 	This property returns the active URL.
isActive(url,
exact)
This method returns true if the specified URL is the URL defined by the
active route. The exact argument specified whether all the segments in
the specified URL must match the current URL for the method t

---

## Edit

</button>
</td>
</tr>
</tbody>
</table>
<button class="btn btn-primary mt-1" routerLink="/form/create">
Create New Product
</button>
<button class="btn btn-danger mt-1 mx-1" (click)="deleteProduct(-1)">
Generate HTTP Error
</button>
Listing 24.22 shows the corresponding changes in the component, which remove the methods
that the event bindings invoked and remove the dependency on the service that was used to
signal when a product should be edited or created.
Listing 24.22. Removing event handling code in the table.component.ts file in the
src/app/core folder
import { Component, Signal } from "@angular/core";
import { Product } from "../model/product.model";
import { Model } from "../model/repository.model";
//import { MODES, SharedState } from "./sharedState.service";
@Component({
selector: "paTable",
templateUrl: "table.component.html"
})
export class TableComponent {
constructor(private model: Model) { }
getProduct(key: number): Product | undefined {
return this.model.getProduct(key);
}
get Products(): Signal<Product[]> {
return this.model.Products;
}
deleteProduct(key?: number) {
if (key != undefined) {
-- 709 of 848 --
699
this.model.deleteProduct(key);
}
}
// editProduct(key?: number) {
// 	this.state.update(MODES.EDIT, key)
// }
// createProduct() {
// 	this.state.update(MODES.CREATE);
// }
}
The service used for coordination by the components is no longer required, and listing 24.23
disables it from the core module.
Listing 24.23. Removing the shared state service in the core.module.ts file in the
src/app/core folder
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, NG_VALIDATORS, ReactiveFormsModule }
from "@angular/forms";
import { ModelModule } from "../model/model.module";
import { TableComponent } from "./table.component";
import { FormComponent } from "./form.component";
//import { SharedState } from "./sharedState.service";
import { ValidationHelper } from "./validationHelper.pipe";
import { ValidationErrorsDirective } from "./validationErrors.directive";
import { HiLowValidatorDirective } from "../validation/hilow";
import { RouterModule } from "@angular/router";
@NgModule({
imports: [BrowserModule, FormsModule, ModelModule,
ReactiveFormsModule, RouterModule],
declarations: [TableComponent, FormComponent, ValidationHelper,
ValidationErrorsDirective, HiLowValidatorDirective],
exports: [ModelModule, TableComponent, FormComponent],
//providers: [SharedState]
})
export class CoreModule { }
The result is that the coordination between the table and form components is handled entirely
through the routing system, which is now responsible for displaying the components and
managing the navigation between them.
24.4 	Summary
In this chapter, I introduced the Angular routing feature and demonstrated how to navigate to
a URL in an application to select the content that is displayed to the user. I showed you how
to create navigation links in templates, how to perform naviga

---

## This chapter

▪ 	Using wildcards to define routes that match multiple URLs
▪ 	Using redirections to map from one URL to another
▪ 	Performing navigation within a component
▪ 	Using CSS styles to reflect changes in routes
▪ 	Using child routes to define common route configurations
In the previous chapter, I introduced the Angular URL routing system and explained how it can
be used to control the components that are displayed to the user. The routing system has a
lot of features, which I continue to describe in this chapter and chapter 26. The emphasis in
this chapter is on creating more complex routes, including routes that will match any URL,
routes that redirect the browser to other URLs, routes that navigate within a component, and
routes that select multiple components. Table 25.1 summarizes the chapter.
Table 25.1. Chapter summary
Problem 	Solution 	Listing
Matching multiple URLs with a
single route
Use routing wildcards 	1–8
Redirecting one URL to
another
Use a redirection route 	9
Navigating within a component 	Use a relative URL 	10-11

---

## Using the routing system to

display nested components
Define child routes and use the router-outlet
element
15–20
25.1 	Preparing the example project
For this chapter, I will continue using the exampleApp project that was created in chapter 20
and has been modified in each subsequent chapter. To prepare for this chapter, I have added
two methods to the repository class, as shown in listing 25.1.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
Listing 25.1. Adding methods in the repository.model.ts file in the src/app/model folder
import { Injectable, Signal, computed, signal } from "@angular/core";
import { Product } from "./product.model";
import { RestDataSource } from "./rest.datasource";
@Injectable()
export class Model {
private products = signal<Product[]>([]);
private locator = (p: Product, id?: number) => p.id == id;
constructor(private dataSource: RestDataSource) {
this.dataSource.getData()
.subscribe(data => this.products.set(data));
}
get Products(): Signal<Product[]> {
return this.products;
}
getProduct(id: number): Product | undefined {
return this.products().find(p => this.locator(p, id));
}
getNextProductId(id?: number): number {
let nextId = 0;
let index = this.products().findIndex(p => this.locator(p, id));
if (index > -1) {
nextId = this.products()[this.products().length > index + 1
? index + 1 : 0].id ?? 0;
} else {
nextId = id || 0;
}
return nextId;
}
getPreviousProductid(id?: number): number {
let nextId = 0;
let index = this.products().findIndex(p => this.locator(p, id));
if (index > -1) {
-- 713 of 848 --
703
nextId = this.products()[index > 0
? index - 1 : this.products().length - 1].id ?? 0;
} else {
nextId = id || 0;
}
return nextId;
}
saveProduct(product: Product) {
if (product.id == 0 || product.id == undefined) {
this.dataSource.saveProduct(product)
.subscribe(p =>
this.products.mutate(prods => prods.push(p)));
} else {
this.dataSource.updateProduct(product).subscribe(() => {
this.products.mutate(prods => {
let index = prods.findIndex(p =>
this.locator(p, product.id));
prods.splice(index, 1, product);
});
})
}
}
deleteProduct(id: number) {
this.dataSource.deleteProduct(id).subscribe(() => {
this.products.mutate(prods => {
let index = prods.findIndex(p => this.locator(p, id));
if (index > -1) {
prods.splice(index, 1);
}
});
});
}
}
The new methods accept an ID value, locate the corresponding product, and then return the
IDs of the next and previous objects in the array that the repository uses to collect the data
model objects. I will use this feature later in the chapter to allow the user to page through the
set of objects in the data model.
To simplify the example, listing 25.2 removes the statements in the form component that
receive the details of the product to edit using optional route parameters.
Listing 25.2. Removing optional parameters in the form.componen

---

## Edit

</button>
</td>
</tr>
</tbody>
</table>
<button class="btn btn-primary mt-1" routerLink="/form/create">
Create New Product
</button>
<button class="btn btn-danger mt-1 mx-1" (click)="deleteProduct(-1)">
Generate HTTP Error
</button>
<button class="btn btn-danger m-1" routerLink="/does/not/exist">
Generate Routing Error
</button>
Clicking the button will ask the application to navigate to the URL /does/not/exist, for
which there is no route configured. When a URL doesn’t match a URL, an error is thrown, which
is then picked up and processed by the error handling class, which leads to a warning being
displayed by the message component, as shown in figure 25.2.
-- 719 of 848 --
709
Figure 25.2. The default navigation error
This isn’t a useful way to deal with an unknown route because the user won’t know what routes
are and may not realize that the application was trying to navigate to the problem URL.
A better approach is to use the wildcard route to handle navigation for URLs that have not
been defined and select a component that will present a more useful message to the user, as
illustrated in listing 25.8.
Listing 25.8. Adding a wildcard route in the app.routing.ts file in the src/app folder
import { Routes, RouterModule } from "@angular/router";
import { TableComponent } from "./core/table.component";
import { FormComponent } from "./core/form.component";
import { NotFoundComponent } from "./core/notFound.component";
const routes: Routes = [
{ path: "form/:mode/:id", component: FormComponent },
{ path: "form/:mode", component: FormComponent },
{ path: "", component: TableComponent },
{ path: "**", component: NotFoundComponent }]
export const routing = RouterModule.forRoot(routes, {
bindToComponentInputs: true
});
The new route in the listing uses the wildcard to select the NotFoundComponent, which
displays the message shown in figure 25.3 when the Generate Routing Error button is clicked.
-- 720 of 848 --
710
Figure 25.3. Using a wildcard route
Clicking the Start Over button navigates to the / URL, which will select the table component
for display.
25.2.2 	Using redirections in routes
Routes do not have to select components; they can also be used as aliases that redirect the
browser to a different URL. Redirections are defined using the redirectTo property in a
route, as shown in listing 25.9.
Listing 25.9. Using route redirection in the app.routing.ts file in the src/app folder
import { Routes, RouterModule } from "@angular/router";
import { TableComponent } from "./core/table.component";
import { FormComponent } from "./core/form.component";
import { NotFoundComponent } from "./core/notFound.component";
const routes: Routes = [
{ path: "form/:mode/:id", component: FormComponent },
{ path: "form/:mode", component: FormComponent },
{ path: "does", redirectTo: "/form/create", pathMatch: "prefix" },
{ path: "table", component: TableComponent },
{ path: "", redirectTo: "/table", pathMatch: "full" },
{ path: "**", component: NotFoundComponent }]
exp

---

## Next

</button>
</div>
<form [formGroup]="productForm" #form="ngForm"
(ngSubmit)="submitForm()" (reset)="resetForm()">
<!-- ...elements omitted for brevity... -->
</form>
These buttons have bindings for the routerLink directive with expressions that target the
previous and next objects in the data model, using the signals whose values are set using the
methods added to the repository at the start of the chapter. This means that if you click the
Edit button in the table for the lifejacket, for example, the Next button will navigate to the URL
that edits the soccer ball, and the Previous button will navigate to the URL for the kayak. (You
must always start from the table view, otherwise, there will be no data available to determine
the next or previous product).
25.3.1 	Responding to ongoing routing changes
Although the URL changes when the Previous or Next buttons are clicked, there is no change
in the data displayed to the user. Angular tries to be efficient during navigation, and it knows
that the URLs that the Previous and Next buttons navigate to are handled by the same
component that is currently displayed to the user. Rather than create a new instance of the
component, it simply processes the route and updates the value of the input properties.
The simplest way to reflect the navigation changes is to change the lifecycle method used
by the component to select the product to display, as shown in listing 25.11.
Listing 25.11. Changing lifecycle method in the form.component.ts file in the
src/app/core folder
...
//ngOnInit() {
ngOnChanges() {
-- 723 of 848 --
713
this.editing = this.mode == "edit";
if (this.id != null) {
let idVal = parseInt(this.id);
Object.assign(this.product,
this.model.getProduct(idVal) || new Product());
this.productForm.patchValue(this.product);
this.nextId.set(this.model.getNextProductId(idVal));
this.previousId.set(this.model.getPreviousProductid(idVal));
}
}
...
Using the ngOnChanges method ensures that changes in the route select a new product to be
displayed.
Figure 25.5. Responding to route changes
25.3.2 	Styling links for active routes
A common use for the routing system is to display multiple navigation elements alongside the
content that they select. To demonstrate, listing 25.12 adds a new route to the application
that will allow the table component to be targeted with a URL that contains a category filter.
Listing 25.12. Defining a route in the app.routing.ts file in the src/app folder
import { Routes, RouterModule } from "@angular/router";
import { TableComponent } from "./core/table.component";
import { FormComponent } from "./core/form.component";
import { NotFoundComponent } from "./core/notFound.component";
const routes: Routes = [
{ path: "form/:mode/:id", component: FormComponent },
{ path: "form/:mode", component: FormComponent },
{ path: "does", redirectTo: "/form/create", pathMatch: "prefix" },
{ path: "table/:category", component: TableComponent },
{ path: "table", component: TableComponent },
{ path: "",

---

## All

</button>
<button *ngFor="let category of Categories()"
class="btn btn-secondary"
[routerLink]="['/table', category]"
routerLinkActive="bg-primary">
{{category}}
</button>
</div>
</div>
<div class="col">
<table class="table table-sm table-bordered table-striped">
<thead>
<tr>
<th>ID</th><th>Name</th><th>Category</th>
<th>Price</th><th>Keywords</th><th></th>
</tr>
</thead>
<tbody>
<tr *ngFor="let item of Products()">
<td>{{item.id}}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td>{{item.price | currency:"USD" }}</td>
<td>{{ item.keywords?.join(", ")}}</td>
<td class="text-center">
<button class="btn btn-danger btn-sm m-1"
(click)="deleteProduct(item.id)">

---

## Edit

</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
<div class="p-2 text-center">
<button class="btn btn-primary mt-1" routerLink="/form/create">
Create New Product
</button>
<button class="btn btn-danger mt-1 mx-1" (click)="deleteProduct(-1)">
Generate HTTP Error
-- 726 of 848 --
716
</button>
<button class="btn btn-danger m-1" routerLink="/does/not/exist">
Generate Routing Error
</button>
</div>
The important part of this example is the use of the routerLinkActive attribute, which is
used to specify a CSS class that the element will be assigned to when the URL specified by the
routerLink attribute matches the active route.
The listing specifies a class called bg-primary, which changes the appearance of the
button and makes the selected category more obvious. When combined with the functionality
added to the component in listing 25.13, the result is a set of buttons allowing the user to view
products in a single category, as shown in figure 25.6.
Figure 25.6. Filtering products
If you click the Soccer button, the application will navigate to the /table/Soccer URL, and
the table will display only those products in the Soccer category. The Soccer button will also
be highlighted since the routerLinkActive attribute means that Angular will add the
button element to the Bootstrap bg-primary class.
25.3.3 	Fixing the All button
The navigation buttons reveal a common problem, which is that the All button is always added
to the active class, even when the user has filtered the table to show a specific category.
This happens because the routerLinkActive attribute performs partial matches on the
active URL by default. In the case of the example, the / URL will always cause the All button
to be activated because it is at the start of all URLs. This problem can be fixed by configuring
the routerLinkActive directive, as shown in listing 25.15.
-- 727 of 848 --
717
Listing 25.15. Configuring the directive in the table.component.html file in the
src/app/core folder
...
<div class="d-grid gap-2">
<button class="btn btn-secondary"
routerLink="/table" routerLinkActive="bg-primary"
[routerLinkActiveOptions]="{exact: true}">

---

## All

</button>
<button *ngFor="let category of Categories()"
class="btn btn-secondary"
[routerLink]="['/table', category]"
routerLinkActive="bg-primary">
{{category}}
</button>
</div>
...
The configuration is performed using a binding on the routerLinkActiveOptions attribute,
which accepts a literal object. The exact property is the only available configuration setting
and is used to control matching the active route URL. Setting this property to true will add
the element to the class specified by the routerLinkActive attribute only when there is an
exact match with the active route’s URL, which is changed to /table. With this change, the
All button will be highlighted only when all of the products are shown, as illustrated by figure
25.7.
Figure 25.7. Fixing the All button problem
25.4 	Creating child routes
Child routes allow components to respond to part of the URL by embedding router-outlet
elements in their templates, creating more complex arrangements of content. I am going to
use the simple components I created at the start of the chapter to demonstrate how child
-- 728 of 848 --
718
routes work. These components will be displayed above the product table, and the component
that is shown will be specified in the URLs shown in table 25.3.
Table 25.3. The URLs and the components they will select
URL 	Component
/table/products 	The ProductCountComponent will be displayed.
/table/categories 	The CategoryCountComponent will be displayed.
/table 	Neither component will be displayed.
Listing 25.16 shows the changes to the application’s routing configuration to implement the
routing strategy in the table.
Listing 25.16. Configuring routes in the app.routing.ts file in the src/app folder
import { Routes, RouterModule } from "@angular/router";
import { TableComponent } from "./core/table.component";
import { FormComponent } from "./core/form.component";
import { NotFoundComponent } from "./core/notFound.component";
import { ProductCountComponent } from "./core/productCount.component";
import { CategoryCountComponent } from "./core/categoryCount.component";
const routes: Routes = [
{ path: "form/:mode/:id", component: FormComponent },
{ path: "form/:mode", component: FormComponent },
{ path: "does", redirectTo: "/form/create", pathMatch: "prefix" },
{
path: "table",
component: TableComponent,
children: [
{ path: "products", component: ProductCountComponent },
{ path: "categories", component: CategoryCountComponent }
]
},
{ path: "table/:category", component: TableComponent },
{ path: "table", component: TableComponent },
{ path: "", redirectTo: "/table", pathMatch: "full" },
{ path: "**", component: NotFoundComponent }]
export const routing = RouterModule.forRoot(routes, {
bindToComponentInputs: true
});
Child routes are defined using the children property, which is set to an array of routes
defined in the same way as the top-level routes. When Angular uses the entire URL to match
a route that has children, there will be a match only if the URL to which th

---

## All

</button>
<button *ngFor="let category of Categories()"
class="btn btn-secondary"
[routerLink]="['/table', category]"
routerLinkActive="bg-primary">
{{category}}
</button>
</div>
</div>
<div class="col">
<button class="btn btn-info mx-1"
routerLink="/table/products">
Count Products
</button>
<button class="btn btn-primary mx-1"
routerLink="/table/categories">
Count Categories
</button>
<button class="btn btn-secondary mx-1" routerLink="/table">
Count Neither
</button>
<div class="my-2">
<router-outlet></router-outlet>
</div>
<table class="table table-sm table-bordered table-striped">
-- 730 of 848 --
720
<thead>
<tr>
<th>ID</th><th>Name</th><th>Category</th>
<th>Price</th><th>Keywords</th><th></th>
</tr>
</thead>
<tbody>
<tr *ngFor="let item of Products()">
<td>{{item.id}}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td>{{item.price | currency:"USD" }}</td>
<td>{{ item.keywords?.join(", ")}}</td>
<td class="text-center">
<button class="btn btn-danger btn-sm m-1"
(click)="deleteProduct(item.id)">

---

## Edit

</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
<div class="p-2 text-center">
<button class="btn btn-primary mt-1" routerLink="/form/create">
Create New Product
</button>
<button class="btn btn-danger mt-1 mx-1" (click)="deleteProduct(-1)">
Generate HTTP Error
</button>
<button class="btn btn-danger m-1" routerLink="/does/not/exist">
Generate Routing Error
</button>
</div>
The button elements have routerLink attributes that specify the URLs listed in table 25.4,
and there is also a router-outlet element, which will be used to display the selected
component, as shown in figure 25.8, or no component if the browser navigates to the /table
URL.
-- 731 of 848 --
721
Figure 25.8. Using child routes
25.4.2 	Accessing parameters from child routes
Child routes can use all the features available to the top-level routes, including defining route
parameters and even having their own child routes. For this section, I am going to add support
for the URLs described in table 25.4.
Table 25.4. The New URLs supported by the example application
Name 	Description
/table/:category/products 	This route will filter the contents of the table and select the
ProductCountComponent.
/table/:category/categories 	This route will filter the contents of the table and select the
CategoryCountComponent.
Listing 25.18 defines the routes that support the URLs shown in the table.
Listing 25.18. Adding routes in the app.routing.ts file in the src/app folder
import { Routes, RouterModule } from "@angular/router";
import { TableComponent } from "./core/table.component";
import { FormComponent } from "./core/form.component";
import { NotFoundComponent } from "./core/notFound.component";
import { ProductCountComponent } from "./core/productCount.component";
import { CategoryCountComponent } from "./core/categoryCount.component";
const childRoutes: Routes = [
{ path: "products", component: ProductCountComponent },
{ path: "categories", component: CategoryCountComponent },
{ path: "", component: ProductCountComponent }
];
const routes: Routes = [
{ path: "form/:mode/:id", component: FormComponent },
-- 732 of 848 --
722
{ path: "form/:mode", component: FormComponent },
{ path: "does", redirectTo: "/form/create", pathMatch: "prefix" },
// {
// 	path: "table",
// 	component: TableComponent,
// 	children: [
// 	{ path: "products", component: ProductCountComponent },
// 	{ path: "categories", component: CategoryCountComponent }
// 	]
// },
// { path: "table/:category", component: TableComponent },
// { path: "table", component: TableComponent },
{ path: "table", component: TableComponent, children: childRoutes },
{ path: "table/:category", component: TableComponent,
children: childRoutes },
{ path: "", redirectTo: "/table", pathMatch: "full" },
{ path: "**", component: NotFoundComponent }]
export const routing = RouterModule.forRoot(routes, {
bindToComponentInputs: true
});
The type of the children property is a Routes object, which makes it easy to minimize
duplication in the rou

---

## This chapter covers

▪ 	Using resolvers and route guards to control route activation
▪ 	Displaying placeholder content to the user until data is loaded
In this chapter, I continue to describe the Angular URL routing system, focusing on the most
advanced features. I explain how to control route activation, how to load feature modules
dynamically, and how to use multiple outlet elements in a template. Table 26.1 summarizes
the chapter.
Table 26.1. Chapter summary
Problem 	Solution 	Listing

---

## Preventing the user from

navigating away from the
current content
Use a deactivation guard 	14–17
26.1 	Preparing the example project
For this chapter, I will continue using the exampleApp project that was created in chapter 20
and has been modified in each subsequent chapter. No changes are required for this chapter.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
-- 736 of 848 --
726
Open a new command prompt, navigate to the exampleApp folder, and run the following
command to start the server that provides the RESTful web server:
npm run json
Open a separate command prompt, navigate to the exampleApp folder, and run the following
command to start the Angular development tools:
ng serve
Open a new browser window and navigate to http://localhost:4200 to see the content shown
in figure 26.1.
Figure 26.1. Running the example application
26.2 	Guarding routes
At the moment, the user can navigate anywhere in the application at any time. This isn’t always
a good idea, either because some parts of the application may not always be ready or because
some parts of the application are restricted until specific actions are performed. To control the
use of navigation, Angular supports guards, which are specified as part of the route
configuration using the properties defined by the Routes class, the most useful of which are
described in table 26.2.
-- 737 of 848 --
727
Table 26.2. Useful routes properties for guards
Name 	Description
resolve 	This property is used to specify guards that will delay route activation until
some operation has been completed, such as loading data from a server.
canActivate 	This property is used to specify the guards that will be used to determine
whether a route can be activated.
canActivateChild 	This property is used to specify the guards that will be used to determine
whether a child route can be activated.
canDeactivate 	This property is used to specify the guards that will be used to determine
whether a route can be deactivated.
26.2.1 	Delaying navigation with a resolver
A common reason for guarding routes is to ensure that the application has received the data
that it requires before a route is activated. The example application loads data from the RESTful
web service asynchronously, which means there can be a delay between the moment at which
the browser is asked to send the HTTP request and the moment at which the response is
received and the data is processed. You may not have noticed this delay as you followed the
examples because the browser and the web service are running on the same machine. In a
deployed application, there is a much greater prospect of there being a delay, caused by
network congestion, a high server load, or a dozen other factors.
To simulate network congestion, listing 26.1 modifies the RESTful data source class to
introduce a delay after 

---

## Guards 	for 	route 	activation 	are 	functions 	that 	receive 	the 	same

ActivatedRouteSnapshot 	and 	RouterStateSnapshot 	arguments 	as 	resolvers.
Resolvers can also be defined as classes that define a canActivate method can be
implemented to return three different result types, as described in table 26.4.
Table 26.4. The result types allowed by the canActivate method
Result Type 	Description
boolean 	This type of result is useful when performing synchronous checks to see
whether the route can be activated. A true result will activate the route,
and a result of false will not, effectively ignoring the navigation request.
Observable<boolean> 	This type of result is useful when performing asynchronous checks to
see whether the route can be activated. Angular will wait until the
Observable emits a value, which will be used to determine whether
the route is activated. When using this kind of result, it is important to
terminate the Observable by calling the complete method;
otherwise, Angular will just keep waiting.
Promise<boolean> 	This type of result is useful when performing asynchronous checks to
see whether the route can be activated. Angular will wait until the
-- 747 of 848 --
737
Promise is resolved and activate the route if it yields true. If the
Promise yields false, then the route will not be activated, effectively
ignoring the navigation request.
To get started, I added a file called terms.guard.ts to the src/app folder and defined the
class shown in listing 26.9.
NOTE Input properties cannot be used to receive routing parameters in route guards. Route
data can only be accessed using the ActivatedRouteSnapshot object.
Listing 26.9. The contents of the terms.guard.ts file in the src/app folder
import { Injectable } from "@angular/core";
import {
ActivatedRouteSnapshot, RouterStateSnapshot, Router
} from "@angular/router";
import { MessageService } from "./messages/message.service";
import { Message } from "./messages/message.model";
@Injectable()
export class TermsGuard {
constructor(private messages: MessageService,
private router: Router) { }
canActivate(route: ActivatedRouteSnapshot,
state: RouterStateSnapshot): Promise<boolean> | boolean {
if (route.params["mode"] == "create") {
return new Promise<boolean>(resolve => {
let responses: [string, () => void][]
= [["Yes", () => resolve(true)],
["No", 	() => resolve(false)]];
this.messages.reportMessage(
new Message("Do you accept the terms & conditions?",
false, responses));
});
} else {
return true;
}
}
}
The canActivate method can return two different types of results. The first type is a
boolean, which allows the guard to respond immediately for routes that it doesn’t need to
protect, which in this case is any that lacks a parameter called mode whose value is create.
If the URL matched by the route doesn’t contain this parameter, the canActivate method
returns true, which tells Angular to activate the route. This is important because the edit and
create features both rely on the same routes, and the guard should not interfere with edit
operations.
The othe

---

## This chapter covers

▪ 	Reducing the size of the application using dynamically loaded modules
▪ 	Using server-side rendering to create an HTML representation of the application
▪ 	Using rehydration to transition from server-rendered HTML to browser-generated
content
▪ 	Prerendering the application to create a static HTML representation of the application
Complex Angular applications can require large JavaScript files, which can take a long time to
download over a slow network connection. In this chapter, I describe the features Angular
provides for optimizing application delivery to minimize the amount of time before the user
can interact with the application.
Table 27.1. Putting optimized application delivery in context
Question 	Answer
What is it? 	Optimization reduces the amount of time that the user sees an empty
browser window while the application loads.
Why is it useful? 	Slow startup frustrates users and undermines SEO efforts.
How is it used? 	There are several related features. Dynamically loaded modules
exclude code from the initial download and only load it when it is
needed. Server-side rendering executes the application at the server
so the user sees an HTML representation of the application while the
browser loads the JavaScript files. Prerendering creates a static
HTML version of the application.
-- 759 of 848 --
749

---

## Are there any pitfalls or

limitations?
These features must be applied carefully. Not all application features
are suitable for dynamic modules and not all Angular features are
supported by server-side rendering and prerendering.
Are there any alternatives? 	There are third-party packages that provide similar features but they
are not as well integrated as the Angular features.
Table 27.2 summarizes the chapter.
Table 27.2. Chapter summary
Problem 	Solution 	Listing

---

## Minimize the amount of time

the user sees an empty
browser window
Use server-side rendering to execute the application
on the server and generate HTML documents the
browser can display
11-24
Create an HTML
representation without
requiring server resources
Prerender the application 	25-28
27.1 	Preparing the example project
For this chapter, I will continue using the exampleApp project that was created in chapter 20
and has been modified in each subsequent chapter. To prepare for this chapter, listing 27.1
disables the delay applied to loading data from the RESTful web service.
Listing 27.1. Disabling the delay in the rest.datasource.ts file in the src/app/model folder
import { Injectable, Signal } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Product } from "./product.model";
import { Observable, catchError, delay } from "rxjs";
export const REST_URL = `http://${location.hostname}:3500/products`;
@Injectable()
export class RestDataSource {
constructor(private http: HttpClient) { }
getData(): Observable<Product[]> {
return this.sendRequest<Product[]>("GET", REST_URL);
//.pipe(delay(5000));
}
// ...other methods omitted for brevity...
}
-- 760 of 848 --
750
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
Open a new command prompt, navigate to the exampleApp folder, and run the following
command to start the server that provides the RESTful web server:
npm run json
Open a separate command prompt, navigate to the exampleApp folder, and run the following
command to start the Angular development tools:
ng serve
Open a new browser window and navigate to http://localhost:4200 to see the content shown
in figure 27.1.
Figure 27.1. Running the example application
27.2 	Understanding the delivery problem
It can take time for a browser to load and execute the JavaScript files required for an
application, even when non-essential modules are loaded dynamically. Not all clients can rely
-- 761 of 848 --
751
on the fast networks that are common in development environments, and clients with slow
networks will end up looking at an empty browser window until the application loads.
Most modern browsers include a simulator for bandwidth throttling so you can get a sense
of how long it will take a client to load an application over a slow connection. For Chrome, this
feature is on the Network tab of the F12 developer tools, and I selected the Fast 3G present,
as shown in figure 27.2.
Figure 27.2. Applying rate limiting to test rehydration
Hold down the browser’s reload button with the F12 developer tools window open to select the
“Empty cache and hard reload” option, as shown in figure 27.3, which will ensure the browser
loads all of the JavaScript files from the server, even if they were previously cached.
Figure 27.3. Reloading the application
-- 762 of 848 --
752
T

---

## This is the ondemand component

</div>
<button class="btn btn-primary m-2" routerLink="/">Back</button>
The template contains a message that will make it obvious when the component is selected
and that contains a button element that will navigate back to the application’s root URL when
clicked.
To define the module, I added a file called ondemand.module.ts and added the code
shown in listing 27.4.
Listing 27.4. The contents of the ondemand.module.ts file in the src/app/ondemand
folder
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OndemandComponent } from "./ondemand.component";
@NgModule({
imports: [CommonModule],
declarations: [OndemandComponent],
exports: [OndemandComponent]
})
export class OndemandModule { }
The module imports the CommonModule functionality, which is used instead of the browser-
specific BrowserModule to access the built-in directives in feature modules that are loaded
on demand.
27.3.2 	Loading the module dynamically
There are two steps to set up dynamically loading a module. The first is to set up a routing
configuration inside the feature module to provide the rules that will allow Angular to select a
component when the module is loaded. Listing 27.5 adds a single route to the feature module.
Listing 27.5. Defining routes in the ondemand.module.ts file in the src/app/ondemand
folder
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OndemandComponent } from "./ondemand.component";
import { RouterModule } from "@angular/router";
let routing = RouterModule.forChild([
{ path: "", component: OndemandComponent }
]);
@NgModule({
imports: [CommonModule, routing],
-- 764 of 848 --
754
declarations: [OndemandComponent],
exports: [OndemandComponent]
})
export class OndemandModule { }
Routes in dynamically loaded modules are defined using the same properties as in the main
part of the application and can use all the same features, including child components, guards,
and redirections. The route defined in the listing matches the empty path and selects the
OndemandComponent for display.
One important difference is the method used to generate the module that contains the
routing information, as follows:
...
let routing = RouterModule.forChild([
{ path: "", component: OndemandComponent }
]);
...
When 	I 	created 	the 	application-wide 	routing 	configuration, 	I 	used 	the
RouterModule.forRoot method. This is the method that is used to set up the routes in the
root 	module 	of 	the 	application. 	When 	creating 	dynamically 	loaded 	modules, 	the
RouterModule.forChild method must be used; this method creates a routing configuration
that is merged into the overall routing system when the module is loaded.
CREATING A ROUTE TO DYNAMICALLY LOAD A MODULE
The second step to set up a dynamically loaded module is to create a route in the main part of
the application that provides Angular with the module’s location, as shown in listing 27.6.
Listing 27.6. Creating an on-demand ro

---

## All

</a>
<a *ngFor="let category of Categories()"
class="btn btn-secondary"
[routerLink]="['/table', category]"
routerLinkActive="bg-primary">
{{category}}
</a>
</div>
</div>
<div class="col">
<a class="btn btn-info mx-1" routerLink="products">
Count Products
</a>
<a class="btn btn-primary mx-1" routerLink="categories">
Count Categories
</a>
<div class="my-2">
<router-outlet></router-outlet>
</div>
<table class="table table-sm table-bordered table-striped">
<thead>
<tr>
<th>ID</th><th>Name</th><th>Category</th>
-- 779 of 848 --
769
<th>Price</th><th>Keywords</th><th></th>
</tr>
</thead>
<tbody>
<tr *ngFor="let item of Products()">
<td>{{item.id}}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td>{{item.price | currency:"USD" }}</td>
<td>{{ item.keywords?.join(", ")}}</td>
<td class="text-center">
<button class="btn btn-danger btn-sm m-1"
(click)="deleteProduct(item.id)"
[disabled]="isServer">

---

## Edit

</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
<div class="p-2 text-center">
<button class="btn btn-primary mt-1" routerLink="/form/create"
[disabled]="isServer">
Create New Product
</button>
<ng-container *ngIf="!isServer">
<button class="btn btn-danger mt-1 mx-1"
(click)="deleteProduct(-1)">
Generate HTTP Error
</button>
<button class="btn btn-danger m-1" routerLink="/does/not/exist">
Generate Routing Error
</button>
<button class="btn btn-danger" routerLink="/ondemand">
Load Module
</button>
</ng-container>
</div>
I have changed the button elements that select categories to anchor elements, which means
they will work in the SSR version of the application. For other button elements, I have used
data bindings to set the disabled attribute, which means that the buttons will do nothing
initially, but will become active once the browser starts executing the application. I have also
introduced an ng-container element to prevent some elements from being displayed by the
SSR version of the application, just for variety.
-- 780 of 848 --
770
27.4.5 	Modifying the terms guard
One of the features enabled in the SSR version of the application is the ability to display the
number of categories, which is a navigation change protected by a guard that prompts the
user and waits for confirmation. This type of guard doesn’t work with SSR because the user
never gets to see the prompt and doesn’t have the chance to respond. Listing 27.21 modifies
the guard to always allow navigation when the application is being executed on the server.
Listing 27.21. Allowing navigation in the terms.guard.ts file in the src/app folder
import { Injectable } from "@angular/core";
import {
ActivatedRouteSnapshot, RouterStateSnapshot, Router
} from "@angular/router";
import { MessageService } from "./messages/message.service";
import { Message } from "./messages/message.model";
import { PlatformService } from "./platform.service";
@Injectable()
export class TermsGuard {
constructor(private messages: MessageService,
private router: Router,
private ps: PlatformService) { }
canActivate(route: ActivatedRouteSnapshot,
state: RouterStateSnapshot): Promise<boolean> | boolean {
if (route.params["mode"] == "create") {
return new Promise<boolean>(resolve => {
let responses: [string, () => void][]
= [["Yes", () => resolve(true)],
["No", 	() => resolve(false)]];
this.messages.reportMessage(
new Message("Do you accept the terms & conditions?",
false, responses));
});
} else {
return true;
}
}
canActivateChild(route: ActivatedRouteSnapshot,
state: RouterStateSnapshot): Promise<boolean> | boolean {
if ((!this.ps.isServer) && route.url.length > 0
&& route.url[route.url.length - 1].path == "categories") {
return new Promise<boolean>((resolve, reject) => {
let responses: [string, (arg: string) => void][] = [
["Yes", () => resolve(true)],
["No ", () => resolve(false)]
];
-- 781 of 848 --
771
this.messages.reportMessage(
new Message("Do you want to see the categories?",
false, responses));

---

## This chapter covers

▪ 	Installing and using the Angular Material component library
▪ 	Selecting component library features to use
▪ 	Integrating component library features with existing functionality
Component libraries are packages that contain Angular components and directives, such as
buttons, tables, and layouts. Throughout this book, I have been creating custom components
and directives to demonstrate Angular features, but component libraries use these same
features to provide building blocks that you can use to simplify the development process.
One of the recurring themes in this book is that nothing in Angular is magic, and this
extends to component libraries, which are written using the same features that you used in
earlier chapters. Component libraries are useful because they mean you don’t have to write
code and templates for basic tasks, such as creating a button, for example, and can focus on
dealing with what happens when the user clicks the button.
In this chapter, I use the Angular Material component library to add components to the
project and explain how to use CSS to give a custom component an appearance that is
consistent with the library components. Table 28.1 puts the use of component libraries in
context.
NOTE This chapter is not a detailed description of Angular Material or any other component
library. There are several good component libraries available for Angular and each has its
own set of features and API.
Table 28.1. Putting component libraries in context
Question 	Answer
-- 791 of 848 --
781
What are they? 	Component libraries are packages containing commonly required
user interface features for Angular applications.
Why are they useful? 	Component libraries can speed up project development and ensure a
consistent appearance in the finished application.
How are they used? 	Features are presented as Angular components or directives, which
are applied in the same way as custom components and directives.

---

## Component libraries can require data to be presented in a specific

way or for the application to be structured using a specific pattern.
These restrictions may not suit all projects.
Are there any alternatives? 	Component libraries are entirely optional and are not required for
Angular development.
Table 28.2 summarizes the chapter.
Table 28.2. Chapter summary
Problem 	Solution 	Listing

---

## Styling custom components to match

the theme used by the component
library
Use the CSS styles provided by the
component library, which are typically
provided for use with Sass
15–23
28.1 	Preparing for this chapter
In this chapter, I continue using the exampleApp project that was first created in chapter 20
and has been the focus of every chapter since.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
To prepare for this chapter, open a new command prompt, navigate to the exampleApp folder,
and run the command shown in listing 28.1 in the exampleApp folder to download and install
the Angular Material package:
Listing 28.1. Installing the package
ng add @angular/material@^16
-- 792 of 848 --
782
The Angular Material package uses the schematics API to configure the project. Press Y to
confirm the installation. Select the default option for the questions asked by the installer, which
will complete the installation and list the files that have been updated:
...
UPDATE package.json (1664 bytes)
UPDATE angular.json (5361 bytes)
UPDATE src/index.html (585 bytes)
UPDATE src/styles.css (181 bytes)
...

---

## Choosing a component library

I have used Angular Material because it is the most popular Angular component library.
There 	are 	several 	other 	packages 	available. 	Teradata 	Covalent
(https://teradata.github.io/covalent) is an open-source library that follows the same
Material Design standard as Angular Material, but with the addition of good charting
components. Some packages present the features of the Bootstrap CSS package using
Angular features, such as ng-bootstrap (https://ng-bootstrap.github.io) and ngx-bootstrap
(https://valor-software.com/ngx-bootstrap
), and each provides a different approach to developing components. There are also
commercial packages, such as Kendo UI (https://www.telerik.com/kendo-angular-ui),
which can be useful for development teams that require support.
If you don’t know where to start, then try Angular Material. The documentation
(https://material.angular.io) is good, and the package contains the components required
by most projects.
28.1.1 	Removing buttons
Listing 28.2 replaces the contents of the template for the table component, removing features
that are not required for this chapter.
Listing 28.2. The contents of the table.component.html file in the src/app/core folder
<table class="table table-sm table-bordered table-striped">
<thead>
<tr>
<th>ID</th><th>Name</th><th>Category</th>
<th>Price</th><th>Keywords</th><th></th>
</tr>
</thead>
<tbody>
<tr *ngFor="let item of Products()">
<td>{{item.id}}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td>{{item.price | currency:"USD" }}</td>
<td>{{ item.keywords?.join(", ")}}</td>
-- 793 of 848 --
783
<td class="text-center">
<button class="btn btn-danger btn-sm m-1"
(click)="deleteProduct(item.id)"
[disabled]="isServer">

---

## Edit

</button>
</td>
</tr>
</tbody>
</table>
<div class="p-2 text-center">
<button class="btn btn-primary mt-1" routerLink="/form/create"
[disabled]="isServer">
Create New Product
</button>
</div>
28.1.2 	Adjusting the HTML file
Installing the Angular Material package requires a change to the index.html file to resolve
a conflict with the Bootstrap CSS styles that causes a scrollbar to be displayed even when the
content fits within the browser window, caused by styles added to the styles.css file. Listing
28.3 changes the class to which the body element is assigned to resolve the issue.
Listing 28.3. Changing an element class in the index.html file in the src folder
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>ExampleApp</title>
<base href="/">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="icon" type="image/x-icon" href="favicon.ico">
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Roboto
:wght@300;400;500&display=swap"
rel="stylesheet">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons"
rel="stylesheet">
</head>
<body class="p-1">
<app-root></app-root>
</body>
</html>
28.1.3 	Running the project
Open a new command prompt, navigate to the exampleApp folder, and run the following
command to start the server that provides the RESTful web server:
-- 794 of 848 --
784
npm run json
Open a separate command prompt, navigate to the exampleApp folder, and run the following
command to start the Angular development tools:
ng serve
Open a new browser window and navigate to http://localhost:4200 to see the content shown
in figure 28.1.
Figure 28.1. Running the example application
28.2 	Using the library components
The simplest approach to using a component library is, as you might expect, to use the
components it provides. In this section, I demonstrate how to integrate two features from the
Angular Material library into the example project.
28.2.1 	Using the Angular Material button directive
The Angular Material support for buttons is provided as a directive applied to button or anchor
elements, as shown in listing 28.4.
-- 795 of 848 --
785
Listing 28.4. Using the Angular Material button in the table.component.html File in the
src/app/core folder
<table class="table table-sm table-bordered table-striped">
<thead>
<tr>
<th>ID</th><th>Name</th><th>Category</th>
<th>Price</th><th>Keywords</th><th></th>
</tr>
</thead>
<tbody>
<tr *ngFor="let item of Products()">
<td>{{item.id}}</td>
<td>{{item.name}}</td>
<td>{{item.category}}</td>
<td>{{item.price | currency:"USD" }}</td>
<td>{{ item.keywords?.join(", ")}}</td>
<td class="text-center">
<button mat-flat-button color="accent"
(click)="deleteProduct(item.id)"
[disabled]="isServer">

---

## Edit

</button>
</td>
</tr>
</tbody>
</table>
<div class="p-2 text-center">
<button mat-flat-button color="primary" routerLink="/form/create"
[disabled]="isServer">
Create New Product
</button>
</div>
Angular Material provides several different styles of button, which are applied using the
attributes described in table 28.3.
Table 28.3. The Angular Material button attributes
Name 	Description
mat-button 	This attribute creates a simple borderless button, whose text is styled
using an Angular Material theme color.
mat-stroked-button 	This attribute adds a rectangular border to the mat-button style.
mat-raised-button 	This attribute creates a button that appears to be raised from the page,
displayed with a small amount of shadow. The button background is
styled using an Angular Material theme color.
-- 796 of 848 --
786
mat-flat-button 	This attribute creates a button without the raised shadow and whose
background is styled using an Angular Material theme color.
mat-icon-button 	This attribute creates a button with a transparent background, intended to
display an icon, which is styled using an Angular Material theme color.
mat-fab 	This attribute creates a circular button with a shadow, whose background
is styled using an Angular Material theme color.
mat-mini-fab 	This button creates a small circular button with a shadow and a
background styled using an Angular Material theme color.
Angular Material uses a color theme that is selected when the package is installed and which
defines three color names, as described in table 28.4.
Table 28.4. The Angular Material color names
Name 	Description
primary 	This name refers to the color used most often throughout the application.
accent 	This name refers to the color used to highlight key parts of the user interface.
warn 	This name refers to the color used for warnings and errors or to denote
operations that require caution.
In listing 28.4, I applied the mat-flat-button attribute, which will create a button whose
appearance most closely matches the buttons I created using the Bootstrap styles. The theme
color is specified using the color attribute, like this:
...
<button mat-flat-button color="accent" (click)="deleteProduct(item.id)"
[disabled]="isServer">
...
The Angular Material button is applied to a regular HTML button element, which means that
the click event is used to respond to user interaction.
ADDING THE MARGIN STYLE
Angular Material doesn’t include utility styles for adding margins or padding to elements.
Listing 28.5 defines a new global style that adds space around flat buttons.
CAUTION You may be tempted to mix and match styles from different packages, such as
applying the Bootstrap m-1 style to button elements to which the mat-flat-button
attribute has been added. Care must be taken because package styles are rarely written
with this kind of combination in mind and there can be odd interactions.
Listing 28.5. Adding Styles in the styles.css File in the src Folder
html, body { height: 100%; }
bod

---

## Edit

</button>
</ng-container>
<tr mat-header-row *matHeaderRowDef="colsAndRows"></tr>
<tr mat-row *matRowDef="let row; columns: colsAndRows"></tr>
</table>
<div class="p-2 text-center">
<button mat-flat-button color="primary" routerLink="/form/create"
[disabled]="isServer">
Create New Product
</button>
</div>
Angular Material tables are created by applying the mat-table attribute to a table element
and creating a dataSource data binding that selects an array of values to display.
-- 800 of 848 --
790
Angular Material focuses on defining columns to describe the contents of a table. A mat-
text-column element is used for simple columns, where the column header is the name of
the data property and the value is displayed without modification, like this:
...
<mat-text-column name="id"></mat-text-column>
...
The name attribute selects the property to be displayed and sets the name by which the column
is identified. For more complex columns, the matColumnDef attribute is applied to an ng-
container element that contains th and td elements that are included in the table head and
body, respectively:
...
<ng-container matColumnDef="price">
<th mat-header-cell *matHeaderCellDef>Price</th>
<td mat-cell *matCellDef="let item"> {{item.price | currency:"USD"}}
</td>
</ng-container>
...
The th element is given the mat-header-cell attribute, and the concise syntax is used to
apply the matHeaderCellDef directive. The td element is given the mat-cell attribute,
and the matCellDef directive is used to create an expression that selects the data used to
create the contents of a table cell. There is an implicit value that provides the current data
value, and, for the price column, this is formatted as a currency value using a pipe. This
approach allows data values to be formatted or composed from multiple data source properties.
If you jump directly to using a component library without taking the time to understand
how Angular works, the steps required to set up complex features can be impenetrable. But
the knowledge you gained in earlier chapters helps reveal how the Angular Material table
works, using features such as the concise directive syntax and implicit values to map the data
in the data source to the content in the column descriptions.
The next step is to define the templates for the header and body rows, like this:
...
<tr mat-header-row *matHeaderRowDef="colsAndRows"></tr>
<tr mat-row *matRowDef="let row; columns: colsAndRows"></tr>
...
Columns are not shown unless they are configured with a row template, which is an array
containing the names assigned to the columns. Listing 28.9 adds a property to the component
class to select all of the columns defined in listing 28.8.
Listing 28.9. Selecting columns in the table.component.ts file in the src/app/core folder
import { Component, Input, Signal, computed } from "@angular/core";
import { Product } from "../model/product.model";
import { Model } from "../model/repository.model";
import { PlatformService } from "../

---

## Edit

</button>
</ng-container>
<tr mat-header-row *matHeaderRowDef="colsAndRows"></tr>
<tr mat-row *matRowDef="let row; columns: colsAndRows"></tr>
</table>
<mat-paginator [pageSize]="5" [pageSizeOptions]="[3, 5, 10]">
</mat-paginator>
<div class="p-2 text-center">
<button mat-flat-button color="primary" routerLink="/form/create"
[disabled]="isServer">
Create New Product
</button>
</div>
The matSort attribute is applied to the table element, and the mat-sort-header attribute
is added to headers that will allow the user to sort data. The mat-paginator component
displays pagination controls for the table data.
The final step is to create a data source that supports sorting and pagination and that is
populated with data through the observable exposed by the repository, as shown in listing
28.14.
Listing 28.14. Creating a data source in the table.component.ts file in the src/app/core
folder
import { Component, Input, Signal, ViewChild, computed, effect }
from "@angular/core";
import { Product } from "../model/product.model";
import { Model } from "../model/repository.model";
import { PlatformService } from "../platform.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
@Component({
selector: "paTable",
templateUrl: "table.component.html"
})
export class TableComponent {
constructor(private model: Model, private ps: PlatformService) {
this.DataSource = new MatTableDataSource<Product>();
effect(() => {
this.DataSource.data = this.model.Products()
})
}
DataSource: MatTableDataSource<Product>;
-- 805 of 848 --
795
@Input()
category?: string
// getProduct(key: number): Product | undefined {
// 	return this.model.getProduct(key);
// }
// get Products(): Signal<Product[]> {
// 	return computed(() => {
// 	return this.model.Products().filter(p =>
// 	this.category == null || p.category == this.category);
// 	});
// }
// get Categories(): Signal<string[]> {
// 	return computed(() => {
// 	return this.model.Products()
// 	.map(p => p.category)
// 	.filter((c, index, arr) => c != undefined
// 	&& arr.indexOf(c) == index) as string[];
// 	})
// }
deleteProduct(key?: number) {
if (key != undefined) {
this.model.deleteProduct(key);
}
}
get isServer() { return this.ps.isServer }
colsAndRows: string[] = ['id', 'name', 'category', 'price', 'buttons'];
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort;
ngAfterViewInit() {
this.DataSource.paginator = this.paginator;
this.DataSource.sort = this.sort;
}
}
The MatTableDataSource<Product> object represents a data source for Product objects,
and its data property is used to update the data the table displays. The paginator and sort
properties are used to associate the MatPaginator component and MatSort directive with
the data source, which I do in the ngAfterViewInit method, to ensure that the child content
is queried and assigned to the ViewChild properties. The r

---

## Figuring out theme details

An investment of time is required to figure out how to apply the Angular Material themes
to custom components, so do not rush into this process expecting it to be quick and easy.
To figure out how to create the styles I needed for the button component, I relied on the
Angular Material theme documentation (https://material.angular.io/guide/theming-your-
components) 	and 	the 	Material 	Design 	theme 	description
(https://material.io/design/material-theming/overview.html), both of which contain useful
guidance. But I spent most of the time reading through the SCSS files in the Angular
Material package (https://github.com/angular/components) to figure out the purpose of
different functions and to understand how the styles for the built-in components are
generated. It was also helpful to use the browser F12 developer tools to see how HTML
elements are styled.
-- 810 of 848 --
800
But don’t be put off. Once you have worked your way through the process for one
component, you will have learned enough to make subsequent components much simpler.
Listing 28.19. The customButton.component.scss file in the src/app/core folder
@use "@angular/material" as material;
$primary: material.define-palette(material.$indigo-palette);
$accent: material.define-palette(material.$pink-palette, A200, A100, A400);
$warn: material.define-palette(material.$red-palette);
$typography: material.define-typography-config();
button[class*="custom-button-"] {
padding: 7px 12px;
border: none;
border-radius: 4px;
margin: 2px;
}
button.custom-button {
@each $name, $palette in (primary: $primary,
accent: $accent, warn: $warn) {
&-#{$name} {
background-color:
material.get-color-from-palette($palette, default);
color: material.get-color-from-palette($palette,
default-contrast);
font: {
family: material.font-family($typography, button);
size: material.font-size($typography, button);
weight: material.font-weight($typography, button);
}
}
}
}
$bg: material.$light-theme-background-palette;
$fg: material.$light-theme-foreground-palette;
:host[disabled] button[class*="custom-button-"],
button[class*="custom-button-"]:disabled 	{
background-color:
material.get-color-from-palette($bg, disabled-button);
color: material.get-color-from-palette($fg, disabled-button);
}
Sass has a concise syntax, which can make it difficult to understand what is happening in the
listing until you have at least a little experience. The first statement is an @use expression:
...
@use "@angular/material" as material;
...
Sass support function and variables, which can be used to generate CSS styles, and the @use
expression provides access to the Sass features that Angular Material provides. The next group
-- 811 of 848 --
801
of statements create the primary, accent, and warn palettes from the Angular Material
theme:
...
$primary: material.define-palette(material.$indigo-palette);
$accent: material.define-palette(material.$pink-palette, A200, A100, A400);
$warn: material.define-palette(material.$red-palette);
...
Angular M

---

## This chapter covers

▪ 	Creating and performing unit tests in Angular projects
▪ 	Isolating components and directives for unit testing
▪ 	Testing Angular features, such as input and output properties
▪ 	Testing the HTML content generated by components
In this chapter, I describe the tools that Angular provides for unit testing components and
directives. Some Angular building blocks, such as pipes and services, can be readily tested in
isolation using the basic testing tools that I set up at the start of the chapter. Components
(and, to a lesser extent, directives) have complex interactions with their host elements and
with their template content and require special features. Table 29.1 puts Angular unit testing
in context.
DECIDING WHETHER TO UNIT TEST
Unit testing is a contentious topic. This chapter assumes you do want to do unit testing and
shows you how to set up the tools and apply them to Angular components and directives.
It isn’t an introduction to unit testing, and I make no effort to persuade skeptical readers
that unit testing is worthwhile. If you would like an introduction to unit testing, then there
is a good article here: https://en.wikipedia.org/wiki/Unit_testing.
I like unit testing, and I use it in my projects—but not all of them and not as consistently
as you might expect. I tend to focus on writing unit tests for features and functions that I
know will be hard to write and likely to be the source of bugs in deployment. In these
situations, unit testing helps structure my thoughts about how to best implement what I
need. I find that just thinking about what I need to test helps produce ideas about potential
problems, and that’s before I start dealing with actual bugs and defects.
-- 818 of 848 --
808
That said, unit testing is a tool and not a religion, and only you know how much testing you
require. If you don’t find unit testing useful or if you have a different methodology that
suits you better, then don’t feel you need to unit test just because it is fashionable.
(However, if you don’t have a better methodology and you are not testing at all, then you
are probably letting users find your bugs, which is rarely ideal.)
Table 29.1. Putting Angular unit testing in context
Question 	Answer
What is it? 	Angular components and directives require special support for
testing so that their interactions with other parts of the application
infrastructure can be isolated and inspected.
Why is it useful? 	Isolated unit tests can assess the basic logic provided by the class
that implements a component or directive but do not capture the
interactions with host elements, services, templates, and other
important Angular features.
How is it used? 	Angular provides a test bed that allows a realistic application
environment to be created and then used to perform unit tests.

---

## Are there any pitfalls or

limitations?
Like much of Angular, the unit testing tools are complex. It can take
some time and effort to get to the point where unit tests are easily
written and run and you are sure that you have isolated the correct
part of the application for testing.
Are there any alternatives? 	As noted, you don’t have to unit test your projects. But if you do want
to unit testing, then you will need to use the Angular features
described in this chapter.
Table 29.2 summarizes the chapter.
Table 29.2. Chapter summary
Problem 	Solution 	Listing

---

## Initialize a test module and create an instance of the

component. If the component has an external
template, an additional compilation step must be
performed.
1–10, 12–14
Testing a component’s data
bindings
Use the DebugElement class to query the
component’s template.
11
-- 819 of 848 --
809
Testing a component’s
response to events
Trigger the events using the debug element. 	15–17
Testing a component’s output
properties
Subscribe to the EventEmitter created by the
component.
18, 19
Testing a component’s input
properties

---

## Create a test component whose template applies

the component under test.
20, 22
Testing a directive 	Create a test component whose template applies
the directive under test.
22, 23
29.1 	Preparing the example project
I continue to use the exampleApp project from earlier chapters, but I only need a simple
target to focus on for unit testing. Add a file named simple.component.ts to the src/app
folder, with the content shown in listing 29.1.
TIP You can download the example project for this chapter—and for all the other chapters
in this book—from https://github.com/manningbooks/pro-angular-16. See chapter 1 for
how to get help if you have problems running the examples.
Listing 29.1. The contents of the simple.component.ts file in the src/app folder
import { Component } from "@angular/core";
@Component({
selector: "simple",
template: `<div class="bg-primary text-white p-2">Unit testing</div>`
})
export class SimpleComponent { }
Listing 29.2 adds the new component to the application module.
Listing 29.2. Registering a component in the app.module.ts file in the src/app folder
import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration }
from '@angular/platform-browser';
//import { AppComponent } from './app.component';
import { ModelModule } from "./model/model.module";
import { CoreModule } from "./core/core.module";
import { TableComponent } from "./core/table.component";
import { FormComponent } from "./core/form.component";
import { MessageModule } from "./messages/message.module";
import { MessageComponent } from "./messages/message.component";
import { AppComponent } from './app.component';
import { routing } from "./app.routing";
import { TermsGuard } from "./terms.guard"
import { LoadGuard } from "./load.guard";
import { PlatformService } from './platform.service';
-- 820 of 848 --
810
import { BrowserGuard } from './browser.guard';
import { SimpleComponent } from './simple.component';
@NgModule({
declarations: [AppComponent, SimpleComponent],
imports: [BrowserModule, ModelModule, CoreModule, MessageModule,
routing],
providers: [TermsGuard, LoadGuard, provideClientHydration(),
PlatformService, BrowserGuard],
bootstrap: [AppComponent]
})
export class AppModule { }
Listing 29.3 simplifies the routing configuration so that the new component is always displayed.
This is not a requirement for unit testing, but it helps simplify the project for this chapter.
Listing 29.3. Changing the routing configuration in the app.routing.ts file in the src/app
folder
import { Routes, RouterModule} from "@angular/router";
import { NotFoundComponent } from "./core/notFound.component";
import { SimpleComponent } from "./simple.component";
const routes: Routes = [
{ path: "", component: SimpleComponent },
{ path: "**", component: NotFoundComponent }]
export const routing = RouterModule.forRoot(routes, {
bindToComponentInputs: true
});
Open a new command prompt, navigate to the exampleApp folder, and run the following
command to start the server that provides the RESTful web server:
np

---

## There are

<span class="strong"> {{getProducts().length}} </span>
products
</div>`
})
export class SimpleComponent {
constructor(private repository: Model) {}
category: string = "Soccer";
getProducts(): Product[] {
return this.repository.Products()
.filter(p => p.category == this.category);
}
}
The component uses the repository to provide a filtered collection of Product objects, which
are exposed through a method called getProducts and filtered using a category property.
The inline template has a corresponding data binding that displays the number of products
that the getProducts method returns.
Being able to unit test the component means providing it with a repository service. The
Angular test bed will take care of resolving dependencies as long as they are configured
-- 827 of 848 --
817
through the test module. Effective unit testing generally requires components to be isolated
from the rest of the application, which means that mock or fake objects (also known as test
doubles) are used as substitutes for real services in unit tests. Listing 29.10 configures the
test bed so that a fake repository is used to provide the component with its service.
Listing 29.10. Providing a service in the simple.component.spec.ts file in the
src/app/tests folder
import { TestBed, ComponentFixture} from "@angular/core/testing";
import { SimpleComponent } from "../simple.component";
import { Product } from "..//model/product.model";
import { Model } from "../model/repository.model";
import { signal } from "@angular/core";
describe("SimpleComponent", () => {
let fixture: ComponentFixture<SimpleComponent>;
let component: SimpleComponent;
let mockRepository = {
Products: signal([
new Product(1, "test1", "Soccer", 100),
new Product(2, "test2", "Chess", 100),
new Product(3, "test3", "Soccer", 100)
])
}
beforeEach(() => {
TestBed.configureTestingModule({
declarations: [SimpleComponent],
providers: [
{ provide: Model, useValue: mockRepository }
]
});
fixture = TestBed.createComponent(SimpleComponent);
component = fixture.componentInstance;
});
it("filters categories", () => {
component.category = "Chess"
expect(component.getProducts().length).toBe(1);
component.category = "Soccer";
expect(component.getProducts().length).toBe(2);
component.category = "Running";
expect(component.getProducts().length).toBe(0);
});
});
The mockRepository variable is assigned an object that provides a Products property that
returns fixed data that can be used to test for known outcomes. To provide the component
with 	the 	service, 	the 	providers 	property 	for 	the 	object 	passed 	to 	the
TestBed.configureTestingModule method is configured in the same way as a real
Angular module, using the value provider to resolve dependencies on the Model class using
the mockRepository variable. The test invokes the component’s getProducts method and
-- 828 of 848 --
818
compares the results with the expected outcome, changing the value of the category
property to check different filters.
29.4.2 	Testing data bind

---

## There are

<span class="strong"> {{getProducts().length}} </span>
products
</div>
This is the same content that was previously defined inline. Listing 29.14 updates the unit test
for the component to deal with the external template by explicitly compiling the component.
Listing 29.14. Compiling a component in the simple.component.spec.ts file in the
src/app/tests folder
import { TestBed, ComponentFixture, waitForAsync}
from "@angular/core/testing";
import { SimpleComponent } from "../simple.component";
import { Product } from "..//model/product.model";
import { Model } from "../model/repository.model";
import { signal } from "@angular/core";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
describe("SimpleComponent", () => {
let fixture: ComponentFixture<SimpleComponent>;
let component: SimpleComponent;
let debugElement: DebugElement;
let bindingElement: HTMLSpanElement;
let mockRepository = {
Products: signal([
new Product(1, "test1", "Soccer", 100),
new Product(2, "test2", "Chess", 100),
new Product(3, "test3", "Soccer", 100)
])
}
beforeEach(waitForAsync(() => {
TestBed.configureTestingModule({
declarations: [SimpleComponent],
providers: [
{ provide: Model, useValue: mockRepository }
]
});
TestBed.compileComponents().then(() => {
fixture = TestBed.createComponent(SimpleComponent);
component = fixture.componentInstance;
-- 832 of 848 --
822
debugElement = fixture.debugElement;
bindingElement
= debugElement.query(By.css("span")).nativeElement;
});
}));
it("filters categories", () => {
component.category = "Chess"
fixture.detectChanges();
expect(component.getProducts().length).toBe(1);
expect(bindingElement.textContent).toContain("1");
component.category = "Soccer";
fixture.detectChanges();
expect(component.getProducts().length).toBe(2);
expect(bindingElement.textContent).toContain("2");
component.category = "Running";
fixture.detectChanges();
expect(component.getProducts().length).toBe(0);
expect(bindingElement.textContent).toContain("0");
});
});
Components 	are 	compiled 	using 	the 	TestBed.compileComponents 	method. 	The
compilation process is asynchronous, and the compileComponents method returns a
Promise, which must be used to complete the test setup when the compilation is complete.
To 	make 	it 	easier 	to 	work 	with 	asynchronous 	operations 	in 	unit 	tests, 	the
@angular/core/testing module contains a function called waitForAsync, which is used
with the beforeEach method.
29.4.4 	Testing component events
To demonstrate how to test for a component’s response to events, I defined a new property in
the SimpleComponent class and added a method to which the @HostBinding decorator has
been applied, as shown in listing 29.15.
Listing 29.15. Adding event handling in the simple.component.ts file in the src/app
folder
import { Component, HostListener } from "@angular/core";
import { Model } from "./model/repository.model";
import { Product } from "./model/product.model";
@Component({
selector: "simple",
templa

---

## There are

<span class="strong"> {{getProducts().length}} </span>
products
</div>
Events can be triggered in unit tests through the triggerEventHandler method defined by
the DebugElement class, as shown in listing 29.17.
Listing 29.17. Triggering events in the simple.component.spec.ts file in the src/app/tests
folder
import { TestBed, ComponentFixture, waitForAsync}
from "@angular/core/testing";
import { SimpleComponent } from "../simple.component";
import { Product } from "..//model/product.model";
import { Model } from "../model/repository.model";
import { signal } from "@angular/core";
import { DebugElement } from "@angular/core";
import { By } from "@angular/platform-browser";
describe("SimpleComponent", () => {
let fixture: ComponentFixture<SimpleComponent>;
let component: SimpleComponent;
let debugElement: DebugElement;
//let bindingElement: HTMLSpanElement;
let divElement: HTMLDivElement;
let mockRepository = {
Products: signal([
new Product(1, "test1", "Soccer", 100),
new Product(2, "test2", "Chess", 100),
new Product(3, "test3", "Soccer", 100)
])
}
beforeEach(waitForAsync(() => {
-- 834 of 848 --
824
TestBed.configureTestingModule({
declarations: [SimpleComponent],
providers: [
{ provide: Model, useValue: mockRepository }
]
});
TestBed.compileComponents().then(() => {
fixture = TestBed.createComponent(SimpleComponent);
component = fixture.componentInstance;
debugElement = fixture.debugElement;
// bindingElement
// 	= debugElement.query(By.css("span")).nativeElement;
divElement = debugElement.children[0].nativeElement;
});
}));
// it("filters categories", () => {
// 	component.category = "Chess"
// 	fixture.detectChanges();
// 	expect(component.getProducts().length).toBe(1);
// 	expect(bindingElement.textContent).toContain("1");
// 	component.category = "Soccer";
// 	fixture.detectChanges();
// 	expect(component.getProducts().length).toBe(2);
// 	expect(bindingElement.textContent).toContain("2");
// 	component.category = "Running";
// 	fixture.detectChanges();
// 	expect(component.getProducts().length).toBe(0);
// 	expect(bindingElement.textContent).toContain("0");
// });
it("handles mouse events", () => {
expect(component.highlighted).toBeFalsy();
expect(divElement.classList.contains("bg-success")).toBeFalsy();
debugElement.triggerEventHandler("mouseenter",
new Event("mouseenter"));
fixture.detectChanges();
expect(component.highlighted).toBeTruthy();
expect(divElement.classList.contains("bg-success")).toBeTruthy();
debugElement.triggerEventHandler("mouseleave",
new Event("mouseleave"));
fixture.detectChanges();
expect(component.highlighted).toBeFalsy();
expect(divElement.classList.contains("bg-success")).toBeFalsy();
});
});
The test in this listing checks the initial state of the component and the template and then
triggers the mouseenter and mouseleave events, checking the effect that each has.
29.4.5 	Testing output properties
Testing output properties is a simple process because the EventEmitter objects used to
implement them are Observable obj

---

## Angular

data flow, 250
data bindings, 250
template, 250
user interaction,
252
Angular Material, 166
installing, 22

---

## Applications

round-trip, 2
single-page, 2
Authentication. See
SportsStore:
authentication
B
Bootstrap CSS
framework, 48

---

## Browser

choosing, 12
Building for production,
207
C
Cascading Style Sheets
(CSS), 48

---

## Change detection

ChangeDetectorRef
class, 433
Change detection, 254
expression
evaluation, 256
signals, 258
strategy, 256

---

## Component libraries

additional styles, 783
Angular Material, 779
choosing, 779
Covalent, 779
data APIs, 790
feature modules, 784
installing, 778
Material Design, 779
mixing styles
packages, 783
ng-bootstrap, 779
ngx-bootstrap, 779
Sass, 793
sass files, 793
scss files, 793
themes, 793
using components,
781
Components, 237
@Component
decorator, 440
application structure,
438
content projection,
453
creating, 440
decorator, 237
dynamic, 455
input properties, 447
lifecycle methods
ngAfterViewChecke
d, 461
ngAfterViewInit,
461
output properties,
451
styles
external, 458
inline, 457
template queries, 460
@ViewChild
decorator, 461
@ViewChildren
decorator, 461
templates
data bindings, 446
external, 445
inline, 444
Cross-origin HTTP
requests (CORS), 658
CSS stylesheets
configuring, 227
style bundle, 227
D
Data bindings, 17
attribute bindings,
278, 281, 284
class bindings, 278
classes, 285
directive, 277
-- 843 of 848 --
833
event binding, 330
brackets, 331
event data, 334
expression, 331
filtering key
events, 339
host element, 331
template
references
variables, 338
expressions, 277
expressions, 279
host element, 277,
281
one-way bindings,
275
structure, 276
property bindings,
278, 281
restrictions, 322
limited expression
context, 324
square brackets, 277,
280
string interpolation,
283
style bindings, 278
styles, 285
target, 277
two-way, 30
two-way bindings,
340
ngModel directive,
343
Data model, 100
Dependency injection.
See Services

---

## Directives

host element content
change detection,
433
ChangeDetectorRef
class, 433
Directives, 277
@Directive decorator,
403
@Input decorator,
378
@Output decorator,
384
attribute directives,
371
data-bound inputs,
377
host element
attributes, 374
required inputs,
382
built-in directives,
300
custom directive, 116
custom events, 384
emit method, 386
host element
bindings, 388
host element content,
426
@ContentChild
decorator, 427
@ContentChildren
decorator, 431
lifecycle hooks, 379
micro-templates, 302
ngClass, 278
ngClass directive, 289
ng-container element,
321
ngFor, 278
ngFor directive, 306
even variable, 308
expanding micro-
template
syntax, 312
first variable, 308
index variable, 308
last variable, 308
let keyword, 307
minimizing
changes, 314
odd variable, 308
of keyword, 307
trackBy, 317
using variables in
child elements,
307
ngIf, 278
ngIf directive, 301
using literal
values, 305
ngModel directive,
343
ngStyle, 278
ngStyle directive, 292
ngSwitch, 278
ngSwitch directive,
303
ngTemplateOutlet,
278
ngTemplateOutlet
directive, 318
context data, 319
ng-template
element, 319
structural directives,
401
collection changes,
416
concise syntax,
406
context data, 411
detecting changes,
403
iterating directives,
407
ngDoCheck
method, 417
ng-template
element, 405
property changes,
414
ViewContainerRef
class, 403

---

## Directives

using services, 526
Docker containers, 208
DOM Events
common properties,
335
E

---

## Editor

choosing, 11
Errata, reporting, 5
Events, 330
event binding, 330
F
Forms, 345
API, 580
dynamic forms, 615
FormArray class, 615
adding controls,
621
methods, 615
properties, 615
-- 844 of 848 --
834
removing controls,
621
validating controls,
623
FormControl class,
582
change frequency,
586
constructor, 586
events, 586
state, 587
updateOn
property, 586
formControl directive,
581
formControlName
directive, 602
FormGroup class, 598
resetting, 600
setting values, 600
formGroup directive,
602
observable
properties, 584
reactive forms, 580
ReactiveFormsModule
, 581
validation, 348, 589,
607
asynchronous, 640
custom, 628
multiple fields,
634
directives, 630
registering
services, 631
validation classes,
349, 364
whole-form
validation, 357
H
HTML
attributes, 45
literal values, 46
without values, 45
document object
model, 47
document structure,
47
elements, 44
content, 46
hierarchy, 46
tags, 45
void elements, 45
J
JavaScript, 50
access control, 85
arrays, 76
built-in methods,
78
enumerating, 77
modifying, 77
reading, 77
spread operator,
78
boolean type, 53
classes, 82
inheritance, 86
closures, 75
coalescing values, 66
conditional
statements, 62
constructor, 85
functions
as arguments to
other functions,
74
default
parameters, 72
defining, 71
optional
parameters, 72
rest parameters,
73
results, 73
literal values in
directive
expressions, 305
modules, 88
export keyword,
88
import keyword,
88
NPM packages, 89
resolution, 89
null, 53
null coalescing
operator, 66
nullish coalescing
operator, 66
number type, 53
objects
literal syntax, 80
optional
properties, 82
operators, 61
equality versus
identity
operator, 62
optional chaining
operator, 67
primitive types, 53
statements
conditional, 62
string type, 53
template strings, 60
truthy and falsy
values, 63, 288
types, 59
booleans, 59
converting
explicitly, 64
null, 61
numbers, 60
strings, 59
template strings,
60
undefined, 61
undefined, 53
variable closure, 75
variables and
constants, 57
JSON Web Token, 157
L

---

## Listings

complete, 5
interleaved, 6
partial, 6
M
Material Design, 779
Micro-templates
use by directives, 302

---

## Modules

@NgModule
decorator, 543
bootstrap property,
544
declarations property,
544
-- 845 of 848 --
835
dynamic. see URL
routing
dynamic loading
SportsStore, 152
feature modules,
creating, 547
imports property, 543
providers property,
544
root module, 541
using with JavaScript
modules, 552
N
ng add Command, 222
ng command, 12
ng config Command, 227
ng lint command, 230
ng new command, 213
ng serve command, 223
ng-container element,
321
NgZone class, 664
Node Package Manager,
11
Node.js
installing, 10
NPM, 11
package manager, 11
P

---

## Pipes

@Pipe decorator, 470
applying, 467
arguments, 468
async pipe, 505
combining, 473
creating, 469
formatting currency
amounts, 483
formatting dates, 488
formatting numbers,
479
formatting
percentages, 486
formatting string
case, 494
impure pipes, 474
JSON serialization,
497
key/value pairs, 500
pluralizing values,
503
pure pipes, 474
selecting values, 501,
503
slicing arrays, 498
using services, 524
Polyfills, 227
Prerendering, 773
routes file, 773
Progressive Web
Applications, 199

---

## Projects

.editorconfig file, 216
.gitignore file, 216
ahead-of-time
compilation, 239
angular.json file, 216
AoT compilation, 239
build process, 225
bundles, 225
components, 237
contents, 215
data model, 240
development tools,
223
hot reloading, 226
HTML document, 234
node_modules folder,
216, 218
package.json file, 216
packages, 218, 222
global packages,
220
scripts, 221
versions, 219
root module, 236
src folder, 216, 217
src/app folder, 217
src/assets folder, 217
src/index.html file,
217
src/main.ts file, 217
src/polyfills.ts file,
217
src/styles.css file, 217
src/tests.ts file, 217
structure, 215
tsconfig.json file, 216
tslint.json file, 216
webpack, 225
R
React, 3
Reactive extensions, 267
async pipe, 505

---

## Observable

subscribe method,
267
Reactive forms, 580
Rehydration, 759
REST. see Web services
RESTful web services.
see Web services
SportsStore example,
146
Root module, 236
Round-trip applications,
2
RxJS, 267
S
Sass, 793
Schematics API, 222
Server-side rendering,
756
browser APIs, 761
commands, 762
guarding, 767
installing, 756
navigation, 764
preparing the
application, 758
prerendering, 773
rehydration, 759

---

## Services

@Injectable
decorator, 517
component isolation,
531
dependency injection,
517
providers property,
520
receiving services,
518
registering services,
520
registering validators,
631
services in directives,
526
services in pipes, 524
-- 846 of 848 --
836
shared object
problem, 511
Signals, 100, 258
computed, 103
computed signals,
260
dependencies, 260
effects, 262
functions, 258
computed function,
258
effect function,
258
signal function,
258
working with
observables, 269
toObservable
function, 574
writable signals, 258
methods, 259
Single-page applications,
2
SportsStore
additional packages,
92
Angular Material, 166
authentication, 157
JSON Web Token,
157
bootstrap file, 99
cart, 120
summary
component, 123
category selection,
109
component library,
166
containerizing, 208
creating the
container, 210
creating the
image, 210
deployment
packages, 208
Dockerfile, 209
stopping the
container, 211
creating the project,
92
data model, 100
data source, 100
signals, 100
data source, 100
displaying products,
108
dynamic module, 152
navigation, 132
orders, 139
pagination, 112
persistent data, 204
prerendering, 192
detecting, 193
packages, 192
production build, 207
progressive features,
199
caching, 199
connectivity, 200
project structure, 96
REST data, 146
root component, 97
root module, 98
route guard, 134
server-side rendering,
192
URL routing, 128
web service, 93
String interpolation, 283
T

---

## Templates

variables, 35
TypeScript, 50
any type, 52
concise constructor,
16
specific types, 53
type annotation, 52
type union, 54
variables and
constants, 57
U

---

## Unit testing

components
configuring
dependencies,
813
data bindings, 815
events, 819
input properties,
824
output properties,
821
templates, 817
directives, 826
Jasmine, 808
methods, 809
Karma test runner,
808
ng test command,
808
TestBed class, 811
URL routing, 128, 669
ActivatedRoute class,
678
basic configuration,
669
child routes, 715
parameters, 718
route outlets, 716
dynamic modules,
749
guarding, 753
specifying, 751
using, 752
guarding, 134
guards, 723
displaying a
loading
message, 729
mapToCanActivate
function, 735
preventing
navigation, 732
preventing route
activation, 733
resolvers, 724
mapToResolve
function, 728
navigating within a
component, 709
navigation events,
691
navigation links, 673
optional URL
segments, 687
programmatic
navigation, 678,
689
redirections, 707
route parameters,
682
routerLink directive,
673
router-outlet element,
671
-- 847 of 848 --
837
Routes class, 670
styles for active
elements, 710
wildcard routes, 705
V
Vue.js, 3
W
Web services, 648
cross-origin requests,
658
errors, 661
HTTP verbs, 649
HttpClient class, 650
consolidating
requests, 656
methods, 650
responses, 651
NgZone class, 664
request headers, 659
-- 848 of 848 --

---

