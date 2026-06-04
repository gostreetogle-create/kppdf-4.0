# Ninja Squad - Become A Ninja With Angular - 2024

> **Источник:** Ninja Squad - Become A Ninja With Angular - 2024
> **Дата извлечения:** 2026-06-03
> **Концепции:** signals, computed-signals, effects, standalone, change-detection, defer, control-flow, di, routing, http, rxjs, pipes, components, templates, testing, i18n, animations, performance, modules, model-inputs, advanced-components
> **Размер текста:** 601708 символов

---

## 2. A gentle introduction to ECMAScript 2015+. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4

2.1. Transpilers . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 4
2.2. let . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 5
2.3. Constants. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 6
2.4. Shorthands in object creation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
2.5. Destructuring assignment . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 7
2.6. Default parameters and values . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9
2.7. Rest operator . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 11
2.8. Classes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 12
2.9. Promises . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 14
2.10. Arrow functions . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 17
2.11. Async/await . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 20
2.12. Sets and Maps . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 21
2.13. Template literals . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 21
2.14. Modules. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 22
2.15. Conclusion . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 24

---

## 4. Diving into TypeScript . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 29

4.1. Types as in TypeScript. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 29
4.2. Enums . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 30
4.3. Return types. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 31
4.4. Interfaces . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 31
4.5. Optional arguments . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 32
4.6. Functions as property . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 33
4.7. Classes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 33
4.8. Working with other libraries . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 35
4.9. Decorators . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 36

---

## 6. The wonderful land of Web Components. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 45

6.1. A brave new world . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 45
-- 3 of 353 --
6.2. Custom elements. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 46
6.3. Shadow DOM . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 47
6.4. Template . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 47
6.5. Frameworks on top of Web Components . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 48

---

## 9. The templating syntax. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 61

9.1. Interpolation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 62
9.2. Using other components in our templates . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 64
9.3. Property binding. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 66
9.4. Events . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 69
9.5. Expressions vs statements . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 72
9.6. Local variables . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 73
9.7. Structural directives . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 74
9.8. Other template directives . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 77
9.9. Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 78

---

## 12. Pipes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 99

12.1. Pied piper . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 99
12.2. json. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 99
12.3. slice . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 100
12.4. keyvalue . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 101
12.5. uppercase . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 103
12.6. lowercase . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 103
12.7. titlecase. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 103
12.8. number . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 103
12.9. percent . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 104
12.10. currency . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 105
-- 4 of 353 --
12.11. date . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 105
12.12. async . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 106
12.13. A pipe in your code . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 107
12.14. Creating your own pipes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 108

---

## 13. Dependency injection . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 110

13.1. DI yourself . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 110
13.2. Easy to develop . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 110
13.3. Easy to configure . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 113
13.4. Other types of provider . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 116
13.5. Hierarchical injectors . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 117
13.6. DI without types . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 119
13.7. inject(). . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 121
13.8. Services provided by the framework . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 121

---

## 15. Testing your app. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 128

15.1. The problem with troubleshooting is that trouble shoots back . . . . . . . . . . . . . . . . . . . . . . . . . 128
15.2. Unit tests. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 128
15.3. Fake dependencies. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 134
15.4. Testing components. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 136
15.5. Testing with fake templates, providers… . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 139
15.6. Simpler, cleaner unit tests with ngx-speculoos . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 141
15.7. End-to-end tests (e2e) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 143

---

## 16. Send and receive data through HTTP . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 145

16.1. Getting data (provideHttpClient) . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 145
16.2. Transforming data . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 148
16.3. Advanced options. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 148
16.4. Interceptors . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 149
16.5. Context . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 150
16.6. Tests . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 151

---

## 17. Router . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 153

17.1. En route (provideRouter). . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 153
17.2. Navigation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 156
17.3. Redirects. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 158
17.4. Matching strategy. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 159
17.5. Hierarchical and empty-path routes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 159
17.6. Guards. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 161
17.7. Resolvers . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 163
-- 5 of 353 --
17.8. Router events . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 165
17.9. Parameters and data . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 165
17.10. Bind parameters and data to component inputs . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 167
17.11. Lazy loading . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 168

---

## 18. Forms . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 170

18.1. Forms, dear forms . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 170
18.2. Template-driven . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 172
18.3. Code-driven . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 177
18.4. Adding some validation . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 181
18.5. Errors and submission . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 183
18.6. Add some style . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 186
18.7. Creating a custom validator. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 187
18.8. Grouping fields . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 190
18.9. Reacting to changes . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 192
18.10. Updating on blur or on submit only . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 194
18.11. FormArray and FormRecord . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 195
18.12. Strictly typed forms . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 197
18.13. Super simple validation error messages with ngx-valdemort . . . . . . . . . . . . . . . . . . . . . . . . . . 199
18.14. Going further: define custom form inputs with ControlValueAccessor. . . . . . . . . . . . . . . . . . 200
18.15. Summary . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 202

---

## 22. Advanced components and directives . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 228

22.1. Input transforms . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 228
22.2. View queries: ViewChild . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 229
22.3. Content: ng-content . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 232
22.4. Content queries: ContentChild . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 234
22.5. Conditional and contextual content projection: ng-template and ngTemplateOutlet . . . . . . . 237
22.6. Host listener . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 239
22.7. Host binding . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 241

---

## 24. Internationalization . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 247

24.1. The locale . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 247
24.2. Default currency. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 249
24.3. Translating text. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 250
24.4. Process and tooling . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 250
24.5. Translating messages in the code. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 256
24.6. Pluralization . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 257
24.7. Best practices. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 259

---

## 26. Signals. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 286

26.1. The reasons behind Signals . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 286
26.2. Signals API . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 286
26.3. Signals, components, and change detection . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 289
26.4. Tip for signals with nullable values. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 290
26.5. Sharing a signal between components . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 291
26.6. Memory leaks . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 292
26.7. Signals and RxJS interoperability. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 293
26.8. Signal-based components. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 294
26.9. Inputs as signals . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 295
26.10. Queries as signals. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 297
26.11. model() . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 300
26.12. Conclusion . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 302

---

## 27. Control flow template syntax . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 303

27.1. Structural directives under the hood . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 303
27.2. Control flow syntax . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 306
27.3. If statement . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 307
27.4. For statement . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 308
27.5. Switch statement . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 309
27.6. The future of templating . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 309

---

## 30. This is the end . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 323

Appendix A: Changelog. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 326
A.1. v17.2.0 - 2024-02-15 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 326
A.2. v17.1.0 - 2024-01-18 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 326
A.3. v17.0.0 - 2023-11-08 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 326
A.4. v16.2.0 - 2023-08-10 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 327
A.5. v16.1.0 - 2023-06-14 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 327
A.6. v16.0.0 - 2023-05-17 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 327
A.7. v15.2.0 - 2023-02-23 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 327
A.8. v15.1.0 - 2023-01-11 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 327
A.9. v15.0.0 - 2022-11-16 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 328
A.10. v14.2.0 - 2022-08-26 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 328
A.11. v14.1.0 - 2022-07-21 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 328
A.12. v14.0.0 - 2022-06-03 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 329
A.13. v13.3.0 - 2022-03-16 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 329
A.14. v13.2.0 - 2022-01-27 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 329
A.15. v13.1.0 - 2021-12-10 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 329
A.16. v13.0.0 - 2021-11-04 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 329
A.17. v12.2.0 - 2021-08-05 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 330
A.18. v12.1.0 - 2021-06-25 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 

---

## Chapter 1. Introduction

So you want to be a ninja, huh? Well, you’re in good hands!
But we have a long road, you and me, with lots of things to learn :).
We’re living exciting times in Web development. There is a new Angular. A complete rewrite of the
good old AngularJS. Why a complete rewrite? Was AngularJS 1.x not enough?
I like the old AngularJS very much. In our small company, we have built several projects with it,
contributed code to the core framework, trained hundreds of developers (yes, really), and even
written a book about it (in French, but that still counts).
AngularJS is incredibly productive once you have mastered it. Despite all of this, it doesn’t prevent
us from seeing its weaknesses. AngularJS is not perfect, with some very difficult concepts to grasp,
and traps hard to avoid.
Most of all, the Web has changed since AngularJS was conceived. JavaScript has changed. New
frameworks have emerged, with great ideas, or better implementation. We are not the kind of
developers to tell you that you should use this tool instead of that one. We just happen to know
some tools very well, and know what fits the project. AngularJS was one of those tools, allowing us
to build well-tested web applications, and to build them fast. We also tried to bend it where it didn’t
fit. Don’t blame us, it happens to the best of us.
Angular has a lot of interesting points, and a vision that few other frameworks have. It has been
designed for the Web of tomorrow, with ECMAScript 6, Web Components and Mobile in mind.
When it was first announced, I was, like many, sad at first that the 2.0 version would not be a
simple update (I’m sorry if you’re just learning about it).
But I was also eager to see what solution the talented Google team would come up with.
So I started to write this ebook, pretty much after the first commits, reading the design docs,
watching the conference videos, reviewing every commit since the beginning. When I wrote my
first ebook, about AngularJS 1.x, it was already a stable and known beast. This one is very different.
It started when Angular was not even clear in the minds of its designers. Because I knew I would
learn a lot, not only about Angular but also about the concepts that would shape the future of Web
development, some of which have nothing to do with Angular. And I did. I had to dig deep about
some of these concepts, and I hope that you will enjoy the journey of learning about them, and how
they relate to Angular, as much as I did.
The ambition of this ebook is to evolve with Angular. If it turns out that Angular is the great
framework we hope, you will receive updates with the best practices and some new features as
they emerge (and with fewer typos, because, despite our countless reviews, there are probably
some left…). And I would love to hear back from you - if some chapters aren’t clear enough, if you
spot a mistake or if you have a better way for some parts.
I’m fairly confident about the code samples, though, as they are all in a real project, 

---

## Angular and versioning

This book used to be named "Become a Ninja with Angular 2". Because, originally,
Google named its framework Angular 2. But in October 2016, they reviewed their
versioning and release policy.
We now have a major release every six months. And the framework should be
called just “Angular”.
Don’t worry, these releases are not a complete rewrite with no backward
compatibility like Angular 2 was to AngularJS 1.x.
As this ebook is updated (for free) with all the future major releases, it is now
2
-- 11 of 353 --
named "Become a Ninja with Angular" (without any number).
3
-- 12 of 353 --

---

## Chapter 2. A gentle introduction to

ECMAScript 2015+
If you’re reading this, we can be pretty sure you have heard of JavaScript. What we call JS is one
implementation of a standard specification, called ECMAScript. The spec version you know the
most about is version 5, that has been used these last years.
But, in 2015, a new version of the spec was released, called ECMAScript 2015, ES2015, or sometimes
ES6, as it was the sixth version of the specification. And since then, we have had a yearly release of
the specification (ES2016, ES2017, etc.), with a few new features every year. From now on, I’ll
mainly say ES2015, as it is the most popular way to reference it, or ES2015+ to reference ES2015,
ES2016, ES2017, etc. It adds A LOT of things to JavaScript, like classes, constants, arrow functions,
generators… It has so much stuff that we can’t go through all of it, as it would take the whole book.
But Angular has been designed to take advantage of the brand new version of JavaScript. And, even
if you can still use your old JavaScript, things will be more awesome if you use ES2015+. So we’re
going to spend some time in this chapter to get a grip on what ES2015+ is, and what will be useful to
us when building an Angular app.
That means we’re going to leave a lot of stuff aside, and we won’t be exhaustive on the rest, but it
will be a great starting point. If you already know ES2015+, you can skip these pages. And if you
don’t, you will learn some pretty amazing things that will be useful to you even if you end up not
using Angular in the future!
2.1. Transpilers
The sixth version of the specification reached its final state in 2015. So it’s now supported by
modern browsers, but there are still browsers in the wild that don’t support it yet, or only support
it partially. And of course, now that we have a new specification every year (ES2016, ES2017, etc.),
some browsers will always be late. You might be thinking: what’s the point of all this, if I need to be
careful on what I can use? And you’d be right, because there aren’t that many apps that can afford
to ignore older browsers. But, since virtually every JS developer who has tried ES2015+ wants to
write ES2015+ apps, the community has found a solution: a transpiler.
A transpiler takes ES2015+ source code and generates ES5 code that can run in every browser. It
even generates the source map files, which allows you to debug directly the ES2015+ source code
from the browser. Back in 2015, there were two main alternatives to transpile ES2015+ code:
• Traceur, a Google project, historically the first one but now unmaintained.
• Babeljs, a project started by a young developer, Sebastian McKenzie (17 years old at the time,
yeah, that hurts me too), with a lot of diverse contributions.
The source code of Angular itself was at first transpiled with Traceur, before switching to
TypeScript. TypeScript is an open source language developed by Microsoft. It’s a typed superset of
JavaScript that compiles to plain JavaScript, but we’ll dive into it ve

---

## Chapter 3. Going further than ES2015+

3.1. Dynamic, static and optional types
You may have heard that Angular apps can be written in TypeScript. And you may be wondering
what TypeScript is, or what it brings to the table.
JavaScript is dynamically typed. That means you can do things like:
let pony = 'Rainbow Dash';
pony = 2;
And it works. That’s great for all sort of things, as you can pass pretty much any object to a function
and it works, as long as the object has the properties the function needs:
const pony = { name: 'Rainbow Dash', color: 'blue' };
const horse = { speed: 40, color: 'black' };
const printColor = animal => console.log(animal.color);
// works as long as the object has a `color` property
This dynamic nature allows wonderful things but it is also a pain for a few other reasons compared
to more statically-typed languages. The most obvious might be when you call an unknown function
in JS from another API, you pretty much have to read the doc (or, worse, the function code) to know
what the parameter should look like. Take a look at our previous example: the method printColor
needs a parameter with a color property. That can be hard to guess, and of course it is much worse
in day-to-day work, where we use various libraries and services developed by fellow developers.
One of Ninja Squad’s co-founders is often complaining about the lack of types in JS, and finds it
regrettable he can’t be as productive and write as good code as he would in a more statically-typed
environment. And he is not entirely wrong, even if he is sometimes ranting for the sake of it too!
Without type information, IDEs have no real clue if you’re doing something wrong, and tools can’t
help you find bugs in your code. Of course, we have tests in our apps, and Angular has always been
keen on making testing easy, but it’s nearly impossible to have a perfect test coverage.
That leads to the maintainability topic. JS code can become hard to maintain, despite tests and
documentation. Refactoring a huge JS app is no easy task, compared to what could be done in other
statically-typed languages. Maintainability is a very important topic, and types help humans and
tools to avoid mistakes when writing and maintaining code. Google has always been keen to push
new solutions in that direction: it’s easy to understand as they have some of the biggest web apps of
the world, with GMail, Google apps, Maps… So they have tried several approaches to front-end
maintainability: GWT, Google Closure, Dart… All trying to help writing big webapps.
For Angular, the Google team wanted to help us to write better JS, by adding some type information
to our code. It’s not a very new concept in JS. It was even the subject of the ECMAScript 4
specification, which was later abandoned. At first they announced AtScript, as a superset of
ES2015+ with annotations (types annotations and another kind I’ll discuss later). They also
announced the support of TypeScript, the Microsoft language, with additional type annotations.
25
-- 34 of 353 --

