(this["webpackJsonpgenshin-optimizer"]=this["webpackJsonpgenshin-optimizer"]||[]).push([[3],{207:function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));var n=a(2),c=a(0),l=a(128),i=a(1);function s(e){var t=e.value,a=e.onChange,s=e.className,r=void 0===s?"":s,o=e.disabled,d=void 0!==o&&o,u=e.float,j=void 0!==u&&u,b=e.placeholder,h=e.allowEmpty,x=void 0!==h&&h,v=e.max,O=e.min,m=Object(c.useState)(""),f=Object(n.a)(m,2),p=f[0],y=f[1],g=Object(c.useCallback)((function(){if(x&&""===p)return a(void 0);if(""===p)return a(0);var e=j?parseFloat:parseInt;a(e(p))}),[a,p,j,x]);return Object(c.useEffect)((function(){var e;return y(null!==(e=null===t||void 0===t?void 0:t.toString())&&void 0!==e?e:"")}),[t,y]),Object(i.jsx)(l.a,{value:p,"aria-label":"custom-input",className:"hide-appearance ".concat(r),type:"number",placeholder:b,onChange:function(e){return y(e.target.value)},onBlur:g,disabled:d,onKeyDown:function(e){return"Enter"===e.key&&g()},max:v,min:O})}},208:function(e,t,a){"use strict";a.d(t,"a",(function(){return j}));var n=a(29),c=a(10),l=a(0),i=a(222),s=a(217),r=a(334),o=a(97),d=a(204),u=a(1);function j(e){var t,a,j=e.field,b=e.index,h=e.className,x=void 0===h?"p-2":h,v=Object(l.useContext)(o.a),O=v.newBuild,m=v.equippedBuild,f=v.compareBuild,p=O||m,y=Object(l.useMemo)((function(){var e;return!!p&&(null===j||void 0===j||null===(e=j.canShow)||void 0===e?void 0:e.call(j,p))}),[j,p]),g=(null===j||void 0===j?void 0:j.fixed)||0,N=Object(l.useMemo)((function(){if(j.value)return d.a.getTalentFieldValue(j,"value",p);if(j.formula){var e,t,a=null===(e=d.a.getTalentFieldValue(j,"formula",p))||void 0===e||null===(t=e[0])||void 0===t?void 0:t.call(e,p);if(f&&m&&"number"===typeof a){var n,c,l,i,s,r,o,b,h,x=j.value?j.value:null===(n=j.formula)||void 0===n||null===(c=n.call(j,m))||void 0===c||null===(l=c[0])||void 0===l?void 0:l.call(c,m);"function"===typeof x&&(x=parseInt(null===(i=x)||void 0===i||null===(s=i(m))||void 0===s||null===(r=s.toFixed)||void 0===r?void 0:r.call(s,g)));var v=a-x;a=Object(u.jsxs)("span",{children:[null!==(o=null===(b=x)||void 0===b?void 0:b.toFixed(g))&&void 0!==o?o:x,v?Object(u.jsxs)("span",{className:v>0?"text-success":"text-danger",children:[" (",v>0?"+":"",(null===v||void 0===v||null===(h=v.toFixed)||void 0===h?void 0:h.call(v,g))||v,")"]}):""]})}return a}}),[f,g,m,j,p]),S=Object(l.useMemo)((function(){return d.a.getTalentFieldValue(j,"text",p)}),[j,p]),k=Object(l.useMemo)((function(){return d.a.getTalentFieldValue(j,"variant",p)}),[j,p]),V=Object(l.useMemo)((function(){var e=d.a.getTalentFieldValue(j,"formulaText",p);return e?Object(u.jsx)(i.a,{placement:"top",overlay:Object(u.jsx)(s.a,{id:"field-formula",children:e}),children:Object(u.jsx)(c.a,{icon:n.x,className:"ml-2",style:{cursor:"help"}})}):null}),[j,p]),C=Object(l.useMemo)((function(){return d.a.getTalentFieldValue(j,"unit",p)}),[j,p]);return y?Object(u.jsxs)(r.a.Item,{variant:b%2?"customdark":"customdarker",className:x,children:[Object(u.jsxs)("span",{children:[Object(u.jsx)("b",{children:S}),V]}),Object(u.jsxs)("span",{className:"float-right text-right text-".concat(k),children:[null!==(t=null===N||void 0===N||null===(a=N.toFixed)||void 0===a?void 0:a.call(N,g))&&void 0!==t?t:N,C]})]}):null}},213:function(e,t,a){"use strict";a.d(t,"a",(function(){return s}));var n=a(8),c=a(0),l=a(45),i=a(36);function s(e){var t=Object(c.useContext)(l.b);return Object(c.useCallback)((function(a){if(e)if("type"in a)switch(a.type){case"weapon":t.setWeaponLocation(a.id,e);break;case"bonusStats":var c=t._getChar(e),l=a.statKey,s=a.value,r=c.bonusStats;if(r[l]===s)return;!s||i.d.includes(l)&&Object(i.a)(c)[l]===s?delete r[l]:r[l]=s,t.updateChar(Object(n.a)(Object(n.a)({},c),{},{bonusStats:r}))}else t.updateChar(Object(n.a)(Object(n.a)({},t._getChar(e)),a))}),[e,t])}},223:function(e,t,a){"use strict";a.d(t,"a",(function(){return N}));var n=a(0),c=a.n(n),l=a(334),i=a(97),s=a(11),r=a(2),o=a(12),d=a(187),u=a(100),j=a(29),b=a(10),h=a(188),x=a(118),v=a(186),O=a(1);function m(e){var t=e.conditional,a=e.conditionalValue,n=e.setConditional,l=e.name,i=e.disabled,d=e.stats,u=Object(r.a)(a,2),m=u[0],f=void 0===m?0:m,p=u[1];if(!t)return l;if("states"in t){var y=p?t.states[p]:Object.values(t.states)[0],g=0===f?"Not Active":Object(O.jsxs)("span",{children:[y.name," ",Object(s.f)(y.maxStack,d)>1?": ".concat(f," stack").concat(f>1?"s":""):""]}),N=Object(O.jsx)(h.a,{variant:0===f?"secondary":"success",children:g});return Object(O.jsxs)(v.a,{children:[Object(O.jsx)(v.a.Toggle,{size:"sm",disabled:i,children:Object(O.jsxs)("h6",{className:"mb-0 d-inline",style:{whiteSpace:"normal"},children:[l," ",N]})}),Object(O.jsxs)(v.a.Menu,{children:[Object(O.jsx)(v.a.Item,{onClick:function(){return n([0])},children:Object(O.jsx)("span",{children:"Not Active"})}),Object.entries(t.states).map((function(e,t){var a=Object(r.a)(e,2),l=a[0],i=a[1];return Object(O.jsx)(c.a.Fragment,{children:Object(o.a)(Array(i.maxStack).keys()).map((function(e){return e+1})).map((function(e,t){return Object(O.jsxs)(v.a.Item,{onClick:function(){return n([e,l])},children:[i.name,i.maxStack>1?": ".concat(e," stack").concat(e>1?"s":""):""]},l+t)}))},t)}))]})]})}var S=Object(s.f)(t.maxStack,d);if(S>1){var k=Object(O.jsx)(h.a,{variant:0===f?"secondary":"success",children:f>0?"".concat(f," stack").concat(f>1?"s":""):"Not Active"});return Object(O.jsxs)(v.a,{children:[Object(O.jsx)(v.a.Toggle,{size:"sm",disabled:i,children:Object(O.jsxs)("h6",{className:"mb-0 d-inline",style:{whiteSpace:"normal"},children:[l," ",k]})}),Object(O.jsxs)(v.a.Menu,{children:[Object(O.jsx)(v.a.Item,{onClick:function(){return n([0])},children:Object(O.jsx)("span",{children:"Not Active"})}),Object(o.a)(Array(S).keys()).map((function(e){return e+1})).map((function(e){return Object(O.jsx)(v.a.Item,{onClick:function(){return n([e])},children:"".concat(e," stack").concat(e>1?"s":"")},e)}))]})]})}return 1===S?Object(O.jsx)(x.a,{size:"sm",onClick:function(){return n([f?0:1])},disabled:i,children:Object(O.jsxs)("h6",{className:"mb-0",children:[Object(O.jsx)(b.a,{icon:f?j.f:j.B})," ",l]})}):null}var f=a(213),p=a(98),y=a(208);function g(e){var t=e.conditional,a=e.characterKey,c=e.fieldClassName,j=Object(n.useContext)(i.a),b=j.newBuild,h=j.equippedBuild,x=Object(f.a)(a),v=b||h,g=Object(n.useMemo)((function(){return u.a.canShow(t,v)}),[t,v]),N=Object(n.useMemo)((function(){return g&&u.a.resolve(t,v,void 0)}),[g,t,v]),S=N.stats,k=void 0===S?{}:S,V=N.fields,C=void 0===V?[]:V,B=N.conditionalValue,F=Object(n.useMemo)((function(){return g&&[].concat(Object(o.a)(Object(p.a)(k,v)),Object(o.a)(C))}),[g,k,v,C]),w=Object(n.useCallback)((function(e){if(v){var a=Object(r.a)(e,1)[0];(void 0===a?0:a)?t.keys&&Object(s.k)(v.conditionalValues,t.keys,e):(Object(s.e)(v.conditionalValues,t.keys),Object(s.l)(v.conditionalValues)),x({conditionalValues:v.conditionalValues})}}),[t,v,x]);return g&&v?Object(O.jsxs)(d.a,{bg:"darkcontent",text:"lightfont",className:"mb-2 w-100",children:[Object(O.jsx)(d.a.Header,{className:"p-2",children:Object(O.jsx)(m,{conditional:t,conditionalValue:B,setConditional:w,name:t.name,stats:v})}),Object(O.jsx)(l.a,{className:"text-white",variant:"flush",children:F.map((function(e,t){return Object(O.jsx)(y.a,{index:t,field:e,className:c},t)}))})]}):null}function N(e){var t=e.sections,a=e.characterKey,c=Object(n.useContext)(i.a),r=c.newBuild,o=c.equippedBuild,d=r||o;return d?Object(O.jsx)("div",{className:"w-100",children:null===t||void 0===t?void 0:t.map((function(e,t){var n,c;if(!e.canShow(d))return null;var i=Object(s.f)(e.text,d),r=null!==(n=e.fields)&&void 0!==n?n:[];return Object(O.jsxs)("div",{className:"my-2",children:[Object(O.jsxs)("div",{children:[Object(O.jsx)("div",{className:"mb-2",children:i}),r.length>0&&Object(O.jsx)(l.a,{className:"text-white mb-2",children:null===r||void 0===r||null===(c=r.map)||void 0===c?void 0:c.call(r,(function(e,t){return Object(O.jsx)(y.a,{index:t,field:e},t)}))})]}),!!e.conditional&&Object(O.jsx)(g,{conditional:e.conditional,characterKey:a})]},"section"+t)}))}):null}},286:function(e,t,a){"use strict";a.d(t,"a",(function(){return j}));var n=a(187),c=a(188),l=a(334),i=a(223),s=a(208),r=a(111),o=a(98),d=a(112),u=a(1);function j(e){var t=e.setKey,a=e.setNumKey,j=e.equippedBuild,b=e.newBuild,h=e.characterKey,x=Object(r.a)(d.a.get(t),[t]);if(!x)return null;var v=null!==b&&void 0!==b?b:j,O=x.setEffectDesc(a),m=x.setNumStats(a,v),f=Object(o.a)(m,v),p=x.setEffectDocument(a);return Object(u.jsxs)(u.Fragment,{children:[Object(u.jsxs)(n.a,{bg:"darkcontent",text:"lightfont",className:"mb-2 w-100",children:[Object(u.jsxs)(n.a.Header,{className:"p-2",children:[Object(u.jsxs)(c.a,{variant:"success",children:[a,"-Set"]})," ",O]}),Object(u.jsx)(l.a,{className:"text-white",variant:"flush",children:f.map((function(e,t){return Object(u.jsx)(s.a,{index:t,field:e},t)}))})]}),p?Object(u.jsx)(i.a,{sections:p,characterKey:h}):null]})}},287:function(e,t,a){"use strict";a.d(t,"e",(function(){return M})),a.d(t,"f",(function(){return _})),a.d(t,"d",(function(){return A})),a.d(t,"b",(function(){return R})),a.d(t,"a",(function(){return D})),a.d(t,"g",(function(){return z})),a.d(t,"c",(function(){return L}));var n=a(12),c=a(8),l=a(2),i=a(29),s=a(10),r=a(0),o=a(186),d=a(541),u=a(335),j=a(187),b=a(558),h=a(118),x=a(121),v=a(70),O=a(239),m=a(188),f=a(289),p=a(97),y=a(115),g=a(69),N=a(213),S=a(111),k=a(33),V=a(210),C=a(15),B=a(36),F=a(204),w=a(212),K=a(288),E=a(1),T={"":Object(E.jsx)("span",{children:"No External Infusion"}),pyro:Object(E.jsxs)("span",{children:[y.b.pyro," Pyro Infusion"]}),cryo:Object(E.jsxs)("span",{children:[y.b.cryo," Cryo Infusion"]})};function M(e){var t=e.characterSheet,a=e.character,n=a.infusionAura,c=void 0===n?"":n,i=a.key,s=e.className,r=e.disabled,d=void 0!==r&&r,u=Object(N.a)(i);return t.isMelee()?Object(E.jsxs)(o.a,{className:s,children:[Object(E.jsx)(o.a.Toggle,{variant:c||"secondary",disabled:d,children:T[c]}),Object(E.jsx)(o.a.Menu,{children:Object.entries(T).map((function(e){var t=Object(l.a)(e,2),a=t[0],n=t[1];return Object(E.jsx)(o.a.Item,{className:"text-".concat(a),onClick:function(){return u({infusionAura:a})},children:n},a)}))})]}):null}function _(e){var t=e.character,a=t.reactionMode,n=void 0===a?null:a,c=t.infusionAura,l=t.key,i=e.build,s=e.className,r=e.disabled,o=void 0!==r&&r,j=Object(N.a)(l);if(!i)return null;var b=i.characterEle;if(!["pyro","hydro","cryo"].includes(b)&&!["pyro","hydro","cryo"].includes(c))return null;var h=function(e){return e?"success":"secondary"};return Object(E.jsxs)(d.a,{className:s,type:"radio",name:"reactionMode",value:n,onChange:function(e){return j({reactionMode:"none"===e?null:e})},children:[Object(E.jsx)(u.a,{value:"none",variant:h(!n),disabled:o,children:"No Reactions"}),("pyro"===b||"pyro"===c)&&Object(E.jsx)(u.a,{value:"pyro_vaporize",variant:h("pyro_vaporize"===n),disabled:o,children:Object(E.jsxs)("span",{className:"text-vaporize",children:["Vaporize(Pyro) ",y.a.hydro,"+",y.a.pyro]})}),("pyro"===b||"pyro"===c)&&Object(E.jsx)(u.a,{value:"pyro_melt",variant:h("pyro_melt"===n),disabled:o,children:Object(E.jsxs)("span",{className:"text-melt",children:["Melt(Pyro) ",y.a.cryo,"+",y.a.pyro]})}),("hydro"===b||"hydro"===c)&&Object(E.jsx)(u.a,{value:"hydro_vaporize",variant:h("hydro_vaporize"===n),disabled:o,children:Object(E.jsxs)("span",{className:"text-vaporize",children:["Vaporize(Hydro) ",y.a.pyro,"+",y.a.hydro]})}),("cryo"===b||"cryo"===c)&&Object(E.jsx)(u.a,{value:"cryo_melt",variant:h("cryo_melt"===n),disabled:o,children:Object(E.jsxs)("span",{className:"text-melt",children:["Melt(Cryo) ",y.a.pyro,"+",y.a.cryo]})})]})}function A(e){var t=e.characterKey,a=e.hitMode,n=e.className,c=e.disabled,l=void 0!==c&&c,i=Object(N.a)(t),s=function(e){return e?"success":"secondary"};return Object(E.jsxs)(d.a,{type:"radio",value:a,name:"hitOptions",onChange:function(e){return i({hitMode:e})},className:n,children:[Object(E.jsx)(u.a,{value:"avgHit",variant:s("avgHit"===a),disabled:l,children:"Avg. DMG"}),Object(E.jsx)(u.a,{value:"hit",variant:s("hit"===a),disabled:l,children:"Non Crit DMG"}),Object(E.jsx)(u.a,{value:"critHit",variant:s("critHit"===a),disabled:l,children:"Crit Hit DMG"})]})}function H(e){var t=e.sheets,a=e.build,n=Object(r.useMemo)((function(){return a&&F.a.getDisplayStatKeys(a,t)}),[a,t]);return a?Object(E.jsx)("div",{children:Object.entries(n).map((function(e){var n=Object(l.a)(e,2),c=n[0],i=n[1],s=Object(w.a)(c,t,a.characterEle);return Object(E.jsxs)(j.a,{bg:"darkcontent",text:"lightfont",className:"w-100 mb-2",children:[Object(E.jsx)(j.a.Header,{children:s}),Object(E.jsx)(j.a.Body,{className:"p-2",children:Object(E.jsx)(b.a,{className:"mb-n2",children:i.map((function(e,t){if(Array.isArray(e))return Object(E.jsx)(I,{fieldKeys:e,build:a,fieldIndex:t},t);if("string"===typeof e){var n=k.b.getPrintableFormulaStatKeyList(Object(V.a)(a,null===a||void 0===a?void 0:a.modifiers,[e]),null===a||void 0===a?void 0:a.modifiers).reverse();return Boolean(n.length)&&Object(E.jsxs)(j.a,{bg:"lightcontent",text:"lightfont",className:"mb-2",children:[Object(E.jsx)(b.a.Toggle,{as:j.a.Header,className:"p-2 cursor-pointer",variant:"link",eventKey:"field".concat(t),children:k.b.printStat(e,a)}),Object(E.jsx)(b.a.Collapse,{eventKey:"field".concat(t),children:Object(E.jsx)(j.a.Body,{className:"p-2",children:Object(E.jsx)("div",{className:"mb-n2",children:n.map((function(e){return Object(E.jsxs)("p",{className:"mb-2",children:[k.b.printStat(e,a)," = ",Object(E.jsx)("small",{children:Object(E.jsx)(k.a,{statKey:e,stats:a,modifiers:a.modifiers,expand:!1})})]},e)}))})})})]},t)}return null}))})})]},c)}))}):null}function R(e){var t=e.character,a=e.character.key,l=e.bsProps,r=void 0===l?{xs:12,xl:6}:l,o=Object(N.a)(a),d=Object(B.a)(t);return Object(E.jsxs)(j.a,{className:"mb-2",bg:"darkcontent",text:"lightfont",children:[Object(E.jsx)(j.a.Header,{children:Object(E.jsx)("h6",{children:"Enemy Editor"})}),Object(E.jsxs)(j.a.Body,{className:"p-2",children:[Object(E.jsx)(h.a,{variant:"warning",size:"sm",className:"mb-2",children:Object(E.jsx)("a",{href:"https://genshin-impact.fandom.com/wiki/Resistance#Base_Enemy_Resistances",target:"_blank",rel:"noreferrer",children:"To get the specific resistance values of enemies, please visit the wiki."})}),Object(E.jsxs)(x.a,{children:[Object(E.jsx)(v.a,Object(c.a)(Object(c.a)({className:"mb-2"},r),{},{children:Object(E.jsx)(K.a,{name:Object(E.jsx)("b",{children:"Enemy Level"}),value:F.a.getStatValueWithBonus(t,"enemyLevel"),placeholder:k.b.getStatNameRaw("enemyLevel"),defaultValue:d.enemyLevel,onValueChange:function(e){return o({type:"bonusStats",statKey:"enemyLevel",value:e})}})})),["physical"].concat(Object(n.a)(C.d)).map((function(e){var a="".concat(e,"_enemyRes_"),n="".concat(e,"_enemyImmunity"),l=F.a.getStatValueWithBonus(t,n);return Object(E.jsx)(v.a,Object(c.a)(Object(c.a)({className:"mb-2"},r),{},{children:Object(E.jsx)(K.a,{prependEle:Object(E.jsxs)(h.a,{variant:e,onClick:function(){return o({type:"bonusStats",statKey:n,value:!l})},className:"text-darkcontent",children:[Object(E.jsx)(s.a,{icon:l?i.f:i.B,className:"fa-fw"})," Immunity"]}),name:Object(E.jsx)("b",{children:k.b.getStatName(a)}),value:F.a.getStatValueWithBonus(t,a),placeholder:k.b.getStatNameRaw(a),defaultValue:d[a],onValueChange:function(e){return o({type:"bonusStats",statKey:a,value:e})},disabled:l,percent:!0})}),e)})),Object(E.jsx)(v.a,Object(c.a)(Object(c.a)({className:"mb-2"},r),{},{children:Object(E.jsx)(K.a,{name:Object(E.jsx)("b",{children:k.b.getStatName("enemyDEFRed_")}),value:F.a.getStatValueWithBonus(t,"enemyDEFRed_"),placeholder:k.b.getStatNameRaw("enemyDEFRed_"),defaultValue:d.enemyDEFRed_,onValueChange:function(e){return o({type:"bonusStats",statKey:"enemyDEFRed_",value:e})},percent:!0})}))]}),Object(E.jsx)("small",{children:"Note: Genshin Impact halves resistance shred values below 0%. For the sake of calculations enter the RAW value and GO will do the rest. (e.g. 10% - 20% = -10%)"})]})]})}function I(e){var t,a,n,c,i=e.fieldKeys,s=e.build,r=e.fieldIndex,o=Object(S.a)(g.a.get(i),[i]);if(!o)return null;var d=o.field,u=F.a.getTalentFieldValue(d,"text",s),h=F.a.getTalentFieldValue(d,"variant",s),x=F.a.getTalentFieldValue(d,"formulaText",s),v=null!==(t=F.a.getTalentFieldValue(d,"fixed",s))&&void 0!==t?t:0,O=null!==(a=F.a.getTalentFieldValue(d,"unit",s))&&void 0!==a?a:"",m=F.a.getTalentFieldValue(d,"formula",s,[]),f=Object(l.a)(m,2),p=f[0],y=f[1];if(!p||!y)return null;var N=null===p||void 0===p||null===(n=p(s))||void 0===n||null===(c=n.toFixed)||void 0===c?void 0:c.call(n,v),C=k.b.getPrintableFormulaStatKeyList(Object(V.a)(s,null===s||void 0===s?void 0:s.modifiers,y),null===s||void 0===s?void 0:s.modifiers).reverse();return Object(E.jsxs)(j.a,{bg:"lightcontent",text:"lightfont",className:"mb-2",children:[Object(E.jsxs)(b.a.Toggle,{as:j.a.Header,className:"p-2 cursor-pointer",variant:"link",eventKey:"field".concat(r),children:[Object(E.jsx)("b",{className:"text-".concat(h),children:u})," ",Object(E.jsxs)("span",{className:"text-info",children:[N,O]})]}),Object(E.jsx)(b.a.Collapse,{eventKey:"field".concat(r),children:Object(E.jsx)(j.a.Body,{className:"p-2",children:Object(E.jsxs)("div",{className:"mb-n2",children:[Object(E.jsxs)("p",{className:"mb-2",children:[Object(E.jsx)("b",{className:"text-".concat(h),children:u})," ",Object(E.jsx)("span",{className:"text-info",children:N})," = ",Object(E.jsx)("small",{children:x})]}),C.map((function(e){return Object(E.jsxs)("p",{className:"mb-2",children:[k.b.printStat(e,s)," = ",Object(E.jsx)("small",{children:Object(E.jsx)(k.a,{statKey:e,stats:s,modifiers:s.modifiers,expand:!1})})]},e)}))]})})})]})}var D=function(e){var t=e.eventKey,a=e.callback,n=Object(r.useContext)(O.a),c=Object(f.b)(t,(function(){return a&&a(t)})),l=n===t;return Object(E.jsxs)(h.a,{onClick:c,variant:"info",size:"sm",children:[Object(E.jsx)(s.a,{icon:l?i.L:i.K,className:"fa-fw ".concat(l?"fa-rotate-180":"")}),Object(E.jsx)("span",{children:" "}),l?"Retract":"Expand"]})};function z(e){var t=e.sheets,a=e.sheets,c=a.characterSheet,l=(a.weaponSheet,e.character),i=e.character,s=i.hitMode,o=i.key,d=Object(r.useContext)(p.a),u=d.newBuild,O=d.equippedBuild,f=u||O;return Object(E.jsxs)("div",{className:"mb-2",children:[Object(E.jsx)(j.a,{bg:"lightcontent",text:"lightfont",className:"mb-2",children:Object(E.jsx)(j.a.Header,{children:Object(E.jsxs)(x.a,{className:"mb-n2",children:[Object(E.jsx)(v.a,{xs:"auto",children:Object(E.jsx)(M,{characterSheet:c,character:l,className:"mb-2"})}),Object(E.jsx)(v.a,{xs:"auto",children:Object(E.jsx)(A,{characterKey:o,hitMode:s,className:"mb-2"})}),Object(E.jsx)(v.a,{xs:"auto",children:Object(E.jsx)(_,{character:l,build:f,className:"mb-2"})})]})})}),Object(E.jsx)(b.a,{children:Object(E.jsxs)(j.a,{bg:"lightcontent",text:"lightfont",className:"mb-2",children:[Object(E.jsx)(j.a.Header,{children:Object(E.jsxs)(x.a,{children:[Object(E.jsxs)(v.a,{children:["Formulas ","&"," Calculations"]}),Object(E.jsx)(v.a,{xs:"auto",children:Object(E.jsx)(D,{callback:void 0,as:h.a,eventKey:"details"})})]})}),Object(E.jsx)(b.a.Collapse,{eventKey:"details",children:Object(E.jsx)(j.a.Body,{className:"p-2",children:Object(E.jsx)(H,{sheets:t,build:f})})})]})}),Object(E.jsx)(b.a,{children:Object(E.jsxs)(j.a,{bg:"lightcontent",text:"lightfont",className:"mb-2",children:[Object(E.jsx)(j.a.Header,{children:Object(E.jsxs)(x.a,{children:[Object(E.jsx)(v.a,{children:Object(E.jsxs)("h4",{className:"mb-0",children:[Object(E.jsxs)(m.a,{pill:!0,variant:"success",className:"mr-2",children:[k.b.getStatName("enemyLevel")," ",Object(E.jsx)("strong",{children:F.a.getStatValueWithBonus(l,"enemyLevel")})]}),["physical"].concat(Object(n.a)(C.d)).map((function(e){return Object(E.jsx)("span",{className:"mr-2",children:Object(E.jsx)(L,{element:e,character:l})},e)})),Object(E.jsx)("span",{children:Object(E.jsxs)("h6",{className:"d-inline",children:["DEF Reduction ",F.a.getStatValueWithBonus(l,"enemyDEFRed_"),"%"]})})]})}),Object(E.jsx)(v.a,{xs:"auto",children:Object(E.jsx)(D,{callback:void 0,as:h.a,eventKey:"enemyEditor"})})]})}),Object(E.jsx)(b.a.Collapse,{eventKey:"enemyEditor",children:Object(E.jsx)(j.a.Body,{className:"p-2",children:Object(E.jsx)(R,{character:l})})})]})})]})}function L(e){var t=e.character,a=e.element,n=!!F.a.getStatValueWithBonus(t,"".concat(a,"_enemyImmunity")),c="".concat(a,"_enemyRes_"),l=n?Object(E.jsxs)("span",{children:[y.b[a]," IMMUNE"]}):Object(E.jsxs)("span",{children:[y.b[a],"RES ",Object(E.jsxs)("strong",{children:[F.a.getStatValueWithBonus(t,c),"%"]})]});return Object(E.jsx)("h6",{className:"text-".concat(a," d-inline"),children:l})}},288:function(e,t,a){"use strict";var n=a(8),c=a(124),l=a(29),i=a(10),s=a(118),r=a(230),o=a(222),d=a(217),u=a(207),j=a(1);t.a=function(e){var t=e.name,a=e.prependEle,b=e.value,h=e.placeholder,x=e.defaultValue,v=void 0===x?0:x,O=e.onValueChange,m=e.percent,f=void 0!==m&&m,p=e.disabled,y=void 0!==p&&p,g=Object(c.a)(e,["name","prependEle","value","placeholder","defaultValue","onValueChange","percent","disabled"]);return Object(j.jsxs)(r.a,Object(n.a)(Object(n.a)({},g),{},{children:[a?Object(j.jsx)(r.a.Prepend,{children:a}):null,Object(j.jsx)(r.a.Prepend,{children:Object(j.jsx)(r.a.Text,{children:t})}),Object(j.jsx)(u.a,{float:f,placeholder:h,value:b,onChange:O,disabled:y}),Object(j.jsxs)(r.a.Append,{children:[Boolean(f)&&Object(j.jsx)(r.a.Text,{children:"%"}),void 0!==v&&Object(j.jsx)(o.a,{placement:"top",overlay:Object(j.jsx)(d.a,{id:"reset-tooltip",children:"Reset this override to the default value."}),children:Object(j.jsx)("span",{className:"d-inline-block",children:Object(j.jsx)(s.a,{onClick:function(){return O(v)},disabled:y||b===v,style:b===v?{pointerEvents:"none"}:{},children:Object(j.jsx)(i.a,{icon:l.H})})})})]})]}))}},290:function(e,t,a){"use strict";a.d(t,"a",(function(){return d}));var n=a(2),c=a(121),l=a(70),i=a(187),s=a(291),r=a(212),o=a(1);function d(e){var t=e.sheets,a=e.sheets,d=a.characterSheet,u=a.weaponSheet,j=e.character,b=e.equippedBuild,h=e.newBuild,x=e.statsDisplayKeys,v=e.cardbg,O=void 0===v?"darkcontent":v,m=h||b;return Object(o.jsx)(c.a,{className:"mb-n2",children:Object.entries(x).map((function(e){var a=Object(n.a)(e,2),x=a[0],v=a[1],f=Object(r.a)(x,t,null===m||void 0===m?void 0:m.characterEle);return Object(o.jsx)(l.a,{className:"mb-2",xs:12,md:6,xl:4,children:Object(o.jsxs)(i.a,{bg:O,text:"lightfont",className:"h-100",children:[Object(o.jsx)(i.a.Header,{children:f}),Object(o.jsx)(i.a.Body,{children:Object(o.jsx)(c.a,{children:v.map((function(e){return Object(o.jsx)(s.a,{characterSheet:d,weaponSheet:u,character:j,equippedBuild:b,newBuild:h,statKey:e},JSON.stringify(e))}))})})]})},x)}))})}},291:function(e,t,a){"use strict";a.d(t,"a",(function(){return h}));var n=a(0),c=a(70),l=a(121),i=a(204),s=a(69),r=a(111),o=a(33),d=a(36),u=a(115),j=a(1);function b(e){var t,a,n=e.label,i=void 0===n?"":n,s=e.val,r=e.oldVal,o=e.fixed,d=void 0===o?0:o,u=e.unit,b=void 0===u?"":u,h=e.hasBonus,x=void 0!==h&&h;"undefined"===typeof r&&"number"===typeof s&&(r=s,s=void 0);var v=void 0!==s?s-r:0,O="",m="";r||0===v?O=null===(t=r)||void 0===t?void 0:t.toFixed(d):void 0===r&&(O=null===(a=s)||void 0===a?void 0:a.toFixed(d)),O&&(O=Object(j.jsxs)("span",{children:[O,b]})),0!==v&&(m=Object(j.jsxs)("span",{className:"text-".concat(v>0?"success":"danger"),children:[v>0?"+":"",null===v||void 0===v?void 0:v.toFixed(d),b]}));var f=Object(j.jsxs)(j.Fragment,{children:[O,m]});return Object(j.jsx)(c.a,{xs:"12",children:Object(j.jsxs)(l.a,{children:[Object(j.jsx)(c.a,{children:Object(j.jsx)("b",{children:i})}),Object(j.jsx)(c.a,{xs:"auto",children:x?Object(j.jsx)("strong",{children:f}):f})]})})}function h(e){var t=e.character,a=e.equippedBuild,c=e.newBuild,l=e.statKey,h=Object(r.a)(Array.isArray(l)?s.a.get(l):void 0,[l]),x=Object(n.useMemo)((function(){var e,n,s,r,b="";if("string"===typeof l){if(c&&a){var x,v;e=null!==(x=null===c||void 0===c?void 0:c[l])&&void 0!==x?x:0,n=null!==(v=null===a||void 0===a?void 0:a[l])&&void 0!==v?v:0}else{var O,m=c||a;e=null!==(O=null===m||void 0===m?void 0:m[l])&&void 0!==O?O:0,n=Object(d.a)(t)[l],m&&("finalHP"===l?n=m.characterHP:"finalDEF"===l?n=m.characterDEF:"finalATK"===l&&(n=m.characterATK+m.weaponATK))}r=o.b.getStatUnit(l),s=o.b.fixedUnit(l),b=Object(j.jsxs)("span",{children:[u.a[l]," ",o.b.getStatName(l)]})}else if(h){var f,p,y,g,N=c||a,S=h.field,k=i.a.getTalentFieldValue(S,"variant",N);if(b=Object(j.jsx)("span",{className:"text-".concat(k),children:i.a.getTalentFieldValue(S,"text",N)}),s=i.a.getTalentFieldValue(S,"fixed",N,0),r=i.a.getTalentFieldValue(S,"unit",N,""),e=null===(f=i.a.getTalentFieldValue(S,"formula",N))||void 0===f||null===(p=f[0])||void 0===p?void 0:p.call(f,N),c&&a)n=null===(y=i.a.getTalentFieldValue(S,"formula",a))||void 0===y||null===(g=y[0])||void 0===g?void 0:g.call(y,a)}return{val:e,oldVal:n,fixed:s,unit:r,label:b,hasBonus:i.a.hasBonusStats(t,l)}}),[t,a,c,l,h]),v=x.val,O=x.oldVal,m=x.fixed,f=x.unit,p=x.label,y=x.hasBonus;return Object(j.jsx)(b,{val:v,oldVal:O,fixed:m,unit:f,label:p,hasBonus:y})}}}]);
//# sourceMappingURL=3.e793cdae.chunk.js.map