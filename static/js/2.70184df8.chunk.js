(this["webpackJsonpgenshin-optimizer"]=this["webpackJsonpgenshin-optimizer"]||[]).push([[2],{1008:function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));var o=n(3),r=n(1),i=0;function a(e){var t=r.useState(e),n=Object(o.a)(t,2),a=n[0],c=n[1],s=e||a;return r.useEffect((function(){null==a&&c("mui-".concat(i+=1))}),[a]),s}},1016:function(e,t,n){"use strict";var o=n(3),r=n(6),i=n(9),a=n(2),c=n(1),s=(n(5),n(8)),p=n(112),u=n(54),l=n(103);function f(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2?arguments[2]:void 0;return Object(l.a)(e)?t:Object(u.a)({},t,{ownerState:Object(u.a)({},t.ownerState,n)})}var d=n(96),m=n(10),h=n(39),v=n(13),b=n(14),g=n(1007),O=n(102),y=n(176),w=n(94),x=n(132);function j(e){if(null==e)return window;if("[object Window]"!==e.toString()){var t=e.ownerDocument;return t&&t.defaultView||window}return e}function T(e){return e instanceof j(e).Element||e instanceof Element}function R(e){return e instanceof j(e).HTMLElement||e instanceof HTMLElement}function E(e){return"undefined"!==typeof ShadowRoot&&(e instanceof j(e).ShadowRoot||e instanceof ShadowRoot)}var P=Math.max,M=Math.min,D=Math.round;function L(e,t){void 0===t&&(t=!1);var n=e.getBoundingClientRect(),o=1,r=1;if(R(e)&&t){var i=e.offsetHeight,a=e.offsetWidth;a>0&&(o=D(n.width)/a||1),i>0&&(r=D(n.height)/i||1)}return{width:n.width/o,height:n.height/r,top:n.top/r,right:n.right/o,bottom:n.bottom/r,left:n.left/o,x:n.left/o,y:n.top/r}}function k(e){var t=j(e);return{scrollLeft:t.pageXOffset,scrollTop:t.pageYOffset}}function A(e){return e?(e.nodeName||"").toLowerCase():null}function S(e){return((T(e)?e.ownerDocument:e.document)||window.document).documentElement}function W(e){return L(S(e)).left+k(e).scrollLeft}function B(e){return j(e).getComputedStyle(e)}function C(e){var t=B(e),n=t.overflow,o=t.overflowX,r=t.overflowY;return/auto|scroll|overlay|hidden/.test(n+r+o)}function H(e,t,n){void 0===n&&(n=!1);var o=R(t),r=R(t)&&function(e){var t=e.getBoundingClientRect(),n=D(t.width)/e.offsetWidth||1,o=D(t.height)/e.offsetHeight||1;return 1!==n||1!==o}(t),i=S(t),a=L(e,r),c={scrollLeft:0,scrollTop:0},s={x:0,y:0};return(o||!o&&!n)&&(("body"!==A(t)||C(i))&&(c=function(e){return e!==j(e)&&R(e)?{scrollLeft:(t=e).scrollLeft,scrollTop:t.scrollTop}:k(e);var t}(t)),R(t)?((s=L(t,!0)).x+=t.clientLeft,s.y+=t.clientTop):i&&(s.x=W(i))),{x:a.left+c.scrollLeft-s.x,y:a.top+c.scrollTop-s.y,width:a.width,height:a.height}}function N(e){var t=L(e),n=e.offsetWidth,o=e.offsetHeight;return Math.abs(t.width-n)<=1&&(n=t.width),Math.abs(t.height-o)<=1&&(o=t.height),{x:e.offsetLeft,y:e.offsetTop,width:n,height:o}}function I(e){return"html"===A(e)?e:e.assignedSlot||e.parentNode||(E(e)?e.host:null)||S(e)}function F(e){return["html","body","#document"].indexOf(A(e))>=0?e.ownerDocument.body:R(e)&&C(e)?e:F(I(e))}function V(e,t){var n;void 0===t&&(t=[]);var o=F(e),r=o===(null==(n=e.ownerDocument)?void 0:n.body),i=j(o),a=r?[i].concat(i.visualViewport||[],C(o)?o:[]):o,c=t.concat(a);return r?c:c.concat(V(I(a)))}function q(e){return["table","td","th"].indexOf(A(e))>=0}function z(e){return R(e)&&"fixed"!==B(e).position?e.offsetParent:null}function U(e){for(var t=j(e),n=z(e);n&&q(n)&&"static"===B(n).position;)n=z(n);return n&&("html"===A(n)||"body"===A(n)&&"static"===B(n).position)?t:n||function(e){var t=-1!==navigator.userAgent.toLowerCase().indexOf("firefox");if(-1!==navigator.userAgent.indexOf("Trident")&&R(e)&&"fixed"===B(e).position)return null;for(var n=I(e);R(n)&&["html","body"].indexOf(A(n))<0;){var o=B(n);if("none"!==o.transform||"none"!==o.perspective||"paint"===o.contain||-1!==["transform","perspective"].indexOf(o.willChange)||t&&"filter"===o.willChange||t&&o.filter&&"none"!==o.filter)return n;n=n.parentNode}return null}(e)||t}var X="top",Y="bottom",_="right",J="left",G="auto",K=[X,Y,_,J],Q="start",Z="end",$="viewport",ee="popper",te=K.reduce((function(e,t){return e.concat([t+"-"+Q,t+"-"+Z])}),[]),ne=[].concat(K,[G]).reduce((function(e,t){return e.concat([t,t+"-"+Q,t+"-"+Z])}),[]),oe=["beforeRead","read","afterRead","beforeMain","main","afterMain","beforeWrite","write","afterWrite"];function re(e){var t=new Map,n=new Set,o=[];function r(e){n.add(e.name),[].concat(e.requires||[],e.requiresIfExists||[]).forEach((function(e){if(!n.has(e)){var o=t.get(e);o&&r(o)}})),o.push(e)}return e.forEach((function(e){t.set(e.name,e)})),e.forEach((function(e){n.has(e.name)||r(e)})),o}function ie(e){var t;return function(){return t||(t=new Promise((function(n){Promise.resolve().then((function(){t=void 0,n(e())}))}))),t}}var ae={placement:"bottom",modifiers:[],strategy:"absolute"};function ce(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return!t.some((function(e){return!(e&&"function"===typeof e.getBoundingClientRect)}))}function se(e){void 0===e&&(e={});var t=e,n=t.defaultModifiers,o=void 0===n?[]:n,r=t.defaultOptions,i=void 0===r?ae:r;return function(e,t,n){void 0===n&&(n=i);var r={placement:"bottom",orderedModifiers:[],options:Object.assign({},ae,i),modifiersData:{},elements:{reference:e,popper:t},attributes:{},styles:{}},a=[],c=!1,s={state:r,setOptions:function(n){var c="function"===typeof n?n(r.options):n;p(),r.options=Object.assign({},i,r.options,c),r.scrollParents={reference:T(e)?V(e):e.contextElement?V(e.contextElement):[],popper:V(t)};var u=function(e){var t=re(e);return oe.reduce((function(e,n){return e.concat(t.filter((function(e){return e.phase===n})))}),[])}(function(e){var t=e.reduce((function(e,t){var n=e[t.name];return e[t.name]=n?Object.assign({},n,t,{options:Object.assign({},n.options,t.options),data:Object.assign({},n.data,t.data)}):t,e}),{});return Object.keys(t).map((function(e){return t[e]}))}([].concat(o,r.options.modifiers)));return r.orderedModifiers=u.filter((function(e){return e.enabled})),r.orderedModifiers.forEach((function(e){var t=e.name,n=e.options,o=void 0===n?{}:n,i=e.effect;if("function"===typeof i){var c=i({state:r,name:t,instance:s,options:o}),p=function(){};a.push(c||p)}})),s.update()},forceUpdate:function(){if(!c){var e=r.elements,t=e.reference,n=e.popper;if(ce(t,n)){r.rects={reference:H(t,U(n),"fixed"===r.options.strategy),popper:N(n)},r.reset=!1,r.placement=r.options.placement,r.orderedModifiers.forEach((function(e){return r.modifiersData[e.name]=Object.assign({},e.data)}));for(var o=0;o<r.orderedModifiers.length;o++)if(!0!==r.reset){var i=r.orderedModifiers[o],a=i.fn,p=i.options,u=void 0===p?{}:p,l=i.name;"function"===typeof a&&(r=a({state:r,options:u,name:l,instance:s})||r)}else r.reset=!1,o=-1}}},update:ie((function(){return new Promise((function(e){s.forceUpdate(),e(r)}))})),destroy:function(){p(),c=!0}};if(!ce(e,t))return s;function p(){a.forEach((function(e){return e()})),a=[]}return s.setOptions(n).then((function(e){!c&&n.onFirstUpdate&&n.onFirstUpdate(e)})),s}}var pe={passive:!0};function ue(e){return e.split("-")[0]}function le(e){return e.split("-")[1]}function fe(e){return["top","bottom"].indexOf(e)>=0?"x":"y"}function de(e){var t,n=e.reference,o=e.element,r=e.placement,i=r?ue(r):null,a=r?le(r):null,c=n.x+n.width/2-o.width/2,s=n.y+n.height/2-o.height/2;switch(i){case X:t={x:c,y:n.y-o.height};break;case Y:t={x:c,y:n.y+n.height};break;case _:t={x:n.x+n.width,y:s};break;case J:t={x:n.x-o.width,y:s};break;default:t={x:n.x,y:n.y}}var p=i?fe(i):null;if(null!=p){var u="y"===p?"height":"width";switch(a){case Q:t[p]=t[p]-(n[u]/2-o[u]/2);break;case Z:t[p]=t[p]+(n[u]/2-o[u]/2)}}return t}var me={top:"auto",right:"auto",bottom:"auto",left:"auto"};function he(e){var t,n=e.popper,o=e.popperRect,r=e.placement,i=e.variation,a=e.offsets,c=e.position,s=e.gpuAcceleration,p=e.adaptive,u=e.roundOffsets,l=e.isFixed,f=!0===u?function(e){var t=e.x,n=e.y,o=window.devicePixelRatio||1;return{x:D(t*o)/o||0,y:D(n*o)/o||0}}(a):"function"===typeof u?u(a):a,d=f.x,m=void 0===d?0:d,h=f.y,v=void 0===h?0:h,b=a.hasOwnProperty("x"),g=a.hasOwnProperty("y"),O=J,y=X,w=window;if(p){var x=U(n),T="clientHeight",R="clientWidth";if(x===j(n)&&"static"!==B(x=S(n)).position&&"absolute"===c&&(T="scrollHeight",R="scrollWidth"),x=x,r===X||(r===J||r===_)&&i===Z)y=Y,v-=(l&&w.visualViewport?w.visualViewport.height:x[T])-o.height,v*=s?1:-1;if(r===J||(r===X||r===Y)&&i===Z)O=_,m-=(l&&w.visualViewport?w.visualViewport.width:x[R])-o.width,m*=s?1:-1}var E,P=Object.assign({position:c},p&&me);return s?Object.assign({},P,((E={})[y]=g?"0":"",E[O]=b?"0":"",E.transform=(w.devicePixelRatio||1)<=1?"translate("+m+"px, "+v+"px)":"translate3d("+m+"px, "+v+"px, 0)",E)):Object.assign({},P,((t={})[y]=g?v+"px":"",t[O]=b?m+"px":"",t.transform="",t))}var ve={left:"right",right:"left",bottom:"top",top:"bottom"};function be(e){return e.replace(/left|right|bottom|top/g,(function(e){return ve[e]}))}var ge={start:"end",end:"start"};function Oe(e){return e.replace(/start|end/g,(function(e){return ge[e]}))}function ye(e,t){var n=t.getRootNode&&t.getRootNode();if(e.contains(t))return!0;if(n&&E(n)){var o=t;do{if(o&&e.isSameNode(o))return!0;o=o.parentNode||o.host}while(o)}return!1}function we(e){return Object.assign({},e,{left:e.x,top:e.y,right:e.x+e.width,bottom:e.y+e.height})}function xe(e,t){return t===$?we(function(e){var t=j(e),n=S(e),o=t.visualViewport,r=n.clientWidth,i=n.clientHeight,a=0,c=0;return o&&(r=o.width,i=o.height,/^((?!chrome|android).)*safari/i.test(navigator.userAgent)||(a=o.offsetLeft,c=o.offsetTop)),{width:r,height:i,x:a+W(e),y:c}}(e)):T(t)?function(e){var t=L(e);return t.top=t.top+e.clientTop,t.left=t.left+e.clientLeft,t.bottom=t.top+e.clientHeight,t.right=t.left+e.clientWidth,t.width=e.clientWidth,t.height=e.clientHeight,t.x=t.left,t.y=t.top,t}(t):we(function(e){var t,n=S(e),o=k(e),r=null==(t=e.ownerDocument)?void 0:t.body,i=P(n.scrollWidth,n.clientWidth,r?r.scrollWidth:0,r?r.clientWidth:0),a=P(n.scrollHeight,n.clientHeight,r?r.scrollHeight:0,r?r.clientHeight:0),c=-o.scrollLeft+W(e),s=-o.scrollTop;return"rtl"===B(r||n).direction&&(c+=P(n.clientWidth,r?r.clientWidth:0)-i),{width:i,height:a,x:c,y:s}}(S(e)))}function je(e,t,n){var o="clippingParents"===t?function(e){var t=V(I(e)),n=["absolute","fixed"].indexOf(B(e).position)>=0,o=n&&R(e)?U(e):e;return T(o)?t.filter((function(e){return T(e)&&ye(e,o)&&"body"!==A(e)&&(!n||"static"!==B(e).position)})):[]}(e):[].concat(t),r=[].concat(o,[n]),i=r[0],a=r.reduce((function(t,n){var o=xe(e,n);return t.top=P(o.top,t.top),t.right=M(o.right,t.right),t.bottom=M(o.bottom,t.bottom),t.left=P(o.left,t.left),t}),xe(e,i));return a.width=a.right-a.left,a.height=a.bottom-a.top,a.x=a.left,a.y=a.top,a}function Te(e){return Object.assign({},{top:0,right:0,bottom:0,left:0},e)}function Re(e,t){return t.reduce((function(t,n){return t[n]=e,t}),{})}function Ee(e,t){void 0===t&&(t={});var n=t,o=n.placement,r=void 0===o?e.placement:o,i=n.boundary,a=void 0===i?"clippingParents":i,c=n.rootBoundary,s=void 0===c?$:c,p=n.elementContext,u=void 0===p?ee:p,l=n.altBoundary,f=void 0!==l&&l,d=n.padding,m=void 0===d?0:d,h=Te("number"!==typeof m?m:Re(m,K)),v=u===ee?"reference":ee,b=e.rects.popper,g=e.elements[f?v:u],O=je(T(g)?g:g.contextElement||S(e.elements.popper),a,s),y=L(e.elements.reference),w=de({reference:y,element:b,strategy:"absolute",placement:r}),x=we(Object.assign({},b,w)),j=u===ee?x:y,R={top:O.top-j.top+h.top,bottom:j.bottom-O.bottom+h.bottom,left:O.left-j.left+h.left,right:j.right-O.right+h.right},E=e.modifiersData.offset;if(u===ee&&E){var P=E[r];Object.keys(R).forEach((function(e){var t=[_,Y].indexOf(e)>=0?1:-1,n=[X,Y].indexOf(e)>=0?"y":"x";R[e]+=P[n]*t}))}return R}function Pe(e,t,n){return P(e,M(t,n))}function Me(e,t,n){return void 0===n&&(n={x:0,y:0}),{top:e.top-t.height-n.y,right:e.right-t.width+n.x,bottom:e.bottom-t.height+n.y,left:e.left-t.width-n.x}}function De(e){return[X,_,Y,J].some((function(t){return e[t]>=0}))}var Le=se({defaultModifiers:[{name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:function(e){var t=e.state,n=e.instance,o=e.options,r=o.scroll,i=void 0===r||r,a=o.resize,c=void 0===a||a,s=j(t.elements.popper),p=[].concat(t.scrollParents.reference,t.scrollParents.popper);return i&&p.forEach((function(e){e.addEventListener("scroll",n.update,pe)})),c&&s.addEventListener("resize",n.update,pe),function(){i&&p.forEach((function(e){e.removeEventListener("scroll",n.update,pe)})),c&&s.removeEventListener("resize",n.update,pe)}},data:{}},{name:"popperOffsets",enabled:!0,phase:"read",fn:function(e){var t=e.state,n=e.name;t.modifiersData[n]=de({reference:t.rects.reference,element:t.rects.popper,strategy:"absolute",placement:t.placement})},data:{}},{name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:function(e){var t=e.state,n=e.options,o=n.gpuAcceleration,r=void 0===o||o,i=n.adaptive,a=void 0===i||i,c=n.roundOffsets,s=void 0===c||c,p={placement:ue(t.placement),variation:le(t.placement),popper:t.elements.popper,popperRect:t.rects.popper,gpuAcceleration:r,isFixed:"fixed"===t.options.strategy};null!=t.modifiersData.popperOffsets&&(t.styles.popper=Object.assign({},t.styles.popper,he(Object.assign({},p,{offsets:t.modifiersData.popperOffsets,position:t.options.strategy,adaptive:a,roundOffsets:s})))),null!=t.modifiersData.arrow&&(t.styles.arrow=Object.assign({},t.styles.arrow,he(Object.assign({},p,{offsets:t.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:s})))),t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-placement":t.placement})},data:{}},{name:"applyStyles",enabled:!0,phase:"write",fn:function(e){var t=e.state;Object.keys(t.elements).forEach((function(e){var n=t.styles[e]||{},o=t.attributes[e]||{},r=t.elements[e];R(r)&&A(r)&&(Object.assign(r.style,n),Object.keys(o).forEach((function(e){var t=o[e];!1===t?r.removeAttribute(e):r.setAttribute(e,!0===t?"":t)})))}))},effect:function(e){var t=e.state,n={popper:{position:t.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(t.elements.popper.style,n.popper),t.styles=n,t.elements.arrow&&Object.assign(t.elements.arrow.style,n.arrow),function(){Object.keys(t.elements).forEach((function(e){var o=t.elements[e],r=t.attributes[e]||{},i=Object.keys(t.styles.hasOwnProperty(e)?t.styles[e]:n[e]).reduce((function(e,t){return e[t]="",e}),{});R(o)&&A(o)&&(Object.assign(o.style,i),Object.keys(r).forEach((function(e){o.removeAttribute(e)})))}))}},requires:["computeStyles"]},{name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:function(e){var t=e.state,n=e.options,o=e.name,r=n.offset,i=void 0===r?[0,0]:r,a=ne.reduce((function(e,n){return e[n]=function(e,t,n){var o=ue(e),r=[J,X].indexOf(o)>=0?-1:1,i="function"===typeof n?n(Object.assign({},t,{placement:e})):n,a=i[0],c=i[1];return a=a||0,c=(c||0)*r,[J,_].indexOf(o)>=0?{x:c,y:a}:{x:a,y:c}}(n,t.rects,i),e}),{}),c=a[t.placement],s=c.x,p=c.y;null!=t.modifiersData.popperOffsets&&(t.modifiersData.popperOffsets.x+=s,t.modifiersData.popperOffsets.y+=p),t.modifiersData[o]=a}},{name:"flip",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options,o=e.name;if(!t.modifiersData[o]._skip){for(var r=n.mainAxis,i=void 0===r||r,a=n.altAxis,c=void 0===a||a,s=n.fallbackPlacements,p=n.padding,u=n.boundary,l=n.rootBoundary,f=n.altBoundary,d=n.flipVariations,m=void 0===d||d,h=n.allowedAutoPlacements,v=t.options.placement,b=ue(v),g=s||(b===v||!m?[be(v)]:function(e){if(ue(e)===G)return[];var t=be(e);return[Oe(e),t,Oe(t)]}(v)),O=[v].concat(g).reduce((function(e,n){return e.concat(ue(n)===G?function(e,t){void 0===t&&(t={});var n=t,o=n.placement,r=n.boundary,i=n.rootBoundary,a=n.padding,c=n.flipVariations,s=n.allowedAutoPlacements,p=void 0===s?ne:s,u=le(o),l=u?c?te:te.filter((function(e){return le(e)===u})):K,f=l.filter((function(e){return p.indexOf(e)>=0}));0===f.length&&(f=l);var d=f.reduce((function(t,n){return t[n]=Ee(e,{placement:n,boundary:r,rootBoundary:i,padding:a})[ue(n)],t}),{});return Object.keys(d).sort((function(e,t){return d[e]-d[t]}))}(t,{placement:n,boundary:u,rootBoundary:l,padding:p,flipVariations:m,allowedAutoPlacements:h}):n)}),[]),y=t.rects.reference,w=t.rects.popper,x=new Map,j=!0,T=O[0],R=0;R<O.length;R++){var E=O[R],P=ue(E),M=le(E)===Q,D=[X,Y].indexOf(P)>=0,L=D?"width":"height",k=Ee(t,{placement:E,boundary:u,rootBoundary:l,altBoundary:f,padding:p}),A=D?M?_:J:M?Y:X;y[L]>w[L]&&(A=be(A));var S=be(A),W=[];if(i&&W.push(k[P]<=0),c&&W.push(k[A]<=0,k[S]<=0),W.every((function(e){return e}))){T=E,j=!1;break}x.set(E,W)}if(j)for(var B=function(e){var t=O.find((function(t){var n=x.get(t);if(n)return n.slice(0,e).every((function(e){return e}))}));if(t)return T=t,"break"},C=m?3:1;C>0;C--){if("break"===B(C))break}t.placement!==T&&(t.modifiersData[o]._skip=!0,t.placement=T,t.reset=!0)}},requiresIfExists:["offset"],data:{_skip:!1}},{name:"preventOverflow",enabled:!0,phase:"main",fn:function(e){var t=e.state,n=e.options,o=e.name,r=n.mainAxis,i=void 0===r||r,a=n.altAxis,c=void 0!==a&&a,s=n.boundary,p=n.rootBoundary,u=n.altBoundary,l=n.padding,f=n.tether,d=void 0===f||f,m=n.tetherOffset,h=void 0===m?0:m,v=Ee(t,{boundary:s,rootBoundary:p,padding:l,altBoundary:u}),b=ue(t.placement),g=le(t.placement),O=!g,y=fe(b),w="x"===y?"y":"x",x=t.modifiersData.popperOffsets,j=t.rects.reference,T=t.rects.popper,R="function"===typeof h?h(Object.assign({},t.rects,{placement:t.placement})):h,E="number"===typeof R?{mainAxis:R,altAxis:R}:Object.assign({mainAxis:0,altAxis:0},R),D=t.modifiersData.offset?t.modifiersData.offset[t.placement]:null,L={x:0,y:0};if(x){if(i){var k,A="y"===y?X:J,S="y"===y?Y:_,W="y"===y?"height":"width",B=x[y],C=B+v[A],H=B-v[S],I=d?-T[W]/2:0,F=g===Q?j[W]:T[W],V=g===Q?-T[W]:-j[W],q=t.elements.arrow,z=d&&q?N(q):{width:0,height:0},G=t.modifiersData["arrow#persistent"]?t.modifiersData["arrow#persistent"].padding:{top:0,right:0,bottom:0,left:0},K=G[A],Z=G[S],$=Pe(0,j[W],z[W]),ee=O?j[W]/2-I-$-K-E.mainAxis:F-$-K-E.mainAxis,te=O?-j[W]/2+I+$+Z+E.mainAxis:V+$+Z+E.mainAxis,ne=t.elements.arrow&&U(t.elements.arrow),oe=ne?"y"===y?ne.clientTop||0:ne.clientLeft||0:0,re=null!=(k=null==D?void 0:D[y])?k:0,ie=B+te-re,ae=Pe(d?M(C,B+ee-re-oe):C,B,d?P(H,ie):H);x[y]=ae,L[y]=ae-B}if(c){var ce,se="x"===y?X:J,pe="x"===y?Y:_,de=x[w],me="y"===w?"height":"width",he=de+v[se],ve=de-v[pe],be=-1!==[X,J].indexOf(b),ge=null!=(ce=null==D?void 0:D[w])?ce:0,Oe=be?he:de-j[me]-T[me]-ge+E.altAxis,ye=be?de+j[me]+T[me]-ge-E.altAxis:ve,we=d&&be?function(e,t,n){var o=Pe(e,t,n);return o>n?n:o}(Oe,de,ye):Pe(d?Oe:he,de,d?ye:ve);x[w]=we,L[w]=we-de}t.modifiersData[o]=L}},requiresIfExists:["offset"]},{name:"arrow",enabled:!0,phase:"main",fn:function(e){var t,n=e.state,o=e.name,r=e.options,i=n.elements.arrow,a=n.modifiersData.popperOffsets,c=ue(n.placement),s=fe(c),p=[J,_].indexOf(c)>=0?"height":"width";if(i&&a){var u=function(e,t){return Te("number"!==typeof(e="function"===typeof e?e(Object.assign({},t.rects,{placement:t.placement})):e)?e:Re(e,K))}(r.padding,n),l=N(i),f="y"===s?X:J,d="y"===s?Y:_,m=n.rects.reference[p]+n.rects.reference[s]-a[s]-n.rects.popper[p],h=a[s]-n.rects.reference[s],v=U(i),b=v?"y"===s?v.clientHeight||0:v.clientWidth||0:0,g=m/2-h/2,O=u[f],y=b-l[p]-u[d],w=b/2-l[p]/2+g,x=Pe(O,w,y),j=s;n.modifiersData[o]=((t={})[j]=x,t.centerOffset=x-w,t)}},effect:function(e){var t=e.state,n=e.options.element,o=void 0===n?"[data-popper-arrow]":n;null!=o&&("string"!==typeof o||(o=t.elements.popper.querySelector(o)))&&ye(t.elements.popper,o)&&(t.elements.arrow=o)},requires:["popperOffsets"],requiresIfExists:["preventOverflow"]},{name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:function(e){var t=e.state,n=e.name,o=t.rects.reference,r=t.rects.popper,i=t.modifiersData.preventOverflow,a=Ee(t,{elementContext:"reference"}),c=Ee(t,{altBoundary:!0}),s=Me(a,o),p=Me(c,r,i),u=De(s),l=De(p);t.modifiersData[n]={referenceClippingOffsets:s,popperEscapeOffsets:p,isReferenceHidden:u,hasPopperEscaped:l},t.attributes.popper=Object.assign({},t.attributes.popper,{"data-popper-reference-hidden":u,"data-popper-escaped":l})}}]}),ke=n(259),Ae=n(0),Se=["anchorEl","children","direction","disablePortal","modifiers","open","placement","popperOptions","popperRef","TransitionProps"],We=["anchorEl","children","container","direction","disablePortal","keepMounted","modifiers","open","placement","popperOptions","popperRef","style","transition"];function Be(e){return"function"===typeof e?e():e}var Ce={},He=c.forwardRef((function(e,t){var n=e.anchorEl,r=e.children,i=e.direction,a=e.disablePortal,s=e.modifiers,p=e.open,l=e.placement,f=e.popperOptions,d=e.popperRef,m=e.TransitionProps,h=Object(O.a)(e,Se),v=c.useRef(null),b=Object(y.a)(v,t),g=c.useRef(null),x=Object(y.a)(g,d),j=c.useRef(x);Object(w.a)((function(){j.current=x}),[x]),c.useImperativeHandle(d,(function(){return g.current}),[]);var T=function(e,t){if("ltr"===t)return e;switch(e){case"bottom-end":return"bottom-start";case"bottom-start":return"bottom-end";case"top-end":return"top-start";case"top-start":return"top-end";default:return e}}(l,i),R=c.useState(T),E=Object(o.a)(R,2),P=E[0],M=E[1];c.useEffect((function(){g.current&&g.current.forceUpdate()})),Object(w.a)((function(){if(n&&p){Be(n);var e=[{name:"preventOverflow",options:{altBoundary:a}},{name:"flip",options:{altBoundary:a}},{name:"onUpdate",enabled:!0,phase:"afterWrite",fn:function(e){var t=e.state;M(t.placement)}}];null!=s&&(e=e.concat(s)),f&&null!=f.modifiers&&(e=e.concat(f.modifiers));var t=Le(Be(n),v.current,Object(u.a)({placement:T},f,{modifiers:e}));return j.current(t),function(){t.destroy(),j.current(null)}}}),[n,a,s,p,f,T]);var D={placement:P};return null!==m&&(D.TransitionProps=m),Object(Ae.jsx)("div",Object(u.a)({ref:b,role:"tooltip"},h,{children:"function"===typeof r?r(D):r}))})),Ne=c.forwardRef((function(e,t){var n=e.anchorEl,r=e.children,i=e.container,a=e.direction,s=void 0===a?"ltr":a,p=e.disablePortal,l=void 0!==p&&p,f=e.keepMounted,d=void 0!==f&&f,m=e.modifiers,h=e.open,v=e.placement,b=void 0===v?"bottom":v,g=e.popperOptions,y=void 0===g?Ce:g,w=e.popperRef,j=e.style,T=e.transition,R=void 0!==T&&T,E=Object(O.a)(e,We),P=c.useState(!0),M=Object(o.a)(P,2),D=M[0],L=M[1];if(!d&&!h&&(!R||D))return null;var k=i||(n?Object(x.a)(Be(n)).body:void 0);return Object(Ae.jsx)(ke.a,{disablePortal:l,container:k,children:Object(Ae.jsx)(He,Object(u.a)({anchorEl:n,direction:s,disablePortal:l,modifiers:m,ref:t,open:R?!D:h,placement:b,popperOptions:y,popperRef:w},E,{style:Object(u.a)({position:"fixed",top:0,left:0,display:h||!d||R&&!D?null:"none"},j),TransitionProps:R?{in:h,onEnter:function(){L(!1)},onExited:function(){L(!0)}}:null,children:r}))})})),Ie=n(128),Fe=c.forwardRef((function(e,t){var n=Object(Ie.a)();return Object(Ae.jsx)(Ne,Object(a.a)({direction:null==n?void 0:n.direction},e,{ref:t}))})),Ve=n(55),qe=n(36),ze=n(1008).a,Ue=n(151),Xe=n(367),Ye=n(612),_e=["arrow","children","classes","components","componentsProps","describeChild","disableFocusListener","disableHoverListener","disableInteractive","disableTouchListener","enterDelay","enterNextDelay","enterTouchDelay","followCursor","id","leaveDelay","leaveTouchDelay","onClose","onOpen","open","placement","PopperComponent","PopperProps","title","TransitionComponent","TransitionProps"];var Je=Object(m.a)(Fe,{name:"MuiTooltip",slot:"Popper",overridesResolver:function(e,t){var n=e.ownerState;return[t.popper,!n.disableInteractive&&t.popperInteractive,n.arrow&&t.popperArrow,!n.open&&t.popperClose]}})((function(e){var t,n=e.theme,o=e.ownerState,i=e.open;return Object(a.a)({zIndex:n.zIndex.tooltip,pointerEvents:"none"},!o.disableInteractive&&{pointerEvents:"auto"},!i&&{pointerEvents:"none"},o.arrow&&(t={},Object(r.a)(t,'&[data-popper-placement*="bottom"] .'.concat(Ye.a.arrow),{top:0,marginTop:"-0.71em","&::before":{transformOrigin:"0 100%"}}),Object(r.a)(t,'&[data-popper-placement*="top"] .'.concat(Ye.a.arrow),{bottom:0,marginBottom:"-0.71em","&::before":{transformOrigin:"100% 0"}}),Object(r.a)(t,'&[data-popper-placement*="right"] .'.concat(Ye.a.arrow),Object(a.a)({},o.isRtl?{right:0,marginRight:"-0.71em"}:{left:0,marginLeft:"-0.71em"},{height:"1em",width:"0.71em","&::before":{transformOrigin:"100% 100%"}})),Object(r.a)(t,'&[data-popper-placement*="left"] .'.concat(Ye.a.arrow),Object(a.a)({},o.isRtl?{left:0,marginLeft:"-0.71em"}:{right:0,marginRight:"-0.71em"},{height:"1em",width:"0.71em","&::before":{transformOrigin:"0 0"}})),t))})),Ge=Object(m.a)("div",{name:"MuiTooltip",slot:"Tooltip",overridesResolver:function(e,t){var n=e.ownerState;return[t.tooltip,n.touch&&t.touch,n.arrow&&t.tooltipArrow,t["tooltipPlacement".concat(Object(b.a)(n.placement.split("-")[0]))]]}})((function(e){var t,n,o=e.theme,i=e.ownerState;return Object(a.a)({backgroundColor:Object(d.a)(o.palette.grey[700],.92),borderRadius:o.shape.borderRadius,color:o.palette.common.white,fontFamily:o.typography.fontFamily,padding:"4px 8px",fontSize:o.typography.pxToRem(11),maxWidth:300,margin:2,wordWrap:"break-word",fontWeight:o.typography.fontWeightMedium},i.arrow&&{position:"relative",margin:0},i.touch&&{padding:"8px 16px",fontSize:o.typography.pxToRem(14),lineHeight:"".concat((n=16/14,Math.round(1e5*n)/1e5),"em"),fontWeight:o.typography.fontWeightRegular},(t={},Object(r.a)(t,".".concat(Ye.a.popper,'[data-popper-placement*="left"] &'),Object(a.a)({transformOrigin:"right center"},i.isRtl?Object(a.a)({marginLeft:"14px"},i.touch&&{marginLeft:"24px"}):Object(a.a)({marginRight:"14px"},i.touch&&{marginRight:"24px"}))),Object(r.a)(t,".".concat(Ye.a.popper,'[data-popper-placement*="right"] &'),Object(a.a)({transformOrigin:"left center"},i.isRtl?Object(a.a)({marginRight:"14px"},i.touch&&{marginRight:"24px"}):Object(a.a)({marginLeft:"14px"},i.touch&&{marginLeft:"24px"}))),Object(r.a)(t,".".concat(Ye.a.popper,'[data-popper-placement*="top"] &'),Object(a.a)({transformOrigin:"center bottom",marginBottom:"14px"},i.touch&&{marginBottom:"24px"})),Object(r.a)(t,".".concat(Ye.a.popper,'[data-popper-placement*="bottom"] &'),Object(a.a)({transformOrigin:"center top",marginTop:"14px"},i.touch&&{marginTop:"24px"})),t))})),Ke=Object(m.a)("span",{name:"MuiTooltip",slot:"Arrow",overridesResolver:function(e,t){return t.arrow}})((function(e){var t=e.theme;return{overflow:"hidden",position:"absolute",width:"1em",height:"0.71em",boxSizing:"border-box",color:Object(d.a)(t.palette.grey[700],.9),"&::before":{content:'""',margin:"auto",display:"block",width:"100%",height:"100%",backgroundColor:"currentColor",transform:"rotate(45deg)"}}})),Qe=!1,Ze=null;function $e(e,t){return function(n){t&&t(n),e(n)}}var et=c.forwardRef((function(e,t){var n,r,u,l,d,m,O=Object(v.a)({props:e,name:"MuiTooltip"}),y=O.arrow,w=void 0!==y&&y,x=O.children,j=O.components,T=void 0===j?{}:j,R=O.componentsProps,E=void 0===R?{}:R,P=O.describeChild,M=void 0!==P&&P,D=O.disableFocusListener,L=void 0!==D&&D,k=O.disableHoverListener,A=void 0!==k&&k,S=O.disableInteractive,W=void 0!==S&&S,B=O.disableTouchListener,C=void 0!==B&&B,H=O.enterDelay,N=void 0===H?100:H,I=O.enterNextDelay,F=void 0===I?0:I,V=O.enterTouchDelay,q=void 0===V?700:V,z=O.followCursor,U=void 0!==z&&z,X=O.id,Y=O.leaveDelay,_=void 0===Y?0:Y,J=O.leaveTouchDelay,G=void 0===J?1500:J,K=O.onClose,Q=O.onOpen,Z=O.open,$=O.placement,ee=void 0===$?"bottom":$,te=O.PopperComponent,ne=O.PopperProps,oe=void 0===ne?{}:ne,re=O.title,ie=O.TransitionComponent,ae=void 0===ie?g.a:ie,ce=O.TransitionProps,se=Object(i.a)(O,_e),pe=Object(h.a)(),ue="rtl"===pe.direction,le=c.useState(),fe=Object(o.a)(le,2),de=fe[0],me=fe[1],he=c.useState(null),ve=Object(o.a)(he,2),be=ve[0],ge=ve[1],Oe=c.useRef(!1),ye=W||U,we=c.useRef(),xe=c.useRef(),je=c.useRef(),Te=c.useRef(),Re=Object(Xe.a)({controlled:Z,default:!1,name:"Tooltip",state:"open"}),Ee=Object(o.a)(Re,2),Pe=Ee[0],Me=Ee[1],De=Pe,Le=ze(X),ke=c.useRef(),Se=c.useCallback((function(){void 0!==ke.current&&(document.body.style.WebkitUserSelect=ke.current,ke.current=void 0),clearTimeout(Te.current)}),[]);c.useEffect((function(){return function(){clearTimeout(we.current),clearTimeout(xe.current),clearTimeout(je.current),Se()}}),[Se]);var We=function(e){clearTimeout(Ze),Qe=!0,Me(!0),Q&&!De&&Q(e)},Be=Object(Ve.a)((function(e){clearTimeout(Ze),Ze=setTimeout((function(){Qe=!1}),800+_),Me(!1),K&&De&&K(e),clearTimeout(we.current),we.current=setTimeout((function(){Oe.current=!1}),pe.transitions.duration.shortest)})),Ce=function(e){Oe.current&&"touchstart"!==e.type||(de&&de.removeAttribute("title"),clearTimeout(xe.current),clearTimeout(je.current),N||Qe&&F?xe.current=setTimeout((function(){We(e)}),Qe?F:N):We(e))},He=function(e){clearTimeout(xe.current),clearTimeout(je.current),je.current=setTimeout((function(){Be(e)}),_)},Ne=Object(Ue.a)(),Ie=Ne.isFocusVisibleRef,et=Ne.onBlur,tt=Ne.onFocus,nt=Ne.ref,ot=c.useState(!1),rt=Object(o.a)(ot,2)[1],it=function(e){et(e),!1===Ie.current&&(rt(!1),He(e))},at=function(e){de||me(e.currentTarget),tt(e),!0===Ie.current&&(rt(!0),Ce(e))},ct=function(e){Oe.current=!0;var t=x.props;t.onTouchStart&&t.onTouchStart(e)},st=Ce,pt=He;c.useEffect((function(){if(De)return document.addEventListener("keydown",e),function(){document.removeEventListener("keydown",e)};function e(e){"Escape"!==e.key&&"Esc"!==e.key||Be(e)}}),[Be,De]);var ut=Object(qe.a)(me,t),lt=Object(qe.a)(nt,ut),ft=Object(qe.a)(x.ref,lt);""===re&&(De=!1);var dt=c.useRef({x:0,y:0}),mt=c.useRef(),ht={},vt="string"===typeof re;M?(ht.title=De||!vt||A?null:re,ht["aria-describedby"]=De?Le:null):(ht["aria-label"]=vt?re:null,ht["aria-labelledby"]=De&&!vt?Le:null);var bt=Object(a.a)({},ht,se,x.props,{className:Object(s.a)(se.className,x.props.className),onTouchStart:ct,ref:ft},U?{onMouseMove:function(e){var t=x.props;t.onMouseMove&&t.onMouseMove(e),dt.current={x:e.clientX,y:e.clientY},mt.current&&mt.current.update()}}:{});var gt={};C||(bt.onTouchStart=function(e){ct(e),clearTimeout(je.current),clearTimeout(we.current),Se(),ke.current=document.body.style.WebkitUserSelect,document.body.style.WebkitUserSelect="none",Te.current=setTimeout((function(){document.body.style.WebkitUserSelect=ke.current,Ce(e)}),q)},bt.onTouchEnd=function(e){x.props.onTouchEnd&&x.props.onTouchEnd(e),Se(),clearTimeout(je.current),je.current=setTimeout((function(){Be(e)}),G)}),A||(bt.onMouseOver=$e(st,bt.onMouseOver),bt.onMouseLeave=$e(pt,bt.onMouseLeave),ye||(gt.onMouseOver=st,gt.onMouseLeave=pt)),L||(bt.onFocus=$e(at,bt.onFocus),bt.onBlur=$e(it,bt.onBlur),ye||(gt.onFocus=at,gt.onBlur=it));var Ot=c.useMemo((function(){var e,t=[{name:"arrow",enabled:Boolean(be),options:{element:be,padding:4}}];return null!=(e=oe.popperOptions)&&e.modifiers&&(t=t.concat(oe.popperOptions.modifiers)),Object(a.a)({},oe.popperOptions,{modifiers:t})}),[be,oe]),yt=Object(a.a)({},O,{isRtl:ue,arrow:w,disableInteractive:ye,placement:ee,PopperComponentProp:te,touch:Oe.current}),wt=function(e){var t=e.classes,n=e.disableInteractive,o=e.arrow,r=e.touch,i=e.placement,a={popper:["popper",!n&&"popperInteractive",o&&"popperArrow"],tooltip:["tooltip",o&&"tooltipArrow",r&&"touch","tooltipPlacement".concat(Object(b.a)(i.split("-")[0]))],arrow:["arrow"]};return Object(p.a)(a,Ye.b,t)}(yt),xt=null!=(n=T.Popper)?n:Je,jt=null!=(r=null!=(u=T.Transition)?u:ae)?r:g.a,Tt=null!=(l=T.Tooltip)?l:Ge,Rt=null!=(d=T.Arrow)?d:Ke,Et=f(xt,Object(a.a)({},oe,E.popper),yt),Pt=f(jt,Object(a.a)({},ce,E.transition),yt),Mt=f(Tt,Object(a.a)({},E.tooltip),yt),Dt=f(Rt,Object(a.a)({},E.arrow),yt);return Object(Ae.jsxs)(c.Fragment,{children:[c.cloneElement(x,bt),Object(Ae.jsx)(xt,Object(a.a)({as:null!=te?te:Fe,placement:ee,anchorEl:U?{getBoundingClientRect:function(){return{top:dt.current.y,left:dt.current.x,right:dt.current.x,bottom:dt.current.y,width:0,height:0}}}:de,popperRef:mt,open:!!de&&De,id:Le,transition:!0},gt,Et,{className:Object(s.a)(wt.popper,null==oe?void 0:oe.className,null==(m=E.popper)?void 0:m.className),popperOptions:Ot,children:function(e){var t,n,o=e.TransitionProps;return Object(Ae.jsx)(jt,Object(a.a)({timeout:pe.transitions.duration.shorter},o,Pt,{children:Object(Ae.jsxs)(Tt,Object(a.a)({},Mt,{className:Object(s.a)(wt.tooltip,null==(t=E.tooltip)?void 0:t.className),children:[re,w?Object(Ae.jsx)(Rt,Object(a.a)({},Dt,{className:Object(s.a)(wt.arrow,null==(n=E.arrow)?void 0:n.className),ref:ge})):null]}))}))}}))]})}));t.a=et},363:function(e,t,n){"use strict";var o=n(1);t.a=function(e,t){return o.isValidElement(e)&&-1!==t.indexOf(e.type.muiName)}},367:function(e,t,n){"use strict";var o=n(368);t.a=o.a},612:function(e,t,n){"use strict";n.d(t,"b",(function(){return i}));var o=n(97),r=n(113);function i(e){return Object(o.a)("MuiTooltip",e)}var a=Object(r.a)("MuiTooltip",["popper","popperInteractive","popperArrow","popperClose","tooltip","tooltipArrow","touch","tooltipPlacementLeft","tooltipPlacementRight","tooltipPlacementTop","tooltipPlacementBottom","arrow"]);t.a=a}}]);
//# sourceMappingURL=2.70184df8.chunk.js.map