---

## Chapter 4. Diving into TypeScript

TypeScript has been around since 2012. It’s a superset of JavaScript, adding a few things to ES5. The
most important one is the type system, giving TypeScript its name. From version 1.5, released in
2015, the library is trying to be a superset of ES2015+, including all the shiny features we saw in the
previous chapter, and a few new things as well, like decorators. Writing TypeScript feels very much
like writing JavaScript. By convention, TypeScript files are named with a .ts extension, and they
will need to be compiled to standard JavaScript, usually at build time, using the TypeScript
compiler. The generated code is very readable.
npm install -g typescript
tsc test.ts
But let’s start with the beginning.
4.1. Types as in TypeScript
The general syntax to add type info in TypeScript is rather straightforward:
let variable: type;
The types are easy to remember:
const ponyNumber: number = 0;
const ponyName: string = 'Rainbow Dash';
In such cases, the types are optional because the TS compiler can guess them (it’s called "type
inference") from the values.
The type can also come from your app, as with the following class Pony:
const pony: Pony = new Pony();
29
-- 38 of 353 --
TypeScript also supports what some languages call "generics", for example for an array:
const ponies: Array<Pony> = [new Pony()];
The array can only contain ponies, and the generic notation, using <>, indicates this. You may be
wondering what the point of doing this is. Adding types information will help the compiler catch
possible mistakes:
ponies.push('hello'); // error TS2345
// Argument of type 'string' is not assignable to parameter of type 'Pony'.
So, if you need a variable to have multiple types, does it mean you’re screwed? No, because TS has a
special type, called any.
let changing: any = 2;
changing = true; // no problem
It’s really useful when you don’t know the type of a value, either because it’s from a dynamic
content or from a library you’re using.
If your variable can only be of type number or boolean, you can use a union type:
let changing: number | boolean = 2;
changing = true; // no problem
4.2. Enums
TypeScript also offers enum. For example, a race in our app can be either ready, started or done.
enum RaceStatus {
Ready,
Started,

---

## Done

}
const race = new Race();
race.status = RaceStatus.Ready;
The enum is in fact a numeric value, starting at 0. You can set the value you want, though:
enum Medal {
Gold = 1,
30
-- 39 of 353 --
Silver,

---

## Bronze

}
Since TypeScript 2.4, you can even specify a string value:
enum Position {
First = 'First',
Second = 'Second',
Other = 'Other'
}
To be honest though, we don’t use enums a lot in our projects: we use union types. They are simpler
and cover roughly the same use-cases:
let color: 'blue' | 'red' | 'green';
// we can only give one of these values to `color`
color = 'blue';
TypeScript even allows you to create your own types, so you could do something like:
type Color = 'blue' | 'red' | 'green';
const ponyColor: Color = 'blue';
4.3. Return types
You can also set the return type of a function:
function startRace(race: Race): Race {
race.status = RaceStatus.Started;
return race;
}
If the function returns nothing, you can show it using void:
function startRace(race: Race): void {
race.status = RaceStatus.Started;
}
4.4. Interfaces
That’s a good first step. But as I said earlier, JavaScript is great for its dynamic nature. A function
will work if it receives an object with the correct property:
31
-- 40 of 353 --
function addPointsToScore(player, points) {
player.score += points;
}
This function can be applied to any object with a score property. How do you translate this in
TypeScript? It’s easy: you define an interface, which is like the "shape" of the object.
function addPointsToScore(player: { score: number }, points: number): void {
player.score += points;
}
It means that the parameter must have a property called score of the type number. You can name
these interfaces, of course:
interface HasScore {
score: number;
}
function addPointsToScore(player: HasScore, points: number): void {
player.score += points;
}
You’ll see that we often use interfaces throughout the book to represent our entities. We use
interfaces for our models in our other projects as well. We usually append a Model suffix to make it
clear. It’s then very easy to create a new entity:
interface PonyModel {
name: string;
speed: number;
}
const pony: PonyModel = { name: 'Light Shoe', speed: 56 };
4.5. Optional arguments
Another treat of JavaScript is that arguments are optional. You can omit them, and they will become
undefined. But if you define a function with typed parameter in TypeScript, the compiler will shout
at you if you forget them:
addPointsToScore(player); // error TS2346
// Supplied parameters do not match any signature of call target.
To show that a parameter is optional in a function (or a property in an interface), you can add ?
32
-- 41 of 353 --
after the parameter. Here, the points parameter could be optional:
function addPointsToScore(player: HasScore, points?: number): void {
points = points || 0;
player.score += points;
}
4.6. Functions as property
You may also be interested in describing a parameter that must have a specific function instead of a
property. The interface definition will be:
interface CanRun {
run(meters: number): void;
}
function startRunning(pony: CanRun): void {
pony.run(10);
}
const ponyOne = {
run: (meters: number) => logger.log(`pony runs ${m

---

## Chapter 5. Advanced TypeScript

If you’re just starting to learn TypeScript, you can safely skip this chapter for now and come back
later. This chapter is here to showcase some more advanced usages of TypeScript. They’ll only
make sense if you already have some familiarity with the language
5.1. readonly
You can use the readonly keyword to mark the property of a class or interface as… read only! That
way, the compiler will refuse to compile any code trying to assign a new value to the property:
interface Config {
readonly timeout: number;
}
const config: Config = { timeout: 2000 };
// `config.timeout` is now readonly and can't be reassigned
5.2. keyof
The keyof keyword can be used to get a type representing the union of the names of the properties
of another type. For example, you have a PonyModel interface:
interface PonyModel {
name: string;
color: string;
speed: number;
}
You want to build a function that returns the value of a property. You could implement a naive
version:
function getProperty(obj: any, key: string): any {
return obj[key];
}
const pony: PonyModel = {
name: 'Rainbow Dash',
color: 'blue',
speed: 45
};
const nameValue = getProperty(pony, 'name');
Two problems here:
39
-- 48 of 353 --
• you can give any value to the key parameter, even keys that don’t exist on PonyModel.
• the return type being any, you are losing a lot of type information.
This is where keyof can shine. keyof allows you to list all the keys of a type:
type PonyModelKey = keyof PonyModel;
// this is the same as `'name'|'speed'|'color'`
let property: PonyModelKey = 'name'; // works
property = 'speed'; // works
// key = 'other' would not compile
So we can use this type to make getProperty safer, by declaring that:
• the first parameter is of type T
• the second parameter is of type K, which is a key of T
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
return obj[key];
}
const pony: PonyModel = {
name: 'Rainbow Dash',
color: 'blue',
speed: 45
};
// TypeScript infers that `nameValue` is of type `string`!
const nameValue = getProperty(pony, 'name');
We killed two birds with one stone here:
• key can now only be an existing property of PonyModel
• the return value will be inferred by TypeScript (which is pretty awesome!)
Now let’s see how we can leverage keyof to do even more.
5.3. Mapped type
Let’s say you want to create a type that has exactly the same properties as PonyModel, but you want
every property to be optional. You can of course define it manually:
interface PartialPonyModel {
name?: string;
color?: string;
speed?: number;
}
40
-- 49 of 353 --
const pony: PartialPonyModel = {
name: 'Rainbow Dash'
};
But you can do something more generic with a mapped type:
type Partial<T> = {
[P in keyof T]?: T[P];
};
const pony: Partial<PonyModel> = {
name: 'Rainbow Dash'
};
The Partial type is a transformation that applies the ? modifier to every property of a type! In fact,
you don’t have to define the type Partial yourself, because since version 2.1, it’s part of the
language itself,

---

## Components

Before going further, I’d like to make a brief stop to talk about Web Components. You don’t have to
know about Web Components to write Angular code. But I think it’s a good thing to have an
overview of what they are, because some choices in Angular have been made to facilitate the
integration with Web Components, or to make the components we will build similar to Web
Components. Feel free to skip this part if you have no interest in this topic; however, I do believe
you’ll learn a thing or two that will be useful for the rest of the road.
6.1. A brave new world
Components are an old fantasy in development. Something you can grab off the shelves and drop
into your app, something that would work right away and bring a needed functionality to your
users.
My friends, this time has come.
Well, maybe. At least, there is the start of something.
That’s not completely new. We have had components in web development for quite some time, but
they usually require some kind of dependency, like jQuery, Dojo, Prototype, AngularJS, etc. Not
necessarily libraries you wanted to add to your app.
Web Components attempt to solve this problem: let’s have reusable and encapsulated components.
They rely on a set of emerging standards that browsers don’t perfectly support yet. But, still, it’s an
interesting topic, even if there’s a chance we’ll have to wait a few years to use them fully, or even if
the concept never takes off.
This emerging standard is defined in 3 specifications:
• Custom elements
• Shadow DOM
• Template
Note that the samples are most likely to work in a recent Chrome or Firefox browser.
45
-- 54 of 353 --
6.2. Custom elements
Custom elements are a new standard allowing developers to create their own DOM elements,
making something like <ns-pony></ns-pony> a perfectly valid HTML element. The specification
defines how to declare such elements, how to make them extend existing elements, how to define
your API, etc.
Declaring a custom element is done using customElements.define:
class PonyComponent extends HTMLElement {
constructor() {
super();
console.log("I'm a pony!");
}
}
customElements.define('ns-pony', PonyComponent);
And you can then use it:
<ns-pony></ns-pony>
Note that the name must contain a dash, so that the browser knows it is a custom element. Of
course, your custom element can have properties and methods, and it also has lifecycle callbacks, to
be able to execute code when the component is inserted or removed, or when one of its attributes
changes. It can also have a template of its own. Maybe the ns-pony displays an image of the pony or
just its name:
class PonyComponent extends HTMLElement {
constructor() {
super();
console.log("I'm a pony!");
}
/**
* This is called when the component is inserted
*/
connectedCallback() {
this.innerHTML = '<h1>General Soda</h1>';
}
}
If you try to look at the DOM, you’ll see <ns-pony><h1>General Soda</h1></ns-pony>. But that means
46
-- 55 of 353 --
the CSS and JavaScript logic of your app can have undesired 

---

## Chapter 7. Grasping Angular’s philosophy

To write an Angular application, you have to grasp a few things on the framework’s philosophy.
First and foremost, Angular is component-oriented. You will write tiny components and, together,
they will constitute a whole application. A component is a group of HTML elements in a template,
dedicated to a particular task. For this, you will usually also need to have some logic linked to that
template, to populate data, and react to events for example. For the veterans of AngularJS 1.x, it’s a
bit like a 'template/controller' duo, or a directive.
This component orientation is something that is becoming widely shared across front-end
frameworks: React, the cool kid from Facebook, has been doing it that way from the beginning;
Ember and AngularJS have their way of doing something similar; and others like Svelte or Vue.js
are betting on building small components too.
50
-- 59 of 353 --
Angular is not alone in this, but it is among the first (it might actually be the first?) to really care
about the integration of Web Components (the standard ones). But let’s forget about this for now, as
it is a more advanced topic.
Your components will be arranged in a hierarchical way, like the DOM is. A root component will
have child components, each of them will also have children, etc. If you want to display a pony race
(who wouldn’t?), you’ll have something like an app (Ponyracer), displaying a menu (Menu) with the
logged in user (User) and a child view (Race), displaying, of course, the ponies (Pony) in the races:
51
-- 60 of 353 --

---

## Ponyracer

Menu Race
User Pony Pony Pony
Writing components will be your everyday work, so let’s see what it looks like. The Angular team
wanted to harness another goodness of today’s web development: ES2015+. So you can write your
components in ES5 (but that’s not very cool) or in ES2015+ (way cooler!). But that was not enough
for them. They wanted to use a feature that is not a standard (yet): decorators. So they worked
closely with the transpiler teams (Traceur and Babel) and the TypeScript team at Microsoft, to
enable us to use decorators in our Angular apps. A few decorators are available, allowing us to
easily declare a component for example. I hope you already know all of that, as I just spent two
chapters on these things!
For example, if we simplify, the Race component could look like this:
import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RaceModel, RacesService } from './services';
import { PonyComponent } from './components';
@Component({
selector: 'ns-race',
templateUrl: './race.component.html',
standalone: true,
imports: [NgFor, PonyComponent]
})
export class RaceComponent {
race!: RaceModel;
constructor(racesService: RacesService) {
racesService.get().then(race => (this.race = race));
}
52
-- 61 of 353 --
}
And the template looks like this:
<div>
<h2>{{ race.name }}</h2>
<div>{{ race.status }}</div>
<div *ngFor="let pony of race.ponies">
<ns-pony [pony]="pony" />
</div>
</div>
If you already know AngularJS 1.x, the template should look familiar, with the same expression in
curly braces {{ }}, which will be evaluated and replaced by the corresponding value. Some things
have changed though: no more ng-repeat for example. I don’t want to go too deep for now, merely
just give you a feel of what the code looks like.
A component is a very isolated piece of your app. Your app is a component like the others.
You will group components in one or several coherent entities, called modules (Angular Modules,
not ES2015 Modules), or learn how to avoid them by making your components standalone.
You can also take available libraries of components from the community and just use them in your
app, and be able to enjoy their features.
Such libraries can offer UI components, or drag and drop capability, or validation for your forms, or
whatever you can think of.
In the next chapters, we are going to explore how to get started, how to build a small component,
your first application and the templating syntax.
There is another concept that is at the core, and that is Dependency injection (often called by its
little name, DI). It is a very powerful pattern, and you will quickly get used to it after reading the
dedicated chapter. It is especially useful to test your application, and I love doing tests, watching the
progress bar go all green in my IDE. It makes me feel I’m doing a good job. So there will be an entire
chapter on testing everything: your components, your services, your UI…
Angular still has the magic feeling it h

---

## Chapter 8. From zero to something

Let’s start by creating our first Angular app and our first component, with a minimum of tooling.
8.1. Node.js and NPM
Pretty much all the modern JavaScript tools are built for Node.js and NPM these days. You’ll have to
install Node.js and NPM on your system. The best way to do that depends on your operating system
- you can find more information on the official website. Make sure you have a recent enough
version of Node.js (by executing node --version).
8.2. Angular CLI
You could setup everything by yourself, starting with a TypeScript project, then install every
dependency needed, etc.
But in a real project, you’ll probably have to set up several other things too, like:
• some tests to check if we’re not breaking things
• maybe a linter to check your code
• maybe a CSS preprocessor
• a build tool, to orchestrate the various tasks (compile, test, package, etc.)
But it’s a bit cumbersome to setup everything yourself, especially when there are sooooo many
tools to learn first.
These past few years, a lot of small project generators have seen the light, pretty much all using the
great Yeoman. It used to be the case for AngularJS 1.x, and there were a few attempts for Angular
from the community.
But this time, the Google team has been working on this issue, and they have come up with
something: Angular CLI.
Angular CLI is a command line utility to easily quick start a project, already configured with
Webpack as a build tool (the popular kid these years), tests, packaging, etc.
The idea is not new, and is in fact borrowed from another popular framework: EmberJS and its
54
-- 63 of 353 --
popularly acclaimed ember-cli.
The tool is under continuous development, with a dedicated Google team working on it and making
it better and better. It is now the recommended and de facto standard way of creating and building
Angular apps. So let’s give it a try, and discover the ton of cool stuff packed into it!

If you want, you can follow our online exercise Getting Started ! It’s free and
part of our Pro Pack, where you’ll learn how to build a complete application step
by step. The first exercise is about getting everything up and running with Angular
CLI, and goes further than what we see in the chapter.
First let’s install Angular CLI, and generate a new application with the ng new command. If you want
to use exactly the same CLI version than we are (17.2.0), you can use npm install -g
@angular/cli@17.2.0 instead.
npm install -g @angular/cli
TODO: change the script below to generate a standalone application
ng new ponyracer --prefix ns --defaults --no-routing
This will create a project skeleton in a new directory called ponyracer. From this directory, you can
start your app with:
ng serve
This will start a small HTTP server locally, with a hot reload configuration. It means that every time
you modify and save a file, the server will rebuild the app, and the browser will reload it
immediately.
Tada! You have your first application up and running! 㢐

In Angula

---

## Chapter 9. The templating syntax

We’ve seen that a component needs to have a view. To define a view, you can define a template
inline or in a separate file. You’re probably familiar with a templating syntax, maybe even the one
from AngularJS 1.x. To simplify things, a template helps us to render HTML with some dynamic
parts depending on our data.
Angular has its own templating syntax that we need to learn before going further.
Let’s take a simple example, by modifying our first component:
import { Component } from '@angular/core';
@Component({
selector: 'ns-root',
template: '<h1>PonyRacer</h1>',
standalone: true
})
export class AppComponent {}
Now we want to display some dynamic data on this first page, maybe the number of users
registered into our app. Later we’ll see how to get data from a server, but for now we’ll say that this
number of users is directly hard-coded in our class:
@Component({
selector: 'ns-root',
template: '<h1>PonyRacer</h1>',
standalone: true
})
export class AppComponent {
numberOfUsers = 146;
}
Now, how do we change our template to display this variable? The answer is interpolation.
61
-- 70 of 353 --
9.1. Interpolation
Interpolation is a big word for a simple concept.
Quick example:
@Component({
selector: 'ns-root',
template: `
<h1>PonyRacer</h1>
<h2>{{ numberOfUsers }} users</h2>
`,
standalone: true
})
export class AppComponent {
numberOfUsers = 146;
}
We have an AppComponent component that will be activated every time Angular finds a <ns-root> tag.
The AppComponent class has a property, numberOfUsers. And the template has been augmented with an
<h2> tag, using the famous double curly braces (a.k.a. "mustaches") to indicate that an expression
has to be evaluated. This kind of templating is called interpolation.
We should now see in the browser:
<ns-root>
<h1>PonyRacer</h1>
<h2>146 users</h2>
</ns-root>
as {{ numberOfUsers }} will be replaced by its value. When Angular detects a <ns-root> element in
the page, it creates an instance of the AppComponent class, and this instance is the evaluation context
of the template’s expressions. Here the AppComponent instance sets the numberOfUsers property to
'146', so we have '146' displayed on screen.
The magic is that, whenever the value of numberOfUsers changes in our object, the template will be
automatically updated! That’s called 'change detection', and it’s one of the great features of Angular.
One important fact to remember, though: if we try to display a variable that is not initialized, then,
instead of displaying undefined, Angular is going to display an empty string. The same will happen
for a null variable.
Let’s say that, instead of a simple value, our first component has a more complex user object,
reflecting the current user.
@Component({
selector: 'ns-root',
62
-- 71 of 353 --
template: `
<h1>PonyRacer</h1>
<h2>Welcome {{ user.name }}</h2>
`,
standalone: true
})
export class AppComponent {
user = { name: 'Cédric' };
}
As you can see, we can interpolate more complex expressions, like accessing the pro

---

## Chapter 10. Building components and

directives
10.1. Introduction
So far, we have seen some small components. And of course, you can sense that, as they are the
backbone of our apps, they can be more complex than what we have seen. How do we pass data?
How do we manage the lifecycle of our component? What is best practice building these things?
Directives: What do they do? Do they do things? Let’s find out!
10.2. Directives
A directive is very much like a component, except it does not have a template. In fact, the Component
class inherits from the Directive class in the framework.
So it makes sense to start by studying directives, as everything we will see regarding directives also
applies to components. We will look into the configuration options you are most likely to use. The
more advanced ones are in a later chapter, ready for you when you master the basics.
As for a component, your directive will be annotated with a decorator, but instead of @Component, it
will be @Directive.
Directives are very small pieces. You can think of them as decorators for your HTML: they will
attach a behavior to elements in the DOM. You can have multiple directives on the same element.
A directive must have a CSS selector, which indicates to the framework where to activate it in our
template.
10.2.1. Selectors
Selectors can be of various types:
• an element, as it’s usually the case for components: footer.
• a class, not so frequent: .alert.
• an attribute, the most frequent for directives: [color].
• an attribute with a specific value: [color=red].
• a combination of the above: footer[color=red] matches an element named footer having an
attribute color whose value is red. [color],footer.alert matches any element having an
attribute color or (,) any element named footer with the CSS class alert. footer:not(.alert)
matches any element named footer that does not (:not()) have the CSS class alert.
For example, this is a very simple directive that does nothing but gets activated if the attribute
doNothing is on an element:
82
-- 91 of 353 --
@Directive({
selector: '[doNothing]',
standalone: true
})
export class DoNothingDirective {
constructor() {
console.log('Do nothing directive');
}
}
Such a directive will be activated in a component like this TestComponent:
@Component({
selector: 'ns-test',
template: '<div doNothing>Click me</div>',
standalone: true,
imports: [DoNothingDirective]
})
export class TestComponent {}
A more complex selector could be:
@Directive({
selector: 'div.loggable[logText]:not([notLoggable=true])',
standalone: true
})
export class ComplexSelectorDirective {
constructor() {
console.log('Complex selector directive');
}
}
Here it will match all div elements with a loggable class and a logText attribute that don’t have an
attribute notLoggable with a true value.
So this template will trigger the directive:
<div class="loggable" logText="text">Hello</div>
But this one will not:
<div class="loggable" logText="text" notLoggable="true">Hello</div>
Let’s be honest, though: if you are writin

---

## Pony

You remember the previous chapter on reactive programming? Cool, that’s going to be useful!
Custom events are emitted using an EventEmitter, and must be declared in the decorator, using the
outputs attribute. Like the inputs attribute, it accepts an array with the list of events you want your
directive/component to emit. And, like the inputs, it’s better to use the @Output() decorator.
Let’s say we want to emit an event called ponySelected. We have three things to do:
88
-- 97 of 353 --
• declare the output in the decorator
• create an EventEmitter (the Angular style guide recommends marking it readonly)
• emit an event when the pony is selected
@Component({
selector: 'ns-pony',
// the method `selectPony()` will be called on click
template: `<div (click)="selectPony()">{{ pony.name }}</div>`,
standalone: true
})
export class SelectablePonyComponent {
@Input({ required: true }) pony!: PonyModel;
// we declare the custom event as an output,
// the EventEmitter is used to emit the event
@Output() readonly ponySelected = new EventEmitter<PonyModel>();
/**
* Selects a pony when the component is clicked.
* Emits a custom event.
*/
selectPony(): void {
this.ponySelected.emit(this.pony);
}
}
To use it in the template:
<ns-pony [pony]="pony" (ponySelected)="betOnPony($event)" />
In the above example, every time the user clicks on the pony name, it emits an event ponySelected,
with the pony as a value (the parameter of the emit() method). The parent component is listening to
this event, as you can see in the template, and will call its betOnPony method with the value of the
event $event. $event is the syntax you have to use to access the event emitted: here, it will be the
emitted pony.
The parent component must then have a method betOnPony(), which will be called with the selected
pony:
betOnPony(pony: PonyModel): void {
// do something with the pony
}
If you wish, you can specify an event name different from the event emitter name, with the syntax
emitter: event:
89
-- 98 of 353 --
@Component({
selector: 'ns-pony',
template: `<div (click)="selectPony()">{{ pony.name }}</div>`,
standalone: true
})
export class OtherSelectablePonyComponent {
@Input({ required: true }) pony!: PonyModel;
// the emitter is called `emitter`
// and the event `ponySelected`
@Output('ponySelected') readonly emitter = new EventEmitter<PonyModel>();
selectPony(): void {
this.emitter.emit(this.pony);
}
}
10.2.4. Lifecycle
You may want your directive to react on a specific moment of its life.
This is quite advanced stuff, and you won’t need it every day, so I’ll go fast.
One thing is really important to understand though, and you’ll save quite some time if you do: the
inputs of a component are not evaluated yet in its constructor.
That means that the following component will not work:
@Directive({
selector: '[undefinedInputs]',
standalone: true
})
export class UndefinedInputsDirective {
@Input({ required: true }) pony!: string;
constructor() {
console.log(`inputs are ${this.pony}`);


---

## Chapter 11. Styling components and

encapsulation
Let’s stop to talk about styles and CSS for a minute. I know right? Why talk about freaking CSS?
Well because Angular is doing a lot of things for us behind the scenes.
As a Web developer, you often add CSS classes to elements. And the essence of CSS is that it will
cascade. That’s sometimes what you want (to change the font everywhere in your app for example),
or sometimes not. Imagine you want to add a style on a selected element in a list: you will usually
use a very narrow CSS selector in your CSS, like li.selected. Or an even narrower one, using
conventions like BEM, because you just want to style the selected element in a specific part of your
app.
That’s where Angular can be useful. The styles you define in a component (either with the styles
attribute, or in a dedicated CSS file for the component with styleUrl or styleUrls), are scoped by
Angular to this component and only this one. That’s called style encapsulation. How does it achieve
this?
It starts with you writing some styles. Then it depends on the strategy you select for the attribute
encapsulation of the component decorator. This attribute can have three different values:
• ViewEncapsulation.Emulated, which is the default one
• ViewEncapsulation.Native, which relies on Shadow DOM v0 (first version of the specification,
now deprecated)
• ViewEncapsulation.ShadowDom, which relies on Shadow DOM v1 (new option introduced in
Angular 6.1, to support the new Shadow DOM specification)
• ViewEncapsulation.None, which means you don’t want encapsulation
Each value will induce a different behavior of course, so let’s have a look. We’ll take a component
you’re starting to know well, i.e. our PonyComponent. This is a really simple version of the component,
only displaying the pony’s name in a div. For the purpose of the example, we add a CSS class red to
this div:
import { Component, ViewEncapsulation } from '@angular/core';
@Component({
selector: 'ns-pony',
template: `<div class="red">{{ name }}</div>`,
standalone: true,
styles: [
`
.red {
color: red;
}
`
],
95
-- 104 of 353 --
// that's the same as the default mode
encapsulation: ViewEncapsulation.Emulated
})
export class PonyComponent {
name = 'Rainbow Dash';
}
This class is then used in the styles of the component:
.red {
color: red;
}
As you can see, we want to display the pony’s name in a red font.
11.1. Shadow DOM strategy
If you use the ShadowDom option, you’re telling Angular to use the Shadow DOM of your browser to
take care of the encapsulation. The Shadow DOM is a part of the rather new Web Component
specification. This specification allows you to create elements in a special DOM, which is perfectly
encapsulated. With this strategy, if we look at the generated DOM with our browser’s inspector,
we’ll see:
<ns-pony>
#shadow-root (open)
<style>.red {color: red}</style>
<div class="red">Rainbow Dash</div>
</ns-pony>
You can spot the #shadow-root (open) that Chrome will display in the inspector: that’s because our
component

---

## Chapter 12. Pipes

12.1. Pied piper
Sometimes the raw data is not what we want to display in the view. We often want to transform it,
format it, limit its number, etc. AngularJS 1.x had a very handy feature to do this, very badly named
'filters'. Lessons have been learned and now these data transformers have a meaningful name!
Nah, I’m just kidding, they are called 'pipes' :).
Similarly as components, pipes can be standalone or not. The pipes that are provided by Angular
and that we will discuss here are all standalone, and are all part of CommonModule. So, to use them in
your components, you’ll have to add them, or the whole CommonModule, to their imports.
Let’s take an example and see how we can use pipes.
12.2. json
A pipe that is not really useful in a production app, but very handy when you are debugging your
app, is JsonPipe. Basically, this pipe applies JSON.stringify() to your data. If you have some data in
your component, an array of ponies called ponies, for example, and you want to quickly see what’s
inside, you may want to try something like:
<p>{{ ponies }}</p>
Tough luck, it’s going to display [object Object]…
But JsonPipe is here to rescue us. You can use it in your HTML, in any expression:
<p>{{ ponies | json }}</p>
And it will display the JSON representation of your object:
<p>[ { "name": "Rainbow Dash" }, { "name": "Pinkie Pie" } ]</p>
You can see where the name 'pipe' is coming from. To use a pipe, you have to add a pipe (|)
character after your data, and then the name of the pipe you want to use. The expression is
evaluated and the result goes through the pipe. It’s possible to chain several pipes, one after
another, like:
<p>{{ ponies | slice:0:2 | json }}</p>
We’ll come back to the slice pipe, but you can see that we are chaining the slice pipe and then the
json one.
99
-- 108 of 353 --
You can use it in an interpolation expression or in a property expression, but not in an event
statement.
<p [textContent]="ponies | json"></p>
12.3. slice
If you want to display just a part of a list, slice is your friend. It works like the slice method in
JavaScript, and takes two arguments: a start index and, optionally, an end index.
To pass an argument to a pipe, you have to add a colon :, then the first argument, then possibly,
another colon and the second argument etc.
<p>{{ ponies | slice:0:2 | json }}</p>
This example will display the first two elements of my list of ponies.
slice works with arrays and strings, so you can also truncate a string:
<p>{{ 'Ninja Squad' | slice:0:5 }}</p>
and that will display only 'Ninja'.
You can give the slice pipe only one index n, and it will take the elements from n to the end.
<p>{{ 'Ninja Squad' | slice:3 }}</p>
<!-- will display 'ja Squad' -->
If you give it a negative integer, it will take the n last elements.
<p>{{ 'Ninja Squad' | slice:-5 }}</p>
<!-- will display 'Squad' -->
As we saw, you can also give the pipe an end index: it will take the elements until this index. If this
index is negative, it will take the

---

## Chapter 13. Dependency injection

13.1. DI yourself
Dependency injection is a well-known design pattern. Let’s take a component of our application.
This component may need some features offered by other parts of our app (let’s say a service).
That’s what we call a dependency. Instead of letting the component create its dependencies, the
idea is to let the framework create them, and provide them to the component. That is known as
"inversion of control".
It has several interesting features:
• it allows easy development, by just saying what we want and where we want it.
• it allows easy testing, by replacing dependencies with mock ones.
• it allows easy configuration, by swapping implementation.
It’s a concept vastly used on the server side, but AngularJS 1.x was one of the first to use it on the
frontend side.
13.2. Easy to develop
To be able to use dependency injection, we need a few things:
• a way to register a dependency, to make it available for injection into another
component/service.
• a way to declare what dependencies are needed in the current component/service.
The framework does the rest of the job. When we declare a dependency in a component, it will look
into the registry if it can find it, will get the instance of the dependency or create one, and actually
inject it in our component.
A dependency can be a service provided by Angular, or a service we have written ourselves.
Let’s take an example with a LoggingService service. In development, we want to log to the
browser’s console. In production, we want to aggregate logs on a remote server. Let’s start by the
development version.
110
-- 119 of 353 --
export class LoggingService {
log(message: string): void {
console.log(message);
}
}
Using TypeScript, it’s easy to declare a dependency for our component or service - we just have to
use the type system.
Let’s say we want to write a RaceService that would use the LoggingService:
import { LoggingService } from './logging.service';
export class RaceService {
constructor(private loggingService: LoggingService) {}
}
Angular will fetch the LoggingService service for us and inject it into our constructor. When
RaceService is needed, the constructor will be called, and we will have a loggingService field
referencing the LoggingService service.
Now, we can add a method list() to our service, which will call our backend and log a trace using
the LoggingService service:
import { LoggingService } from './logging.service';
export class RaceService {
constructor(private loggingService: LoggingService) {}
list(): Array<RaceModel> {
this.loggingService.log('race-service: get races');
// ...
}
}
In Angular, all services must be decorated with @Injectable():
import { Injectable } from '@angular/core';
import { RaceModel } from './race.model';
import { LoggingService } from './logging.service';
@Injectable()
export class RaceService {
constructor(private loggingService: LoggingService) {}
111
-- 120 of 353 --
list(): Array<RaceModel> {
this.loggingService.log('race-service: get races');


---

## Application

AppComponent
RacesComponent
We have an application with a root component AppComponent, with a child component
RacesComponent.
When we bootstrap the app, we create the root injector for the application. Then, every component
will create its own injector, inheriting its parent one.
When you register a service using the recommended providedIn: 'root', or by using the providers
117
-- 126 of 353 --
of the module, you add these services to the root injector.
root injector 	(LoggingService, RaceService)
AppComponent injector
RacesComponent injector
It means that when we are declaring a dependency in a component, Angular will begin its search in
the current injector. If it finds the dependency, perfect, it returns it. If not, it will do the same in the
parent injector, and again, until it finds the dependency. If it doesn’t, it will throw an exception.
From this, we can deduce two things:
• the dependencies declared in the root injector are available for every component in the app. For
example, LoggingService and RaceService can be used everywhere.
• we can declare dependencies at another level than the module. How do we do this?
The @Component decorator can take another configuration option, called providers. This providers
attribute can take an array with a list of dependencies, as we did for the providers option of
bootstrapApplication().
We can imagine a RacesComponent that would declare its own LoggingService provider:
@Component({
selector: 'ns-races',
providers: [{ provide: LoggingService, useClass: LoggingAPIService }],
template: `<strong>Races</strong>`,
standalone: true
})
export class RacesComponent {
constructor(private loggingService: LoggingService) {
this.loggingService.log('RacesComponent created');
}
}
In this component, the provider with the token LoggingService will always give an instance of
LoggingAPIService, whatever was defined in the root injector. It’s really useful if you want to have a
different instance of a service for a given component, or if you want to have perfectly encapsulated
components that declare everything they need.
118
-- 127 of 353 --
 If you declare a dependency in the module of your app and in the providers
attribute of your component, there will be two distinct instances of this
dependency created and used!
Here we have:
root injector 	(LoggingService, RaceService)
AppComponent injector
RacesComponent injector 	(LoggingService 	LoggingAPIService)
The injection will then be resolved as:
Application 	LoggingService
AppComponent
RacesComponent 	LoggingAPIService
If the service contains state that belongs to a specific component instance, then it should be
provided by that component. For stateless services, or services that contain global state, they should
be provided in root.
13.6. DI without types
It’s also possible to not use a type for dependency injection, by using the @Inject() decorator. With
this decorator, you can then inject services but also simple values:
import { Inject, Injectable } from '@angula

---

## Chapter 14. Reactive Programming

14.1. Call me maybe
You may have heard of reactive or functional reactive programming lately. It has become quite
popular in several languages platforms, like in .Net with the Reactive Extensions library, which is
now available in pretty much every language (RxJava, RxJS, etc.).
Reactive programming is not really new. It is a way to build an app using events and reacting to
them (hence the name). The events can be composed, filtered, grouped, etc. using functions like map,
filter, etc. That’s why you sometimes find the terms "functional reactive programming". But, to be
accurate, reactive programming is not really functional programming, as it does not necessarily
include the concepts of immutability, the lack of side-effects etc. Reacting on events is something
you may have done:
• in the browser, when setting listeners to user events;
• on the backend side, reacting to events coming from a message bus.
In reactive programming, all data coming in will be in a stream. These streams can be listened to,
modified of course (filtered, merged…), and can even become a new stream that can be listened to.
This technique allows for fairly decoupled programs: you don’t have to worry much about the
consequences of your method call, you just raise an event, and every part of your app interested in
this business will react accordingly. And maybe one of these parts will raise an event also, etc.
Now, why am I telling you about that? What does it have to do with Angular?
Well, Angular is built using reactive programming, and we will use this technique for some parts as
well. Reacting on a HTTP request? Reactive programming. Spawning a custom event for our
component? Reactive programming. Dealing with value changes in our forms? Reactive
programming.
So let’s focus on this topic for a few minutes. Nothing hard to handle, but it’s better to have a clear
mind on this.
14.2. General principles
In reactive programming, everything is a stream. A stream is an ordered sequence of events. These
events represent values (look, another value!), errors (that went bad) or completion events (ok, I’m
done). All these are pushed from the data producer to the consumer. As a developer, your job will
be to subscribe to these streams, i.e. defining a listener capable of handling the three possibilities.
Such a listener is called an observer, and the stream, an observable. These terms were coined a long
time ago, as it is a well-known design pattern: the observer pattern.
They are different from promises, even if they look a bit similar, as they both handle asynchronous
values. But an observer is not a one-time thing like a promise: it will continue to listen until it
receives a 'completion' event.
For now, observables aren’t part of the official ECMAScript specification, but they might be part of a
123
-- 132 of 353 --
future version, as there is an effort being made to standardize it.
Observables are very close to arrays. An array is a collection of values, like an observable. An


---

## Chapter 15. Testing your app

15.1. The problem with troubleshooting is that trouble
shoots back
I love automated testing. My professional life revolves around the test progress bar going green in
my IDE, patting me in the back for doing my job properly. And I hope you do care about tests too, as
they are the only safety net we have when we write code. Nothing is more tedious than manually
testing code.
Angular does a great job to let us easily write tests. So did AngularJS 1.x, and that’s partly why I
loved using it. As in AngularJS 1.x, we can write two types of tests:
• unit tests
• end-to-end tests
The first ones are there to verify that a small unit of code (a component, a service, a pipe…) works
correctly in isolation, i.e. without considering its dependencies. Writing such a unit test requires
you to execute each of the component/service/pipe methods, and check that the outputs are what
we expected regarding the inputs we fed it. We can also check that the dependencies used by this
unit are correctly called: for example we can check that a service will do the correct HTTP request.
We can also write end-to-end tests. Their purpose is to emulate a real user interacting with your
app, by starting a real instance and then driving the browser to enter values in inputs, click on
buttons, etc. We’ll then check that the rendered page is in the state we expect, that the URL is
correct - whatever you can think of.
We’re going to cover all this, but let’s begin with the unit test part.
15.2. Unit tests
As we saw earlier, unit tests are there to check a small unit of code in isolation. These tests can only
verify a small part of your app works as intended, but they have several advantages:
• they are really fast - you can run several hundreds in a few seconds.
• they are a very efficient way to test (nearly) all your code, especially the tricky cases, which can
be hard to manually test in the real app.
One of the core concepts of unit testing is isolation: we don’t want our test to be biased by its
dependencies. So we usually use "mock" objects as dependencies. These are fake objects that we
create just for testing purposes.
To do this, we are going to rely on a few tools. First we need a library to write tests. One of the most
popular (if not the most popular) is Jasmine, so we are going to use it!
128
-- 137 of 353 --
15.2.1. Jasmine and Karma
Jasmine gives us a few methods to declare our tests:
• describe() declares a test suite (a group of tests)
• it() declares a test
• expect() declares an assertion
A basic JavaScript test using Jasmine looks like:
class Pony {
constructor(
public name: string,
public speed: number
) {}
isFasterThan(speed: number): boolean {
return this.speed > speed;
}
}
describe('My first test suite', () => {
it('should construct a Pony', () => {
const pony = new Pony('Rainbow Dash', 10);
expect(pony.name).toBe('Rainbow Dash');
expect(pony.speed).not.toBe(1);
expect(pony.isFasterThan(8)).toBe(true);
});
});
The expect() call can be chained with a lot of me

---

## Chapter 16. Send and receive data through

HTTP
It won’t come as a surprise, but a big part of our job consists in asking a backend server to send
data to our webapp, and then sending data back.
Usually this is done over HTTP, even though you have other alternatives nowadays, like
WebSockets. Angular provides an http module, but doesn’t force you to use it. If you prefer, you can
use your favorite library to send HTTP requests.
One of the possibilities is the fetch API, which is a standard API provided by the browsers. You can
perfectly build your app using fetch or another library. In fact, that’s what I used before the Http
part was done in Angular. It works great, with no need of special calls to make the framework
aware that we have received data and that it needs to run the change detection (unlike in
AngularJS 1.x, where you would have to call $scope.apply() if you were using an external library:
that’s the magic of Angular and its zones!).
But most Angular developers will rather use a service coming with Angular: HttpClient.
If you want to use it, you have to use the classes and functions from the @angular/common/http
package.
Why prefer this service over, say, fetch? The answer is simple: testing. As we will show, the Http
client allows you to mock your backend server and return fake responses. That’s really, really
useful.
A last thing before we dive into the API: the Http client heavily uses the reactive programming
paradigm. So if you skipped the Reactive Programming chapter, now might be a good time to go
back and read it ;).
16.1. Getting data (provideHttpClient)
The @angular/common/http module offers a service called HttpClient that you can inject in any
constructor. This service isn’t available by default in an Angular application. You need to configure
the application to use it.
To do this, we need to configure a provider when bootstrapping the application.
145
-- 154 of 353 --
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
bootstrapApplication(AppComponent, {
providers: [provideHttpClient()]
}).catch(err => console.error(err));
Once this is done, you can inject the HttpClient service wherever you need it:
@Component({
selector: 'ns-races',
template: `<h1>Races</h1>`,
standalone: true
})
export class RacesComponent {
constructor(private http: HttpClient) {}
}

In module-based applications, providing the HttpClient consists in adding
HttpClientModule to the imports of the root module.
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
imports: [BrowserModule, HttpClientModule],
declarations: [AppComponent],
bootstrap: [AppComponent]
})
export class AppModule {}
By default, the HttpClient service will do AJAX requests using XMLHttpRequest.
It offers several methods, matching the most common HTTP verbs:
• get
• post
• put
• delete
• patch
• head
• jsonp
146
-- 155 

---

## Chapter 17. Router

It is fairly common to want to map a URL to a state of the application. That makes sense: you want
your user to be able to bookmark a page and come back, and it provides a better experience
overall.
The piece in charge of doing this job is called a router, and every framework has its own (or several
ones).
The router in Angular has a simple goal: the creation of meaningful URLs reflecting the state of our
app, and each URL knowing what component should be initialized and inserted in the page. It will
execute all this without refreshing the page and without triggering a new request to our backend
server: this is the whole point of having a Single Page Application.
You probably know there was already a router in AngularJS 1.x, maintained by the core team, in a
module called ngRoute. You may also know that it was a very simplistic one: OK for simple
applications, but it was only allowing a single view per URL and no nesting was possible. It was a
bit limited when working on bigger apps, where you often have views inside views. There was a
very popular community module, called ui-router, that a lot of people were using and which was
doing a really great job.
The team behind Angular decided to bridge the gap and wrote a new module called RouterModule.
This module will hopefully fulfill all our needs!
Some new features are really interesting. So let’s go!
17.1. En route (provideRouter)
Let’s start using the router. It is an optional module, that is thus not included in the core
framework.
Similarly to the HTTP client, you have to provide the router in your application if you want to use it.
But for that, we need a configuration to define the mapping between URLs and components. We can
do this with a dedicated file, generally named like app.routes.ts, and containing an array
representing the configuration:
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
153
-- 162 of 353 --
import { RacesComponent } from './races/races.component';
export const routes: Routes = [
{ path: '', component: HomeComponent },
{ path: 'races', component: RacesComponent }
];
Then we need to provide the router in our application, initialized with the proper configuration:
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
bootstrapApplication(AppComponent, {
providers: [provideRouter(routes)]
});
As you can see, the Routes is an array of objects, each one being a… route. A route configuration is
usually a pair of properties:
• path: what URL will trigger the navigation
• component: which component will be initialized and inserted
You may be wondering where the component will be inserted in the page, and that’s a good
question. For a component to be included in our app, like the RacesComponent in the example above,
we must use a special tag in the template of the primary component: <router-outlet>.
154
-- 163 of 353 --
AppComponent

---

## Footer

This is, of course, an Angular directive, whose only job is to act as a placeholder for the template of
the component of the current route. Our app template would look like:
<header>
<nav>...</nav>
</header>
<main>
<router-outlet />
<!-- the component's template will be inserted here-->
</main>
<footer>made with &lt;3 by Ninja Squad</footer>
When we navigate, everything will stay (the header, main and footer here) and the component
matching the current route will be inserted just after the RouterOutlet directive.

All the directives of the router module, including RouterOutlet, are standalone
directives. In order to be able to use them in the template, the component must
have them in the imports of its decorator. Or you can add the whole RouterModule to
the imports to have all the router directives available in the component template.
155
-- 164 of 353 --
17.2. Navigation
How can we navigate between the different components? Well, you can manually type the URL and
reload the page, but that’s not very convenient. And we don’t want to use "classic" links, with <a
href="…"></a>. Indeed, clicking on that link makes the browser load the page at that URL, and
restart the whole Angular application. But the goal of Angular is to avoid such page reloads: we
want to create a Single Page Application. Of course, there is a built-in solution.
In a template, you can insert a link with the directive RouterLink pointing to the path you want to go
to. The RouterLink directive can receive a constant representing the path you want to go to or an
array of strings, representing the path and its params. For example in our RacesComponent template,
if we want to navigate to the HomeComponent, we can imagine something like:
<a routerLink="/">Home</a>
<!-- same as -->
<a [routerLink]="['/']">Home</a>
At runtime, the link href will be computed by the router and will point to /.

The leading slash in the path is necessary. If not included, RouterLink builds the
URL relatively to the current path (which can be useful with nested components,
as we’ll see later). Adding a slash indicates that the URL must be computed from
the application base URL.
The RouterLink directive can be used with the RouterLinkActive directive which can set a CSS class
automatically if the link points to the current route. This allows you, for example, to style a menu
item as selected when it points to the current page.
<a routerLink="/" routerLinkActive="selected-menu">Home</a>
We can even put a reference on this directive, to know if the route is active, and use it in the
template:
<a routerLink="/" routerLinkActive #route="routerLinkActive">Home {{ route.isActive ?
'(here)' : '' }}</a>
It’s also possible to navigate from the code, by using the Router service and its method navigate().
It’s often handy when you want to redirect your user after an action:
export class RacesComponent {
constructor(private router: Router) {}
saveAndMoveBackToHome(): void {
// ... save logic ...
this.router.navigate([

---

## Chapter 18. Forms

18.1. Forms, dear forms
Forms have always been extra polished in Angular. That’s one of the features that was the most
demoed in 1.x, and, as pretty much every app has forms, it won the hearts of a lot of developers.
Forms are hard: you have to validate the inputs of your user, display errors, you can have fields
required or not, or depending on another field, you want to react to some field changes, etc. We also
need to test these forms, and that was impossible to achieve with a unit-test in AngularJS 1.x. It was
only feasible with an end-to-end test, which can be slow.
In Angular, the same care has been applied to forms, and the framework gives us a nice way to
write our forms. In fact, it gives us several ways!
You can either write your form using only directives in your template: that’s the "template-driven"
way. From our experience, it shines when you have a simple form, with not much validation.
The other way is the "code-driven" way, where you will write a description of the form in your
component, then use directives to bind this form to the inputs/textareas/selects in your template.
It’s more verbose, but also more powerful, especially if you want to do add custom validation, or to
generate dynamic forms.
Let’s go through the same use case twice, using each way, and see the differences.
We are going to write a simple form, to be able to register new users in our awesome PonyRacer
app. We need a base component for each use case, so let’s begin with this:
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
selector: 'ns-register',
template: `
<h2>Sign up</h2>
<form></form>
`,
standalone: true,
170
-- 179 of 353 --
imports: [CommonModule]
})
export class RegisterFormComponent {}
Nothing fancy: a component with a simple template containing a form. In the next few minutes, we
will build a form allowing you to register a user with a username and a password.
For both methods, Angular will create a representation of our form.
In the "template-driven" way, it’s pretty much automatic: we just need to add the proper directives
in the template and the framework takes care of the form representation creation.
In the "code-driven" way, we create this form representation manually, and then bind the form
representation to the inputs using directives.
Behind the scenes, a form field, like an input or a select, is represented by a FormControl in Angular.
It is the smallest part of a form, and it encapsulates the state of the field and its value.
A FormControl has several attributes:
• valid: if the field is valid, regarding the requirements and validations applied on it.
• invalid: if the field is invalid, regarding the requirements and validations applied on it.
• errors: an object containing the field errors
• dirty: false until the user has modified its value.
• pristine: the opposite of dirty.
• touched: false until the user has entered it.
• untouched: the opposite of touched.
• value: the value of 

---

## Username is required

</div>
<div *ngIf="userForm.controls.username.dirty &&
userForm.controls.username.hasError('minlength')">
Username should be 3 characters min
</div>
</div>
<div>
<label>Password</label><input type="password" formControlName="password">
<div *ngIf="userForm.controls.password.dirty &&
userForm.controls.password.hasError('required')">

---

## Password is required

</div>
</div>
<button type="submit" [disabled]="userForm.invalid">Register</button>
</form>
184
-- 193 of 353 --
It’s a bit verbose, so you can create a reference for each control in your component:
@Component({
selector: 'ns-register',
templateUrl: './register-form.component.html',
standalone: true,
imports: [CommonModule, ReactiveFormsModule]
})
export class RegisterFormComponent {
usernameCtrl = this.fb.control('', Validators.required);
passwordCtrl = this.fb.control('', Validators.required);
userForm = this.fb.group({
username: this.usernameCtrl,
password: this.passwordCtrl
});
constructor(private fb: FormBuilder) {}
register(): void {
console.log(this.userForm.value);
}
}
And then use the references in your template:
<h2>Sign up</h2>
<form (ngSubmit)="register()" [formGroup]="userForm">
<div>
<label>Username</label><input formControlName="username">
<div *ngIf="usernameCtrl.dirty && usernameCtrl.hasError('required')">Username is
required</div>
<div *ngIf="usernameCtrl.dirty && usernameCtrl.hasError('minlength')">Username
should be 3 characters min</div>
</div>
<div>
<label>Password</label><input type="password" formControlName="password">
<div *ngIf="passwordCtrl.dirty && passwordCtrl.hasError('required')">Password is
required</div>
</div>
<button type="submit" [disabled]="userForm.invalid">Register</button>
</form>
18.5.2. Errors and submission in a template-driven form
In a template-driven form, we don’t have any field in our component referring to the FormGroup, but
we already declared a local variable in the template, referring to the NgForm object exported by the
form directive. Once again, this variable allows you to know the state of the form and accessing its
controls.
185
-- 194 of 353 --
<h2>Sign up</h2>
<form (ngSubmit)="register(userForm.value)" #userForm="ngForm">
<div>
<label>Username</label><input name="username" ngModel required>
</div>
<div>
<label>Password</label><input type="password" name="password" ngModel required>
</div>
<button type="submit" [disabled]="userForm.invalid">Register</button>
</form>
Now we need to display the errors of each field.
Like the form directive, each control exports its FormControl object, so we can create a local variable
to access the errors:
<h2>Sign up</h2>
<form (ngSubmit)="register(userForm.value)" #userForm="ngForm">
<div>
<label>Username</label><input name="username" ngModel required #username="ngModel
">
<div *ngIf="username.dirty && username.hasError('required')">Username is
required</div>
</div>
<div>
<label>Password</label><input type="password" name="password" ngModel required
#password="ngModel">
<div *ngIf="password.dirty && password.hasError('required')">Password is
required</div>
</div>
<button type="submit" [disabled]="userForm.invalid">Register</button>
</form>
Yay!
18.6. Add some style
Whatever way you choose to create your forms, Angular does another awesome job for us: it
automatically adds and removes CSS classes on each field (and on the form) to allow us to add some
vis

---

## Instead of

<input id="email" formControlName="email" class="form-control" type="email" />
<div
class="invalid-feedback"
*ngIf="form.controls.email.invalid && (f.submitted || form.controls.email.touched)"
>
<div *ngIf="form.controls.email.hasError('required')">The email is required</div>
<div *ngIf="form.controls.email.hasError('email')">The email must be a valid email
address</div>
</div>
the library allows you to write:
<input id="email" formControlName="email" class="form-control" type="email" />
<val-errors controlName="email">
<ng-template valError="required">The email is required</ng-template>
<ng-template valError="email">The email must be a valid email address</ng-template>
199
-- 208 of 353 --
</val-errors>
We can even do better by defining default messages once and for all:
<val-default-errors>
<ng-template valError="required" let-label> {{ label || 'This field' }} is required
</ng-template>
<ng-template valError="email" let-label> {{ label || 'This field' }} must be a valid
email address </ng-template>
<ng-template valError="min" let-error="error" let-label>
{{ label || 'This field' }} must be at least {{ error.min | number }}
</ng-template>
<!-- same for the other types of error -->
</val-default-errors>
And then simply use:
<input id="email" formControlName="email" class="form-control" type="email" />
<val-errors controlName="email" label="The email"></val-errors>
We provide an integration with Bootstrap and Material, to have error messages with a coherent
style if you use one of these CSS frameworks. Give it a try, you won’t regret it!
18.14. Going further: define custom form inputs with
ControlValueAccessor
HTML defines a large set of input types: text, password, checkbox, etc. But sometimes these
standard types don’t fit the bill.
Angular allows defining custom components, and it’s actually possible to make them act as Angular
form controls, i.e. bind them to a form control by applying the NgModel directive or the
FormControlName directive, and thus integrating them in a form.
The glue to implement this binding is an interface provided by Angular: ControlValueAccessor.
Fulfilling its contract is relatively straightforward. You have to
• accept the value of the FormControl and display it in your component (writeValue);
• notify Angular that the user changed the value somehow, by calling a provided callback
function (registerOnChange);
• notify Angular when the control should be considered as touched, by calling a provided
callback function (registerOnTouched);
• honor the request from Angular to disable or enable the control (setDisabledState).
We will illustrate all of this using a custom rating component. This component allows rating a
movie, for example, by giving it a note between 0 and 5. But instead of using a number or range input,
200
-- 209 of 353 --
we would like the user to do that by simply clicking one of 6 buttons (that would typically be
displayed as star icons, but we’ll leave that out in the following example).
Here’s the code

---

## Chapter 19. Zones and the Angular magic

Developing with AngularJS 1.X gave a "magic" feeling, and Angular still gives that same effect: you
type some value in an input and everything is magically updating all over the place.
I love magic, but I prefer to understand what’s going on with the tools I use. If you are like me, I
think this part will be interesting for you too: we are going to see how Angular works under the
hood!
But first, let’s start with how AngularJS 1.x works, which should be interesting, even you’ve never
used it.
All JavaScript frameworks work roughly the same way: they help the developer to react to
application events, to update the application state, and to refresh the DOM accordingly. But they
don’t all use the same way to achieve that goal.
EmberJS, for example, asks the developers to use setters to change the state of the objects, in order
for the framework to be able to intercept the calls to these setters. That’s what allows it to know
which changes have been applied to the model, and thus to update the DOM accordingly.
React, on the other hand, chose to recompute the DOM after each change. But since modifying the
whole DOM is a costly operation, it starts by applying the changes to a virtual DOM, and then only
applies the changes between the virtual DOM and the actual DOM.
Angular doesn’t use any setter, and doesn’t use any virtual DOM either. So, how does it know what
to change in the DOM?
19.1. AngularJS 1.x and the digest cycle
The first step is to detect changes in the model. A change is always triggered by an event, coming
either from the user directly (for example, a button click or an input in a form), or from a "system"
event (an HTTP response, an asynchronous method execution after a timeout, etc.).
So, how does AngularJS 1.x know that an event has happened? That part is actually pretty simple: it
forces us to use its directives, for example ng-click to react to a click event, or ng-model to observe
changes to an input. It also forces us to use its services, for example $http for HTTP requests or
$timeout to execute tasks asynchronously.
Using these directives and services allows the framework to be well informed about any event that
has happened. That’s the first part of the magic! And that’s this first part which triggers the second
one: the framework now has to analyze the changes made to the model, in order to decide which
part of the DOM must be updated (and how).
To do that, in version 1.x, the framework maintains a list of watchers, all observing and reacting to
changes in a specific part of the model. To simplify, a watcher is created for every dynamic
expression used in the HTML templates. This can lead to several hundreds of watchers in a page.
These watchers are central to AngularJS 1.x: they are the memory of the framework, and are here
to remember the state of the app.
204
-- 213 of 353 --
Every time the framework detects an event (a user typing something in an input with an ng-model,
an HTTP response, a timeout execution, etc.), it trig

---

## Chapter 20. Angular compilation: Just in

Time vs Ahead of Time
20.1. Code generation
In the previous chapter, we talked briefly about how the framework generates a change detection
function for each component.
This is a very interesting and particular point in Angular, which you don’t see in other frameworks:
Angular, at the start of your application, will compile your templates and generate dynamic code for
each component.
The HTML you write in your templates is never read by the browser directly. Instead, Angular
generates a component definition for each component that represents exactly what you wrote in
your template. This component definition is inlined in a static field of your component.
Let’s take an example, with our well-known PonyComponent. The template is mainly an image with a
bound source property, and a figcaption element with an interpolation.
<figure>
<img [src]="getPonyImageUrl()">
<figcaption>{{ ponyModel.name }}</figcaption>
</figure>
When Angular compiles this, it first starts by parsing the template to generate what is called an
Abstract Syntax Tree (AST). An AST is a tree representing the structure of the template, commonly
used by compilers to represent such things. It is the result of the syntax analysis step of the
compilation. This AST will then be used to generate the dynamic JavaScript code, a "component
definition" per component, inlined in a static field of our component class. A component definition
contains several things, and among them the template, represented by a function.
elementStart(0, 'figure');
{
element(1, 'img');
}
{
elementStart(2, 'figcaption');
text(3);
elementEnd();
}
elementEnd();
 This chapter describes the code generated by the compiler/renderer introduced in
Angular 8.0 and called "Ivy". We wrote a detailed blog post about Ivy if you want to
learn more. This renderer is the third iteration, as the initial renderer has already
213
-- 222 of 353 --
been rewritten in Angular 4.0. These iterations have brought either better
performance or bundle size improvements or both, while keeping the same
template syntax, allowing a backward compatibility with existing code, and
allowing us developers to migrate very easily. Most people haven’t noticed that the
renderer changed in Angular 4.0 for example.
With this function, Angular is able to create the DOM corresponding to our PonyComponent: it
basically appends the corresponding HTMLElement to the DOM, for every element.
But how does it handle the change detection? The template function is in fact a little bit longer:
template: (renderFlags: RenderFlags, component: PonyComponent) => {
if (renderFlags & RenderFlags.Create) {
elementStart(0, 'figure');
{
element(1, 'img');
}
{
elementStart(2, 'figcaption');
text(3);
elementEnd();
}
elementEnd();
}
if (renderFlags & RenderFlags.Update) {
advance();
property('src', component.getPonyImageUrl());
advance(2);
textInterpolate(component.ponyModel.name);
}
},
This template function has two parts:
• the creation of the component that we explained above
• t

---

## Chapter 21. Advanced observables

I must confess that I made a mistake: I under-estimated the value of RxJS and Observables. And
that’s a bit sad because I did the same with AngularJS 1.x and Promises. Promises were extremely
useful in AngularJS 1.x - once you get them, you can handle any asynchronous part of your
application elegantly. But it took some time to get there, and there were traps to avoid (check the
blog post we wrote about Traps, anti-patterns and tips about AngularJS promises, if you want to
learn more about that).
Angular relies on RxJS, and exposes Observables in a few APIs (Http, Forms, Router…). After coding
for a while with RxJS, I think this ebook deserves a more "advanced" chapter about Observables,
their creation, subscription, operators, possible uses with Angular, etc. I hope this will give you a
few hints or spark the curiosity to dive deeper into it, because RxJS will play a big role in how you
orchestrate your app, and it can do a wonderful job in simplifying your life.
21.1. Subscribe, unsubscribe and async pipe
To sum up what we learned in the chapter about Reactive Programming, an Observable represents
a sequence of events to which we can subscribe.
This stream of events can happen at any time, and there can be only one event or ten thousands of
them. But there is a distinction to understand between two kinds of Observables: cold ones and hot
ones.
Cold observables will only emit events when they are subscribed to. You can think of it as watching
a Youtube video: the video will only stream when you hit the "Play" button. For example, the
observables returned by the HttpClient class are cold observables: they will only trigger the request
when you subscribe.
Hot observables are slightly different: they emit events from the moment they are created. You can
think of them as live television: you turn on the TV and you land in the middle of a show, that could
have started minutes or hours ago. The observable representing the valueChanges in a FormControl is
also a hot observable. You will not receive the values emitted before the moment you subscribed,
only the value from the moment you subscribe.
When you subscribe to an observable, you can pass three possible parameters:
• a function to handle the next event
• a function to handle an error
• a function to handle the completion
The first one is pretty obvious. The observable is a stream of events and you define what to do if an
event occurs.
The second one allows you to handle a potential error. It’s not always necessary to pass this
function. If the stream of events represents a stream of clicks, there are no possible errors that can
occur, even if your user broke his finger (this joke is not mine, it’s from a great presentation from
André Staltz on RxJS at NgEurope 2016). But in most cases, it is very useful to define an error
217
-- 226 of 353 --
handler. It allows you to define what to do if you get an error response from the HTTP backend, for
example.
One thing to understand about this: an error is

---

## Chapter 22. Advanced components and

directives
22.1. Input transforms
Since Angular v16.1, it is possible to transform an input with the transform option of the @Input
decorator.
It allows transforming the value passed to the input before it is assigned to the property. The
transform option requires a function that takes the value as input and returns the transformed
value. As the most common use cases are to transform a string to a number or a boolean, Angular
provides two built-in functions to do that: numberAttribute and booleanAttribute in @angular/core.
Here is an example of using booleanAttribute:
@Input({ transform: booleanAttribute }) disabled = false;
This will transform the value passed to the input to a boolean so that the following code will work:
<ns-button disabled />
<ns-button disabled="true" />
<!-- Before, only the following was properly working -->
<ns-button [disabled]="true" />
The numberAttribute function works the same way but transforms the value to a number.
@Input({ transform: numberAttribute }) value = 0;
It also allows to define a fallback value, in case the input is not a proper number (default is NaN):
@Input({ transform: (value: unknown) => numberAttribute(value, 42) }) value = 0;
This can then be used like this:
<ns-value value="42" />
<ns-value value="not a number" />
<!-- Before, only the following was properly working -->
<ns-value [value]="42" />
228
-- 237 of 353 --
22.2. View queries: ViewChild
In the Template chapter, we talked about a nice feature called "local variables", allowing you to get
a reference to a DOM element in the template. For example, you can give the focus to an input with
a button easily:
<input #myInput />
<button (click)="myInput.focus()">Focus</button>
We also saw this same feature in the Forms chapter for example, when we wanted to grab a
reference to a specific directive:
<input name="login" [(ngModel)]="user.login" required #loginCtrl="ngModel" />
<div *ngIf="loginCtrl.dirty && loginCtrl.hasError('required')">The login field is
required</div>
What if we need to have these references in our component code, and not only in the template?
That is where "view queries" enter the scene and can save the day!
For example, you may want to focus an input as soon as your component is displayed. To do so, we
need to grab a reference to the input, using the ViewChild decorator.
@Component({
selector: 'ns-login',
template: `<input #loginInput name="login" [(ngModel)]="credentials.login" required
/>`,
standalone: true,
imports: [FormsModule]
})
export class LoginComponent implements AfterViewInit {
credentials = { login: '' };
@ViewChild('loginInput') loginInput!: ElementRef<HTMLInputElement>;
ngAfterViewInit(): void {
this.loginInput.nativeElement.focus();
}
}
We declare a field called loginInput, and we decorate it with ViewChild. This decorator needs a
selector as parameter: here we use the local variable declared in our template. The decorator
indicates to the framework that it needs to query the template to find an element with t

---

## Chapter 23. Angular modules

Until version 14 of Angular, applications were organized into Angular modules. Many existing
applications probably still are. But even in newer applications using standalone components, pipes
and directives, the concept of Angular module, or NgModule for short, is still present: you can, or
even must, import some of them (CommonModule, ReactiveFormsModule for example) in your
components.
Maybe you’re reading this book in order to embark on an existing project where Angular modules
are still in use. This chapter will explain their principles, rules, and usages. We encourage you to
use standalone components in your new applications though, and even to migrate your NgModule-
based applications to standalone. The Angular CLI provides commands to help you automate most
of it.
23.1. A compilation unit
In the simplest Angular application still using modules, you’ll find one Angular module, the root
module, conventionally named AppModule. This module typically looks like this:
@NgModule({
declarations: [AppComponent, HomeComponent, AboutComponent, PonyComponent],
imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(APP_ROUTES)],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule {}
What can we say about this module?
The declarations property declares the components, pipes and directives that are part of this
module. Those are not standalone. If they were standalone, then they would have to be listed in the
imports property instead.

the only difference between a standalone component (or pipe, or directive) and a
"normal", non-standalone component is that non-standalone components don’t
have standalone: true in their decorator, and can’t have imports in their decorator.
The module that they belong to decides what they can use in their template.
An Angular module defines a compilation unit. Since they are part of the same module, all these
components can use each other. For example, both HomeComponent and AboutComponent can use the
PonyComponent in their template.
The imports property defines the list of other Angular modules, as well as standalone components,
pipes and directives, that are imported into this module. Since we import RouterModule, the
components can also use the directives of the router module, like routerLink. Since we don’t import
ReactiveFormsModule, they cannot use the directives from that module, like formGroup. Importing the
HttpClientModule allows importing the provider for the HttpClient service, which means it can be
244
-- 253 of 353 --
injected in any service of the application. Importing BrowserModule, which transitively imports and
exports CommonModule is what makes it possible to use the common directives and pipes (*ngIf,
ngClass, date etc.) in the components of this module.
The providers array defines providers, the same way as they are defined when calling the
bootstrapApplication() function in standalone applications. Since most services use providedIn:
'root', you won’t need to list them there.

---

## 2. Functional modules, often lazy-loaded, corresponding to a set of routes of the application

Let’s start with reusable modules. Suppose the PonyComponent must be used in RacesComponent which
is declared in an additional functional module RacesModule. As we’ve seen, in order to make it
available to RacesComponent, we should add PonyComponent in the declarations of RacesModule.
Angular, however, won’t let you do that: a component may be declared in only one module of the
application, and it’s already declared in AppModule (which also needs it for its HomeComponent).
The solution is to extract PonyComponent in yet another module, sometimes called a shared module:
@NgModule({
declarations: [PonyComponent],
imports: [CommonModule],
exports: [PonyComponent]
})
export class PonyModule {}
This module declares the PonyComponent that it contains. It imports CommonModule so that
PonyComponent can use the common Angular directives. And most importantly, its exports property
also contains PonyComponent. This is what allows other modules to use the PonyComponent by
importing the PonyModule. That’s what AppModule and RacesModule will thus do in order to be able to
use PonyComponent:
@NgModule({
declarations: [AppComponent, HomeComponent, AboutComponent],
imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(APP_ROUTES),
PonyModule],
providers: [],
bootstrap: [AppComponent]
})
245
-- 254 of 353 --
export class AppModule {}
The temptation is big to put all the reusable components in a single SharedModule. As the application
grows, however, this module will become huge. So a better option is to make tiny reusable modules,
so that other modules can import only what they actually need. Such tiny reusable modules,
exporting only one component, are known as SCAMs (Single Component Angular Modules). The
boilerplate that these modules represents is one of the reasons why Angular decided to introduce
standalone components: you can see them as a component and its own module.
23.3. Functional, routed modules
Functional modules are not much different from reusable modules. The components that they
declare, however, are not supposed to be used inside components of other modules. So they’re
declared, but not exported.
@NgModule({
declarations: [RacesComponent],
imports: [CommonModule, PonyModule, RouterModule.forChild(RACES_ROUTES)]
})
export class RacesModule {}
The root module can import the additional functional modules, but then they would be bundled as
part of the main bundle, and thus loaded eagerly, at startup. Most of the times, we want to lazily
load the functional modules. The way to do that is not very different from what we did to lazy load
routes using standalone components. Instead of lazy-loading routes, we will lazy-load the
functional module itself. For example, in the application routes:
{
path: 'races',
loadChildren: () => import('./races/races.module').then(m => m.RacesModule)
}
Hopefully now, you’re able to understand how an application is organized in Angular modules. The
rules are not that hard to grasp, but as you’ve seen, Angular mo

---

## Chapter 24. Internationalization

Alors comme ça, tu veux internationaliser ton application?
OK, don’t worry if you didn’t understand anything of this French introduction. Your role as a
developer, fortunately, is not to translate your application into French, Spanish, or whatever other
language. What you can do, though, is to allow this to happen. This chapter explains how to achieve
that.
24.1. The locale
We already mentioned internationalization before, in the chapter about pipes. Four of the built-in
Angular pipes deal with internationalization. Those are the number, percent, currency and date pipes.
Until Angular 5, they used to rely on the standard JavaScript Internationalization API, which is
supposed to be provided by the browser. But as that was not always the case, and there were
numerous bugs and inconsistencies between browsers, the pipes have been completely overhauled
in Angular 5.0.
What we don’t know yet is how these three pipes decide how to format the numbers and dates.
Should they use a dot or a comma as decimal separator? Should they use January or Janvier for the
first month of the year? You might think that this is decided based on the preferred language
configured in the browser, but actually, it’s not. This depends on an injectable value named
LOCALE_ID. And the default value of LOCALE_ID is 'en-US'.
Here is an example showing how to get the value of LOCALE_ID. As you can see, it’s a simple string
value. To inject it into your components or services, you can’t just rely on its type. You need to tell
Angular which token identifies the value, using @Inject(LOCALE_ID). This can be useful if your logic
needs to know which locale the application is using.
@Component({
selector: 'ns-locale',
template: `
<p>The locale is {{ locale }}</p>
<!-- will display 'en-US' -->
<p>{{ 1234.56 | number }}</p>
<!-- will display '1,234.56' -->
247
-- 256 of 353 --
`,
standalone: true,
imports: [DecimalPipe]
})
class DefaultLocaleComponent {
constructor(@Inject(LOCALE_ID) public locale: string) {}
}
This is good. But how can we change the locale? Actually, you can’t. The locale is a constant, that
you can’t change once the application has started. But that doesn’t mean you can’t set it to another
value before the application starts. This is possible, simply by providing another value for the
LOCALE_ID token in the providers of the application. Beware though: this changes the locale, but
another step is required to bundle the locale-specific data (month translations, number formatting
rules, etc.) with your application. Angular only bundles the en-US data by default.
import '@angular/common/locales/global/fr';
Here’s an example showing its effect on our component:
bootstrapApplication(AppComponent, {
providers: [
{ provide: LOCALE_ID, useValue: 'fr-FR' }
]
});
@Component({
selector: 'ns-locale',
template: `
<p>The locale is {{ locale }}</p>
<!-- will display 'fr-FR' -->
<p>{{ 1234.56 | number }}</p>
<!-- will display '1 234,56' -->
`,
standalone: true,
imports: [DecimalPipe]
})
e

---

## 4. You build your application by providing the locale ID ('fr' for example) and the file containing

the translations (messages.fr.xlf). The angular compiler and the CLI replace all the i18n-marked
parts of the templates with the translations found in the file, and configures your application to
use the provided locale ID.
Let’s examine each of those steps in more details.
24.4.1. Marking text with i18n and extracting
Let’s start with an example template:
<h1>Welcome to Ponyracer</h1>
<p>Welcome to Ponyracer {{ user.firstName }} {{ user.lastName }}!</p>
<img src="/img/pony.gif" alt="running pony" title="Ponies are cool, aren't they?" />
Let's start playing.
There are 5 text snippets that need to be translated in this template. Of course, you could imagine
translating everything at once, but in a more realistic example, that would expose a lot of HTML
boilerplate to the translators, and you don’t want them to translate everything again when the
HTML structure changes. So you should translate the 5 snippets separately.
One of them, the body of the h1 element, is purely static text. One of them is a text containing two
interpolated expressions. Two are attributes of an HTML element. The last one is static text that is
not embedded in any element.
Here’s how you would mark them. Let’s start with the first, simplest one:
<h1 i18n>Welcome to Ponyracer</h1>
Now let’s extract our very first messages file, using the extract-i18n command provided by Angular
CLI:
ng extract-i18n --output-path src/locale/
251
-- 260 of 353 --
This will create the file messages.xlf in the src/locale directory. Here’s what it contains:
<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
<file source-language="en-US" datatype="plaintext" original="ng2.template">
<body>
<trans-unit id="7627914200888412251" datatype="html">
<source>Welcome to Ponyracer</source>
<context-group purpose="location">
<context context-type="sourcefile">src/app/app.component.html</context>
<context context-type="linenumber">2,3</context>
</context-group>
</trans-unit>
</body>
</file>
</xliff>
As you can see, it generates a trans-unit containing, as the source, our static text. The role of the
French translator will be to provide a messages.fr.xlf file looking like the following:
<?xml version="1.0" encoding="UTF-8" ?>
<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">
<file source-language="en" datatype="plaintext" original="ng2.template" target-
language="fr">
<body>
<trans-unit id="7627914200888412251" datatype="html">
<source>Welcome to Ponyracer</source>
<target>Bienvenue dans Ponyracer</target>
</trans-unit>
</body>
</file>
</xliff>
This is easy enough, because the source message is easy to understand. You don’t need too much
context to know what it is about, and how to translate it. But this way of doing things has a big
disadvantage. If you change the source code of the template and introduce meaningless white
spaces for example, or a dot at the end of the title, here’s what happens when extracting the file
again:
<h1 i18n>

---

## Chapter 25. Performances

 Be careful with premature optimization. Always measure before and after. Beware
of the benchmarks you find on the internets: it’s pretty easy to make them say
what the authors want.
Performances can mean a lot of things: speed, CPU usage (battery consumption), memory
pressure… Everything is not important for everybody: you have different needs if you are
programming for a mobile website, an e-commerce platform, or a classic CRUD application.
Performances can also be split into different categories, that, once more, won’t all matter to you:
first load, reload, and runtime performances.
First load is when you open an application for the first time. Reload is when you come back to that
application. Runtime performances is what happens when the application is running. Some of the
following recommendations are very generic, and could be applied to any framework. We wrote
them down because we think it’s worth knowing. And because when you talk about performances,
the framework is sometimes the bottleneck, but really (really) often not.
25.1. First load
When you load a modern Web application in your browser, a few things happen. First, the
index.html is loaded and parsed by the browser. Then the JS scripts and other assets referenced are
fetched. When one of the assets is received, the browser parses it, and executes it if it is a JS file.
25.1.1. Asset sizes
So the first tip is very obvious: be careful with your asset sizes!
The assets loading phase depends on how many assets you want to load. A lot will be slow. Big ones
will be slow. Especially if the network is not that good, which happens more often than you think:
you might test your application on an optical fiber connection, but some of your actual users might
be in the middle of nowhere, using slow 3G. Here is what you can do.
25.1.2. Bundle your application
When you write your Angular application, you have imports all over the place, and your code is
split across hundreds of files. But you don’t want your users to load hundreds of files! So before
shipping your application, you want to make a "bundle": group all the JavaScript files into one file.
Webpack's job is to take all your JavaScript files (and CSS, and template HTML files) and build
bundles. It’s not an easy tool to master, but the Angular CLI does a pretty good job at hiding its
complexity. If you don’t use the CLI, you can build your application with Webpack, or you can pick
another tool that may produce even better results (like Rollup for example). But be warned that this
requires quite a lot of expertise (and work) to not mess things up, just to save a few extra kilobytes.
I would recommend staying with the CLI. The team working on it is doing a very good job keeping
up with the latest Angular, TypeScript and Webpack releases.
261
-- 270 of 353 --
More than that, they built some tools to decrease the bundling size. For example, they wrote a
plugin that goes through the generated JavaScript, and adds specific comments to help Te

---

## Chapter 26. Signals

The Angular team has been working on a different way to handle reactivity in applications for the
past year. The result of their work is a new concept in Angular called Signals.
Let’s see what they are, how they work, how they interoperate with RxJS, and what they’ll change
for Angular developers.
26.1. The reasons behind Signals
Signals are a concept used in many other frameworks, like SolidJS, Vue, Preact, and even the
venerable KnockoutJS. The idea is to offer a few primitives to define reactive state in applications
and to allow the framework to know which components are impacted by a change, rather than
having to detect changes on the whole tree of components.
This will be a significant change to how Angular works, as it currently relies on zone.js to detect
changes in the whole tree of components by default. Instead, with signals, the framework will only
dirty-check the components that are impacted by a change which of course makes the re-rendering
process more efficient.
This opens the door to zoneless applications, i.e. applications where Angular applications don’t
need to include Zone.js (which makes them lighter), don’t have to patch all the browser APIs (which
makes them start faster) and smarter in their change detection (to only check the components
impacted by a change).
Signals were released in Angular v16, as a developer preview API, and became stable in v17. But
this API is only a small part of the changes that will come with signals. In the future, signal-based
components with inputs and queries based on signals, and different lifecycle hooks, will be added
to Angular. Other APIs like the router parameters and form control values and status, etc. should
also be affected.
26.2. Signals API
A signal is a function that holds a value that can change over time. To create a signal, Angular offers
a signal() function in @angular/core:
import { signal } from '@angular/core';
You can then create a signal with it:
// define a signal
const count = signal(0);
The type of count is WritableSignal<number>, which is a function that returns a number.
When you want to get the value of a signal, you have to call the created signal:
286
-- 295 of 353 --
// get the value of the signal
const value = count();
This can be done both in TypeScript code and in HTML templates:
<div>{{ count() }}</div>
You can also set the value of a signal:
// set the value of the signal
count.set(1);
Or update it:
// update the value of the signal, based on the current value
count.update(value => value + 1);
You can also create a readonly signal, that can’t be updated, with asReadonly:
const readonlyCount = count.asReadonly();
Once you have defined signals, you can define computed values that derive from them:
const double = computed(() => count() * 2);
Computed values are automatically computed when one of the signals they depend on changes.
count.set(2);
console.log(double()); // logs 4
Note that they are lazily computed and only re-computed when one of the signals they

---

## Usage

<ns-tabs>
<ns-tab title="Races" />
<ns-tab title="About" />
</ns-tabs>
We can build a TabDirective to represent a tab:
tab.directive.ts
@Directive({
selector: 'ns-tab',
standalone: true
})
export class TabDirective {
title = input.required<string>();
}
then build the TabsComponent with contentChildren to query the directives:
tabs.component.ts
@Component({
selector: 'ns-tabs',
template: `
<ul class="nav nav-tabs">
@for (tab of tabs(); track tab) {
<li class="nav-item">
<a class="nav-link">{{ tab.title() }}</a>
</li>
}
</ul>
`,
standalone: true
})
export class TabsComponent {
tabs = contentChildren(TabDirective);
// ^? Signal<ReadonlyArray<TabDirective>>
}
As for the @ViewChild/@ViewChildren decorators, we can specify the descendants option to query the
tab directives that are not direct children of TabsComponent:
299
-- 308 of 353 --
tabs.component.ts
tabs = contentChildren(TabDirective, { descendants: true });
// ^? Signal<ReadonlyArray<TabDirective>>

---

## Usage

<ns-tabs>
<div>
<ns-tab title="Races" />
</div>
<ns-tabgroup>
<ns-tab title="About" />
</ns-tabgroup>
</ns-tabs>
As viewChild, contentChild can be required.
26.11. model()
Signals also allow a fresh take on existing patterns. As you probably know, Angular allows a
"banana in a box" syntax for two-way binding. This is mostly used with ngModel to bind a form
control to a component property:
login.component.html
<input name="login" [(ngModel)]="user.login" />
Under the hood, this is because the ngModel directive has a ngModel input and a ngModelChange output.
So the banana in a box syntax is just syntactic sugar for the following:
login.component.html
<input name="login" [ngModel]="user.login" (ngModelChange)="user.login = $event" />
The syntax is, in fact, general and can be used with any component or directive that has an input
named something and an output named somethingChange.
You can leverage this in your own components and directives, for example to build a pagination
component:
pagination.component.ts
@Input({ required: true }) collectionSize!: number;
@Input({ required: true }) pageSize!: number;
@Input({ required: true }) page!: number;
@Output() pageChange = new EventEmitter<number>();
300
-- 309 of 353 --
pages: Array<number> = [];
ngOnChanges(): void {
this.pages = this.computePages();
}
goToPage(page: number) {
this.pageChange.emit(page);
}
private computePages() {
return Array.from({ length: Math.ceil(this.collectionSize / this.pageSize) }, (_, i)
=> i + 1);
}
The component receives the collection, the page size, and the current page as inputs, and emits the
new page when the user clicks on a button.
Every time an input changes, the component recomputes the buttons to display. The template uses a
for loop to display the buttons:
pagination.component.html
@for (pageNumber of pages; track pageNumber) {
<button [class.active]="page === pageNumber" (click)="goToPage(pageNumber)">
{{ pageNumber }}
</button>
}
The component can then be used like:

---

## Usage

<ns-pagination [(page)]="page" [collectionSize]="collectionSize" [pageSize]=
"pageSize"></ns-pagination>
Note that, in the parent component, page can be a number, but it can also be a
WritableSignal<number>. In the latter case, the framework will automatically pass the value of the
signal as input to the pagination component, and will set the signal value to the new page when the
pagination component emits one.
The pagination component can be rewritten using signals, and the brand new model() function:
pagination.component.ts
collectionSize = input.required<number>();
pageSize = input.required<number>();
pages = computed(() => this.computePages());
301
-- 310 of 353 --
page = model.required<number>();
// ^? ModelSignal<number>;
goToPage(page: number) {
this.page.set(page);
}
private computePages() {
return Array.from({ length: Math.ceil(this.collectionSize() / this.pageSize()) }, (
_, i) => i + 1);
}
As you can see, a model() function is used to define the input/output pair, and the output emission is
done using the set() method of the signal.
A model can be required, or can have a default value, or can be aliased, as we saw for inputs. It can’t
be transformed though. If you use an alias, the output will be aliased as well.
If you try to access the value of the model before it has been set, for example in the constructor of
the component, then you’ll have a runtime error:
'NG0952: Model is required but no value is available yet. Find more at
https://angular.io/errors/NG0952'
26.12. Conclusion
It’s anyway quite interesting how frameworks inspire each other, with Angular taking inspiration
from Vue and SolidJS for the reactivity part, whereas other frameworks are increasingly adopting
the template compilation approach of Angular, with no Virtual DOM needed at runtime.
The future of Angular is exciting!
 Try our exercise Signals to learn how to use a signal to share state in your
application.
302
-- 311 of 353 --

---

## Chapter 27. Control flow template syntax

Angular v17 introduces a new "developer preview" feature called "control flow syntax". This
feature allows you to use a new template syntax to write control flow statements, like if/else, for,
and switch, instead of using the built-in structural directives (*ngIf, *ngFor, and *ngSwitch).
To understand why this was introduced, let’s see how structural directives work in Angular.
27.1. Structural directives under the hood
Structural directives are directives that change the structure of the DOM by adding, removing, or
manipulating elements. They are easy to recognize in Angular because they begin with an asterisk
*.
But how do they really work?
Let’s take a simple template with ngIf and ngFor directives as an example:
<h1>Ninja Squad</h1>
<ul *ngIf="condition">
<li *ngFor="let user of users">{{ user.name }}</li>
</ul>
If you read our chapter about the Angular compiler, you know that the framework generates
JavaScript code from this template. And maybe you imagine that *ngIf gets converted to a
JavaScript if and *ngFor to a for loop like:
createElement('h1');
if (condition) {
createElement('ul');
for (user of users) {
createElement('li');
}
}
But Angular does not work exactly like that: the framework decomposes the component’s template
into "views". A view is a fragment of the template that has static HTML content. It can have
dynamic attributes and texts, but the HTML elements are stable.
So our example generates in fact three views, corresponding to three parts of the template:
<h1>Ninja Squad</h1>
<!-- special comment -->
<ul>
303
-- 312 of 353 --
<!-- special comment -->
</ul>
<li>{{ user.name }}</li>
This is because the * syntax is in fact syntactic sugar to apply an attribute directive on an ng-
template element. So our example is the same as:
<h1>Ninja Squad</h1>
<ng-template [ngIf]="condition">
<ul>
<ng-template ngFor [ngForOf]="users" let-user>
<li>{{ user.name }}</li>
</ng-template>
</ul>
</ng-template>
Here ngIf and ngFor are plain directives. Each ng-template then generates a "view". Each view has a
static structure that never changes. But these views need to be dynamically inserted at some point.
And that’s where the <!-- special comment --> comes into play.
Angular has the concept of ViewContainer. A ViewContainer is like a box where you can
insert/remove child views. To mark the location of these containers, Angular uses a special HTML
comment in the created DOM.
That’s what ngIf actually does under the hood: it creates a ViewContainer, and then, when the
condition given as input changes, it inserts or removes the child view at the location of the special
comment.
 This view concept is quite interesting as it will allow Angular to only update views
that consume a signal in the future, and not the whole template of a component!
You can create your own structural directives if you want to. Let’s say you want to write a
*customNgIf directive. You can create a directive that takes a condition as an input and injects a
ViewContainerRef (t

---

## Chapter 28. Deferrable Views with @defer

With the introduction of the Control flow syntax, the Angular team has also introduced a new way
to load components lazily (as a developer preview for now). We already have lazy-loading in
Angular, but it is mainly based on the router.
Angular v17 adds a new way to load components lazily, using the @defer syntax in your templates.
@defer lets you define a block of template that will be loaded lazily when a condition is met (with all
the components, pipes, directives and libraries used in this block lazily loaded as well). Several
conditions can be used. For example, it can be "as soon as possible (no condition)", "when the user
scrolls to that section", "when the user clicks on that button" or "after 2 seconds".
Let’s say your home page displays a "heavy" ChartComponent that uses a charting library and some
other dependencies, like a FromNow pipe:
chart.component.ts
@Component({
selector: 'ns-chart',
template: '...',
standalone: true,
imports: [FromNowPipe],
})
export class ChartComponent {
// uses chart.js
}
home.component.ts
import { ChartComponent } from './chart.component';
@Component({
selector: 'ns-home',
template: `
<!-- some content -->
<ns-chart />
`,
standalone: true,
imports: [ChartComponent]
})
export class HomeComponent {
// ...
}
When the application is packaged, the ChartComponent will be included in the main bundle:
311
-- 320 of 353 --
main¬xxxx.js 300KB
home.component.ts
chart.component.ts
from now.pipe.ts
chart.js
Let’s say that the component is not visible at first on the home page, maybe because it is at the
bottom of the page, or because it is in a tab that is not active. It makes sense to avoid loading this
component eagerly because it would slow down the initial loading of the page.
With @defer, you can load this component only when the user really needs it. Just wrapping the
ChartComponent in a @defer block will do the trick:
home.component.ts
import { ChartComponent } from './chart.component';
@Component({
selector: 'ns-home',
template: `
<!-- some content -->
@defer (when isVisible) {
<ns-chart />
}
`,
standalone: true,
imports: [ChartComponent]
})
The Angular compiler will rewrite the static import of the ChartComponent to a dynamic import (()
⇒ import('./chart.component')), and the component will be loaded only when the condition is met.
As the component is now imported dynamically, it will not be included in the main bundle. The
bundler will create a new chunk for it:
main¬xxxx.js 	100KB
home.component.ts 	chunk¬xxxx.js 	200KB
chart.component.ts
from now.pipe.ts
chart.js
312
-- 321 of 353 --
The chunk-xxxx.js file will only be loaded when the condition is met, and the ChartComponent will be
displayed.
Before talking about the various kinds of conditions that can be used with @defer, let’s see how to
use another interesting feature: displaying a placeholder until the deferred block is loaded.
28.1. @placeholder, @loading, and @error
You can define a placeholder template with @placeholder that will be displayed until t

---

## Chapter 29. Going to production

So now you’ve built an application, and you are seriously thinking about showing it to the world.
Let’s have a look about what you need to do to go to production!
29.1. Environments and configurations
If you use Angular CLI, you can define several environments.
To do this, the CLI offers a schematic called environment:
ng generate environments
This generates files named environment.ts and environment.development.ts.
These files contain an empty object called environment, in which you can add as many properties as
you want.
environment.ts
export const environment = {};
You’ll then only import environment.ts in your application. It’s a bit weird, but the CLI will then use
the right file according to the environment.
When serving (with ng serve) your application, the CLI (Webpack, to be more accurate) will use
environment.development.ts.
But you can also serve your application with a specified configuration. By default, the CLI has
another configuration named production.
So you can also run ng serve --configuration=production. The difference between these
configurations can be found in the angular.json files:
angular.json
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
318
-- 327 of 353 --
}
],
"outputHashing": "all"
},
"development": {
"optimization": false,
"extractLicenses": false,
"sourceMap": true,
"fileReplacements": [
{
"replace": "src/environments/environment.ts",
"with": "src/environments/environment.development.ts"
}
]
},
As you can see, there is a production configuration with a few properties. The budgets one, for
example, checks that your initial loading and component styles are not too heavy.
There is a super useful property in the development configuration that the schematic added:
fileReplacements.
angular.json
"fileReplacements": [
{
"replace": "src/environments/environment.ts",
"with": "src/environments/environment.development.ts"
}
]
You can see that the environment.ts file is replaced by environment.development.ts: this is how
Webpack knows which file to use.
You then always import from environment.ts in your code, and, during the build, the CLI will pick
the proper environment file for the configuration.
This means that you can define as many configurations as you want. For example, you could add a
preprod configuration with a dedicated environment.preprod.ts file.
It also means that you can replace as many files as you want in your application. You can imagine
doing crazy things like replacing pony.component.ts with a different version (I don’t see why you
would do that though ^^).
An environment file can contain whatever you want. But as its name indicates, it’s supposed to
contain code that is specific to a given environment (development, production, pre-production,
etc.). For example, you may have a different API location in development than in the live version.
As the produc

---

## Chapter 30. This is the end

Thanks for reading!
There are some other chapters that will be added in the following releases on more advanced stuff
and some other goodies. They all need a little more polish, but I’m sure you’ll enjoy them. And of
course, we’ll keep up with the framework releases, so you won’t miss the new shiny features that
will come out. All these future updates of the book will be available for free, of course!
If you liked what you read, tell your friends about it!
And if you don’t already own it, you should know that there is also a pro package of this ebook. This
package gives access to a whole set of exercises to build a real application, step by step, starting
from scratch. For each step we provide a full unit tests suite covering 100% of your code, detailed
instructions (which are not a basic copy-paste, but will push you to understand what you are
doing), and a solution if you need (which might be the most beautiful one, or at least one consistent
with the latest best practices) A home-brewed tool analyzes your code and computes a score for
each exercise, and your progression is visible on a dashboard. If you’re looking for actual code
samples, always up-to-date, which might save you hours of work, our Pro Pack is waiting for you!
You can even try the first exercises for free. And as you are already the proud owner of this ebook,
we want to thank you for your historic support with a generous discount that you can grab here!
We have tried to give you all the keys, but Web Development looks an awful lot like:
323
-- 332 of 353 --
How to draw a horse. Credit to Van Oktop.
So we also provide training, mainly in France and Europe, but all over the world really. We can also
do some consulting work to help your team, or work with you to help you build your product. Just
shoot us an email at hello@ninja-squad.com and we’ll discuss it!
Overall, I would love hearing from you and find out what you liked, loved and hated in this ebook -
whether you are writing to signal a small typo, a big mistake, or just to tell us that this book helped
you find your dream job (well, you never know…).
I can’t finish without thanking a few people. My girlfriend, first, who has been an incredible
support, even when I was rewriting something for the tenth time, in a dreadful mood on a Sunday.
My colleagues, for their tireless work and feedback, their kindness for encouraging me and giving
me the time to do this crazy thing. And my friends and family, for the little words that kept me
324
-- 333 of 353 --
going.
And you, for buying this and reading it to the last sentence.
Stay tuned.
325
-- 334 of 353 --
Appendix A: Changelog
Here are all the major changes since the first version. It should help you to see what changed since
your last read!
By buying this ebook, you’ll get all the following updates for free. Go to https://books.ninja-
squad.com/claim to obtain the latest version of this ebook.
Current versions:
• Angular: 17.2.1
• Angular CLI: 17.2.0
A.1. v17.2.0 - 2024-02-15

---

## Signals

• Add a section about the model() function introduced in v17.2 (2024-02-13)
• Add a section about the queries as signals functions (viewChild()/viewChildren()/contentChild()
/contentChildren()) introduced in v17.2 (2024-02-12)
Deferred loading with @defer
• The defer block fixture default behavior switched to Playthrough. (2024-02-01)
A.2. v17.1.0 - 2024-01-18

---

## Control flow syntax

• New chapter about the control flow syntax introduced in Angular v17! (2023-10-08)
Deferred loading with @defer
326
-- 335 of 353 --
• New chapter about deferred loading with @defer as introduced in Angular v17! (2023-10-30)
A.4. v16.2.0 - 2023-08-10

---

## Router

• As Angular v15.2 deprecates class-based resolvers and guards, we now use functional resolvers
and guards in all examples. (2023-02-23)
A.8. v15.1.0 - 2023-01-11
Dependency Injection
• Use a better example for DI configuration, with a logging service that logs to the console in
development and calls an API in production. (2023-01-05)
• Add a section about the inject() function. (2022-12-01)

---

## Going to production

• Remove the section about differential loading as it has been removed in Angular v13 (2021-11-04)
• Remove the fullTemplateTypeCheck explanation, as it is deprecated in Angular v13, and only
329
-- 338 of 353 --
keep its remplacement strictTemplates. (2021-11-04)
A.17. v12.2.0 - 2021-08-05

---

## Global

• Add links to our quizzes! (2021-07-29)
Reactive Programming
• RxJS v7.2 allows to import operators directly from rxjs, so all imports have been simplified.
(2021-08-05)
A.18. v12.1.0 - 2021-06-25
A.19. v12.0.0 - 2021-05-13

---

## Global

• Bump to ng 10.0.0 (2020-06-25)
The wonderful world of Web Components
• Use customElements.define instead of the deprecated document.registerElement. (2020-06-17)
Reactive Programming
• Pass an object as argument to the Observable.subscribe() method when an error or a
completion must be handled, instead of 2 or 3 functions, because passing several functions will
be deprecated in RxJS 7. (2020-06-05)
A.26. v9.1.0 - 2020-03-26

---

## Global

• Bump to ng 9.0.0 (2020-02-07)
• Bump to ng 9.0.0-next.5 (2020-02-06)
331
-- 340 of 353 --
A gentle introduction to ECMAScript 2015+
• Add a section about tagged template strings. (2019-08-02)
Diving into TypeScript
• Showcase interface usage for modeling entities (2019-08-10)
• Improve the enum section with examples of how to use union types (2019-08-10)
Advanced TypeScript
• Introduce a new chapter about advanced TypeScript patterns, like keyof, mapped types, type
guards, and other things! (2019-08-10)

---

## Global

• Bump to ng 7.0.0 (2018-10-18)
• Bump to ng 7.0.0-rc.1 (2018-10-18)
• Bump to ng 7.0.0-rc.0 (2018-10-18)
• Bump to ng 7.0.0-beta.6 (2018-10-18)
• Bump to ng 7.0.0-beta.4 (2018-10-18)
• Bump to ng 7.0.0-beta.0 (2018-10-18)
334
-- 343 of 353 --

---

## Global

• Bump to ng 6.0.0 (2018-05-04)
• Bump to ng 6.0.0-rc.4 (2018-04-13)
• Bump to ng 6.0.0-rc0 (2018-04-05)
• Bump to ng 6.0.0-beta.7 (2018-04-05)
• Bump to ng 6.0.0-beta.6 (2018-04-05)
• Bump to ng 6.0.0-beta.1 (2018-04-05)
The wonderful world of Web Components
• Replace customelements.io by webcomponents.org (2018-01-19)

---

## From zero to something

• Bump to cli 6.0.0 (2018-05-04)
• The chapter now uses Angular CLI from the start! (2018-03-19)
Dependency Injection
• Use providedIn to register services, as recommended for Angular 6.0 (2018-04-15)
• Updates the dependency injection via token section with a better example (2018-03-19)
Reactive Programming
• We now use the pipeable operators introduced in RxJS 5.5 (2018-01-28)

---

## Global

• Bump to ng 5.0.0 (2017-11-02)
• Bump to ng 5.0.0-rc.5 (2017-11-02)
• Bump to ng 5.0.0-rc.3 (2017-11-02)
• Bump to ng 5.0.0-rc.2 (2017-11-02)
• Bump to ng 5.0.0-rc.0 (2017-11-02)
• Bump to ng 5.0.0-beta.6 (2017-11-02)
• Bump to ng 5.0.0-beta.5 (2017-11-02)
• Bump to ng 5.0.0-beta.4 (2017-11-02)
• Bump to ng 5.0.0-beta.1 (2017-11-02)
• Bump to ng 4.4.1 (2017-09-16)

---

## Forms

337
-- 346 of 353 --
• Add a section on the updateOn: 'blur' option for controls and groups introduced in 5.0 (2017-11-
02)
• Remove the section about combining template-based and code-based approaches (2017-09-01)
Send and receive data with Http
• Use object literals for headers and params for the new http client, introduced in 5.0.0 (2017-11-02)

---

## Global

• 㢐 Bump to stable release 4.0.0 㢐 (2017-03-24)
• Bump to 4.0.0-rc.6 (2017-03-23)
• Bump to 4.0.0-rc.5 (2017-03-23)
• Bump to 4.0.0-rc.4 (2017-03-23)
• Bump to 4.0.0-rc.3 (2017-03-23)
• Bump to 4.0.0-rc.1 (2017-03-23)
• Bump to 4.0.0-beta.8 (2017-03-23)
• Bump to ng 4.0.0-beta.7 and TS 2.1+ is now required (2017-03-23)
• Bump to 4.0.0-beta.5 (2017-03-23)
• Bump to 4.0.0-beta.0 (2017-03-23)
• Each chapter now has a link to the corresponding exercise of our Pro Pack Chapters are slightly
re-ordered to match the exercises order. (2017-03-22)

---

## Global

• Bump to 2.2.0 (2016-11-18)
340
-- 349 of 353 --
• Bump to 2.1.0 (2016-10-17)
• Remove typings and use npm install @types/… (2016-10-17)
• Use const instead of let and TypeScript type inference whenever possible (2016-10-01)
• Bump to 2.0.1 (2016-09-24)

---

## Global

• Bump to rc.5 (2016-08-23)
• Bump to rc.4 (2016-07-08)
• Bump to rc.3 (2016-06-28)
341
-- 350 of 353 --
• Bump to rc.2 (2016-06-16)
• Bump to rc.1 (2016-06-08)
• Code examples now follow the official style guide (2016-06-08)

---

## Forms

• Forms now use the new form API (FormsModule and ReactiveFormsModule). (2016-08-22)
• Warn about forms module being rewritten (and deprecated) (2016-06-16)
Send and receive data with Http
• Add the HttpModule import (2016-08-21)
• http.post() now autodetects the body type, removing the need of using JSON.stringify and
setting the ContentType (2016-06-16)

---

## Global

• Bump to rc.0. All packages have changed! (2016-05-03)
• Bump to beta.17 (2016-05-03)
• Bump to beta.15 (2016-04-16)
• Bump to beta.14 (2016-04-11)
• Bump to beta.11 (2016-03-19)
• Bump to beta.9 (2016-03-11)
• Bump to beta.8 (2016-03-10)
• Bump to beta.7 (2016-03-04)
• Display the Angular 2 version used in the intro and in the chapter "Zero to something". (2016-03-
04)
• Bump to beta.6 (beta.4 and beta.5 were broken) (2016-03-04)
• Bump to beta.3 (2016-03-04)
• Bump to beta.2 (2016-03-04)
Diving into TypeScript
• Use typings instead of tsd. (2016-03-04)

---

## Forms

• A pattern validator has been introduced to make sure that the input matches a regexp (2016-04-16)
• Add a mnemonic tip to rememeber the [()] syntax: the banana box! (2016-03-04)
• Examples use module.id to have a relative templateUrl (2016-03-04)
• Fix error ng-no-form → ngNoForm (2016-03-04)
• Fix errors (ngModel) → (ngModelChange), is-old-enough → isOldEnough (2016-03-04)
Send and receive data with Http
• Use JSON.stringify before sending data with a POST (2016-03-04)
• Add a mention to JSONP_PROVIDERS (2016-03-04)

---

## Router

• Introduce the new router (previous one is deprecated), and how to use parameters in URLs!
(2016-05-06)
• RouterOutlet inserts the template of the component just after itself and not inside itself (2016-03-
04)
Zones and the Angular magic
• New chapter! Let’s talk about how Angular 2 works under the hood! First part is about how
AngularJS 1.x used to work, and then we’ll see how Angular 2 differs, and uses a new concept
called zones. (2016-05-03)
A.46. v2.0.0-alpha.47 - 2016-01-15

---

