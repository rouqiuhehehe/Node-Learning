exports.id=976,exports.ids=[976],exports.modules={2976:(t,r,e)=>{"use strict";e.r(r),e.d(r,{default:()=>O}),e(2419);var n=e(8926),o=e.n(n),i=e(4575),u=e.n(i),a=e(3913),s=e.n(a),c=e(1506),f=e.n(c),d=e(2205),l=e.n(d),h=e(8585),v=e.n(h),p=e(9754),w=e.n(p),R=e(9713),E=e.n(R),m=e(7757),y=e.n(m),C=(e(1539),e(8674),e(9554),e(4747),e(6992),e(8783),e(3948),e(9600),e(4916),e(5306),e(2707),e(3123),e(9714),e(8690)),g=e(6827),x=e(1239),k=e.n(x),F=e(7147),D=e.n(F),S=e(5135),B=e.n(S),W=e(1017),b=e.n(W),A=e(7751);var O=function(t){l()(a,t);var r,e,n,i=(e=a,n=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(t){return!1}}(),function(){var t,r=w()(e);if(n){var o=w()(this).constructor;t=Reflect.construct(r,arguments,o)}else t=r.apply(this,arguments);return v()(this,t)});function a(t,r){var e;return u()(this,a),(e=i.call(this)).watchDir=t,e.res=r,E()(f()(e),"wordCounts",{}),e}return s()(a,[{key:"startWatchFile",value:function(){var t=this;D().watch(this.watchDir,{recursive:!0},(function(r,e){t.emit("fileChange",r,e)}))}},{key:"wordCount",value:function(){var t=this;return new Promise((function(r){D().stat(t.watchDir,(function(e,n){e&&g.Z.hadError(new A.default(C.q.SERVER_ERROR,e.message,e),t.res),n.isDirectory()?D().readdir(t.watchDir,(function(e,n){var o=[];e&&g.Z.hadError(new A.default(C.q.SERVER_ERROR,e.message,e),t.res),n.forEach((function(r){".jpg"!==b().extname(r)&&o.push(t.wordCountByFile(r))})),Promise.all(o).then((function(){r(t.wordCounts)}))})):n.isFile()&&t.wordCountByFile().then((function(){r(t.wordCounts)}))}))}))}},{key:"copyFile",value:(r=o()(y().mark((function t(r,e){var n,o,i,u,a;return y().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=b().join(this.watchDir,r),o=b().extname(r),i=r.replace(o,e),u=b().join(this.watchDir,i),t.prev=4,t.next=7,F.promises.readFile(n,{encoding:"utf-8",flag:"r"});case 7:return a=t.sent,t.next=10,F.promises.rm(u,{force:!0});case 10:return t.next=12,F.promises.writeFile(u,a,{encoding:"utf-8"});case 12:t.next=17;break;case 14:t.prev=14,t.t0=t.catch(4),g.Z.hadError(new A.default(C.q.SERVER_ERROR,t.t0));case 17:case"end":return t.stop()}}),t,this,[[4,14]])}))),function(t,e){return r.apply(this,arguments)})},{key:"wordCountByFile",value:function(t){var r=this;return new Promise((function(e){D().readFile(r.watchDir+(null!=t?t:""),(function(t,n){t&&g.Z.hadError(new A.default(C.q.SERVER_ERROR,t.message,t),r.res);var o=B().decode(n,"gbk");r.countWordInFile(o),e(!0)}))}))}},{key:"countWordInFile",value:function(t){var r=this;t.toString().toLowerCase().split(/\s+/).sort().forEach((function(t){r.addWordCount(t)}))}},{key:"addWordCount",value:function(t){this.wordCounts[t]=this.wordCounts[t]?this.wordCounts[t]+1:1}}]),a}(k().EventEmitter)},8886:(t,r,e)=>{var n=e(8113).match(/firefox\/(\d+)/i);t.exports=!!n&&+n[1]},256:(t,r,e)=>{var n=e(8113);t.exports=/MSIE|Trident/.test(n)},8008:(t,r,e)=>{var n=e(8113).match(/AppleWebKit\/(\d+)\./);t.exports=!!n&&+n[1]},2707:(t,r,e)=>{"use strict";var n=e(2109),o=e(1702),i=e(9662),u=e(7908),a=e(6244),s=e(1340),c=e(7293),f=e(4362),d=e(9341),l=e(8886),h=e(256),v=e(7392),p=e(8008),w=[],R=o(w.sort),E=o(w.push),m=c((function(){w.sort(void 0)})),y=c((function(){w.sort(null)})),C=d("sort"),g=!c((function(){if(v)return v<70;if(!(l&&l>3)){if(h)return!0;if(p)return p<603;var t,r,e,n,o="";for(t=65;t<76;t++){switch(r=String.fromCharCode(t),t){case 66:case 69:case 70:case 72:e=3;break;case 68:case 71:e=4;break;default:e=2}for(n=0;n<47;n++)w.push({k:r+n,v:e})}for(w.sort((function(t,r){return r.v-t.v})),n=0;n<w.length;n++)r=w[n].k.charAt(0),o.charAt(o.length-1)!==r&&(o+=r);return"DGBEFHACIJK"!==o}}));n({target:"Array",proto:!0,forced:m||!y||!C||!g},{sort:function(t){void 0!==t&&i(t);var r=u(this);if(g)return void 0===t?R(r):R(r,t);var e,n,o=[],c=a(r);for(n=0;n<c;n++)n in r&&E(o,r[n]);for(f(o,function(t){return function(r,e){return void 0===e?-1:void 0===r?1:void 0!==t?+t(r,e)||0:s(r)>s(e)?1:-1}}(t)),e=o.length,n=0;n<e;)r[n]=o[n++];for(;n<c;)delete r[n++];return r}})}};