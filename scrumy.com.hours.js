// ==UserScript==
// @name        Hours Left
// @namespace   http://fluidapp.com
// @description Sets the badge to the number of hours left (in progress + todo) in Scrumy
// @include     *
// @author      Jeff Remer http://jeffremer.com
// ==/UserScript==

(function(){
	if (window.fluid) {
		var INTERVAL = 600000;
		var YOURNAME = 'John Doe';
		var PROJECT  = 'Demo';
		var PASSWORD = '123456';

		var API_URL = ['https://',PROJECT,':', PASSWORD, '@','scrumy.com/api/scrumies/', PROJECT, '/sprints/current.json?callback='].join('');
	
		var request = function() {
			var callbackName = 'c' + new Date().getTime();
			window[callbackName] = update();
			
			var script = document.createElement('script');
			script.setAttribute('src', API_URL + callbackName);
			document.getElementsByTagName('head')[0].appendChild(script);
		};
	
		var update = function() {
			return function(data) {
				try {
					var notDone = _(_(_(_(data.sprint.stories).pluck('story')).pluck('tasks')).flatten()).select(function(task){ return task.task.scrumer.name === YOURNAME && task.task.state !== 'done' && task.task.state !== 'verify'});
					var totalTime = _(notDone).reduce(function(total, task){
						var matches = /\((\d+.*)([hHmM].*)\)/.exec(task.task.title);
						if(_(matches).isArray() && matches.length === 3) {
							var time = parseFloat(matches[1]);
							if(matches[2].indexOf('m') == 0) time = time / 60.0;
							return total + time;
						}
						return total; 
					}, 0);
					window.fluid.dockBadge = totalTime;
				} catch(err){
					console.log(err);
				};
			
				setTimeout(request, INTERVAL);
			}
		}
	
		request();
	}
})();


