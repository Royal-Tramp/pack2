import "regenerator-runtime/runtime.js";
import hash from 'object-hash/dist/object_hash.js';
import hello from './hello.js'
import world from './world.js'
import './underscore.js';
import './async.js';
import './vue.js';

console.log(hash(hello + world()))

