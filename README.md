<img src="https://assets.solidjs.com/banner?project=Modular+Forms" alt="Modular Forms" /><br />

# Modular Forms

Modular Forms is a JavaScript library that is build on top of [SolidJS](https://github.com/solidjs/solid) to validate and handle various types of forms. It is fast by default and the bundle size is small due to a modular design. Try it out on our [website](https://modularforms.dev/playground)!

## ๐งช Features

- Small bundle size starting at 2.5 KB
- Modular design โ only use what you need
- It's fast โ DOM updates are fine-grained
- Readable API that is similar to SolidJS
- Validate everything from emails to files
- No dependencies โ except for SolidJS
- Excellent editor support through TypeScript
- Supports all native HTML form fields
- It's headless โ you define the visual

## ๐ฅ Motivation

Since you're using SolidJS, I assume native performance, granular reactivity, and a small bundle size is important to you. Why should that not also count for your form library? Is there really a need to opt-in to a big and slow form library to meet all your needs?

I said no, and undertook an attempt to develop a modular form library that is as powerful as big libraries like Formik, React Hook Form and Felte, that is fast by default and takes only 2.5 KB (minified + gzipped) for a small and uncomplicated login form or up to 5 KB (minified + gzipped) for a complex and dynamic form. The result of this journey is this library called **Modular Forms**!

> Since the library itself is modular, the bundle size increases less than linear as more functionality is used. Basic functionality starts at 2.5 KB (minified + gzipped) and the most complex form you can create requires about 5 KB (minified + gzipped).

I've started implementing it with SolidJS, but I'm sure the API could also work in a similar way for React, Vue and Svelte. So if you are interested and able to support it, let me know.

## โ๏ธ Feedback

Find a bug or have an idea how to improve the library? Please fill out an [issue](https://github.com/fabian-hiller/modular-forms/issues/new). Together we can make the library even better!

## ๐๐ผ Credits

When creating Modular Forms, I took inspiration from [React Hook Form](https://github.com/react-hook-form/react-hook-form) and [Formik](https://github.com/jaredpalmer/formik). I also want to thank [Ryan Carniato](https://github.com/ryansolid) for his inspiring streams with exclusive and deep insights into different technologies and [David Di Biase](https://github.com/davedbase) for his help via Discord.

## ๐ License

This project is licensed under the [MIT License](https://github.com/fabian-hiller/modular-forms/tree/main/LICENSE.md).