// Underscore.js 1.1.5
// (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
// Underscore is freely distributable under the MIT license.
// Portions of Underscore are inspired or borrowed from Prototype,
// Oliver Steele's Functional, and John Resig's Micro-Templating.
// For all details and documentation:
// http://documentcloud.github.com/underscore
(function(){var q=this,D=q._,n={},k=Array.prototype,o=Object.prototype,i=k.slice,E=k.unshift,F=o.toString,m=o.hasOwnProperty,s=k.forEach,t=k.map,u=k.reduce,v=k.reduceRight,w=k.filter,x=k.every,y=k.some,p=k.indexOf,z=k.lastIndexOf;o=Array.isArray;var G=Object.keys,A=Function.prototype.bind,c=function(a){return new l(a)};if(typeof module!=="undefined"&&module.exports){module.exports=c;c._=c}else q._=c;c.VERSION="1.1.5";var j=c.each=c.forEach=function(a,b,d){if(a!=null)if(s&&a.forEach===s)a.forEach(b,
d);else if(c.isNumber(a.length))for(var e=0,f=a.length;e<f;e++){if(b.call(d,a[e],e,a)===n)break}else for(e in a)if(m.call(a,e))if(b.call(d,a[e],e,a)===n)break};c.map=function(a,b,d){var e=[];if(a==null)return e;if(t&&a.map===t)return a.map(b,d);j(a,function(f,g,h){e[e.length]=b.call(d,f,g,h)});return e};c.reduce=c.foldl=c.inject=function(a,b,d,e){var f=d!==void 0;if(a==null)a=[];if(u&&a.reduce===u){if(e)b=c.bind(b,e);return f?a.reduce(b,d):a.reduce(b)}j(a,function(g,h,H){if(!f&&h===0){d=g;f=true}else d=
b.call(e,d,g,h,H)});if(!f)throw new TypeError("Reduce of empty array with no initial value");return d};c.reduceRight=c.foldr=function(a,b,d,e){if(a==null)a=[];if(v&&a.reduceRight===v){if(e)b=c.bind(b,e);return d!==void 0?a.reduceRight(b,d):a.reduceRight(b)}a=(c.isArray(a)?a.slice():c.toArray(a)).reverse();return c.reduce(a,b,d,e)};c.find=c.detect=function(a,b,d){var e;B(a,function(f,g,h){if(b.call(d,f,g,h)){e=f;return true}});return e};c.filter=c.select=function(a,b,d){var e=[];if(a==null)return e;
if(w&&a.filter===w)return a.filter(b,d);j(a,function(f,g,h){if(b.call(d,f,g,h))e[e.length]=f});return e};c.reject=function(a,b,d){var e=[];if(a==null)return e;j(a,function(f,g,h){b.call(d,f,g,h)||(e[e.length]=f)});return e};c.every=c.all=function(a,b,d){b=b||c.identity;var e=true;if(a==null)return e;if(x&&a.every===x)return a.every(b,d);j(a,function(f,g,h){if(!(e=e&&b.call(d,f,g,h)))return n});return e};var B=c.some=c.any=function(a,b,d){b=b||c.identity;var e=false;if(a==null)return e;if(y&&a.some===
y)return a.some(b,d);j(a,function(f,g,h){if(e=b.call(d,f,g,h))return n});return e};c.include=c.contains=function(a,b){var d=false;if(a==null)return d;if(p&&a.indexOf===p)return a.indexOf(b)!=-1;B(a,function(e){if(d=e===b)return true});return d};c.invoke=function(a,b){var d=i.call(arguments,2);return c.map(a,function(e){return(b?e[b]:e).apply(e,d)})};c.pluck=function(a,b){return c.map(a,function(d){return d[b]})};c.max=function(a,b,d){if(!b&&c.isArray(a))return Math.max.apply(Math,a);var e={computed:-Infinity};
j(a,function(f,g,h){g=b?b.call(d,f,g,h):f;g>=e.computed&&(e={value:f,computed:g})});return e.value};c.min=function(a,b,d){if(!b&&c.isArray(a))return Math.min.apply(Math,a);var e={computed:Infinity};j(a,function(f,g,h){g=b?b.call(d,f,g,h):f;g<e.computed&&(e={value:f,computed:g})});return e.value};c.sortBy=function(a,b,d){return c.pluck(c.map(a,function(e,f,g){return{value:e,criteria:b.call(d,e,f,g)}}).sort(function(e,f){var g=e.criteria,h=f.criteria;return g<h?-1:g>h?1:0}),"value")};c.sortedIndex=
function(a,b,d){d=d||c.identity;for(var e=0,f=a.length;e<f;){var g=e+f>>1;d(a[g])<d(b)?e=g+1:f=g}return e};c.toArray=function(a){if(!a)return[];if(a.toArray)return a.toArray();if(c.isArray(a))return a;if(c.isArguments(a))return i.call(a);return c.values(a)};c.size=function(a){return c.toArray(a).length};c.first=c.head=function(a,b,d){return b!=null&&!d?i.call(a,0,b):a[0]};c.rest=c.tail=function(a,b,d){return i.call(a,b==null||d?1:b)};c.last=function(a){return a[a.length-1]};c.compact=function(a){return c.filter(a,
function(b){return!!b})};c.flatten=function(a){return c.reduce(a,function(b,d){if(c.isArray(d))return b.concat(c.flatten(d));b[b.length]=d;return b},[])};c.without=function(a){var b=i.call(arguments,1);return c.filter(a,function(d){return!c.include(b,d)})};c.uniq=c.unique=function(a,b){return c.reduce(a,function(d,e,f){if(0==f||(b===true?c.last(d)!=e:!c.include(d,e)))d[d.length]=e;return d},[])};c.intersect=function(a){var b=i.call(arguments,1);return c.filter(c.uniq(a),function(d){return c.every(b,
function(e){return c.indexOf(e,d)>=0})})};c.zip=function(){for(var a=i.call(arguments),b=c.max(c.pluck(a,"length")),d=Array(b),e=0;e<b;e++)d[e]=c.pluck(a,""+e);return d};c.indexOf=function(a,b,d){if(a==null)return-1;var e;if(d){d=c.sortedIndex(a,b);return a[d]===b?d:-1}if(p&&a.indexOf===p)return a.indexOf(b);d=0;for(e=a.length;d<e;d++)if(a[d]===b)return d;return-1};c.lastIndexOf=function(a,b){if(a==null)return-1;if(z&&a.lastIndexOf===z)return a.lastIndexOf(b);for(var d=a.length;d--;)if(a[d]===b)return d;
return-1};c.range=function(a,b,d){if(arguments.length<=1){b=a||0;a=0}d=arguments[2]||1;for(var e=Math.max(Math.ceil((b-a)/d),0),f=0,g=Array(e);f<e;){g[f++]=a;a+=d}return g};c.bind=function(a,b){if(A&&a.bind===A)return a.bind.apply(a,i.call(arguments,1));var d=i.call(arguments,2);return function(){return a.apply(b,d.concat(i.call(arguments)))}};c.bindAll=function(a){var b=i.call(arguments,1);if(b.length==0)b=c.functions(a);j(b,function(d){a[d]=c.bind(a[d],a)});return a};c.memoize=function(a,b){var d=
{};b=b||c.identity;return function(){var e=b.apply(this,arguments);return m.call(d,e)?d[e]:d[e]=a.apply(this,arguments)}};c.delay=function(a,b){var d=i.call(arguments,2);return setTimeout(function(){return a.apply(a,d)},b)};c.defer=function(a){return c.delay.apply(c,[a,1].concat(i.call(arguments,1)))};var C=function(a,b,d){var e;return function(){var f=this,g=arguments,h=function(){e=null;a.apply(f,g)};d&&clearTimeout(e);if(d||!e)e=setTimeout(h,b)}};c.throttle=function(a,b){return C(a,b,false)};c.debounce=
function(a,b){return C(a,b,true)};c.once=function(a){var b=false,d;return function(){if(b)return d;b=true;return d=a.apply(this,arguments)}};c.wrap=function(a,b){return function(){var d=[a].concat(i.call(arguments));return b.apply(this,d)}};c.compose=function(){var a=i.call(arguments);return function(){for(var b=i.call(arguments),d=a.length-1;d>=0;d--)b=[a[d].apply(this,b)];return b[0]}};c.keys=G||function(a){if(a!==Object(a))throw new TypeError("Invalid object");var b=[],d;for(d in a)if(m.call(a,
d))b[b.length]=d;return b};c.values=function(a){return c.map(a,c.identity)};c.functions=c.methods=function(a){return c.filter(c.keys(a),function(b){return c.isFunction(a[b])}).sort()};c.extend=function(a){j(i.call(arguments,1),function(b){for(var d in b)a[d]=b[d]});return a};c.defaults=function(a){j(i.call(arguments,1),function(b){for(var d in b)if(a[d]==null)a[d]=b[d]});return a};c.clone=function(a){return c.isArray(a)?a.slice():c.extend({},a)};c.tap=function(a,b){b(a);return a};c.isEqual=function(a,
b){if(a===b)return true;var d=typeof a;if(d!=typeof b)return false;if(a==b)return true;if(!a&&b||a&&!b)return false;if(a._chain)a=a._wrapped;if(b._chain)b=b._wrapped;if(a.isEqual)return a.isEqual(b);if(c.isDate(a)&&c.isDate(b))return a.getTime()===b.getTime();if(c.isNaN(a)&&c.isNaN(b))return false;if(c.isRegExp(a)&&c.isRegExp(b))return a.source===b.source&&a.global===b.global&&a.ignoreCase===b.ignoreCase&&a.multiline===b.multiline;if(d!=="object")return false;if(a.length&&a.length!==b.length)return false;
d=c.keys(a);var e=c.keys(b);if(d.length!=e.length)return false;for(var f in a)if(!(f in b)||!c.isEqual(a[f],b[f]))return false;return true};c.isEmpty=function(a){if(c.isArray(a)||c.isString(a))return a.length===0;for(var b in a)if(m.call(a,b))return false;return true};c.isElement=function(a){return!!(a&&a.nodeType==1)};c.isArray=o||function(a){return F.call(a)==="[object Array]"};c.isArguments=function(a){return!!(a&&m.call(a,"callee"))};c.isFunction=function(a){return!!(a&&a.constructor&&a.call&&
a.apply)};c.isString=function(a){return!!(a===""||a&&a.charCodeAt&&a.substr)};c.isNumber=function(a){return!!(a===0||a&&a.toExponential&&a.toFixed)};c.isNaN=function(a){return a!==a};c.isBoolean=function(a){return a===true||a===false};c.isDate=function(a){return!!(a&&a.getTimezoneOffset&&a.setUTCFullYear)};c.isRegExp=function(a){return!!(a&&a.test&&a.exec&&(a.ignoreCase||a.ignoreCase===false))};c.isNull=function(a){return a===null};c.isUndefined=function(a){return a===void 0};c.noConflict=function(){q._=
D;return this};c.identity=function(a){return a};c.times=function(a,b,d){for(var e=0;e<a;e++)b.call(d,e)};c.mixin=function(a){j(c.functions(a),function(b){I(b,c[b]=a[b])})};var J=0;c.uniqueId=function(a){var b=J++;return a?a+b:b};c.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g};c.template=function(a,b){var d=c.templateSettings;d="var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('"+a.replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(d.interpolate,
function(e,f){return"',"+f.replace(/\\'/g,"'")+",'"}).replace(d.evaluate||null,function(e,f){return"');"+f.replace(/\\'/g,"'").replace(/[\r\n\t]/g," ")+"__p.push('"}).replace(/\r/g,"\\r").replace(/\n/g,"\\n").replace(/\t/g,"\\t")+"');}return __p.join('');";d=new Function("obj",d);return b?d(b):d};var l=function(a){this._wrapped=a};c.prototype=l.prototype;var r=function(a,b){return b?c(a).chain():a},I=function(a,b){l.prototype[a]=function(){var d=i.call(arguments);E.call(d,this._wrapped);return r(b.apply(c,
d),this._chain)}};c.mixin(c);j(["pop","push","reverse","shift","sort","splice","unshift"],function(a){var b=k[a];l.prototype[a]=function(){b.apply(this._wrapped,arguments);return r(this._wrapped,this._chain)}});j(["concat","join","slice"],function(a){var b=k[a];l.prototype[a]=function(){return r(b.apply(this._wrapped,arguments),this._chain)}});l.prototype.chain=function(){this._chain=true;return this};l.prototype.value=function(){return this._wrapped}})();