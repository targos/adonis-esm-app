/*
|--------------------------------------------------------------------------
| Ace Commands
|--------------------------------------------------------------------------
|
| This file is the entry point for running ace commands.
|
*/

import 'reflect-metadata'
import sourceMapSupport from 'source-map-support'
// TODO: Node.js should already support source maps
sourceMapSupport.install({ handleUncaughtExceptions: false })

import { Ignitor } from '@adonisjs/core/build/standalone.js'
new Ignitor(import.meta.url).ace().handle(process.argv.slice(2))
