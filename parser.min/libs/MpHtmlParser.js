// 小程序富文本插件 https://github.com/jin-yufeng/Parser
"use strict";function _classCallCheck(t,i){if(!(t instanceof i))throw new TypeError("Cannot call a class as a function")}var _createClass=function(){function t(t,i){for(var s=0;s<i.length;s++){var e=i[s];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}return function(i,s,e){return s&&t(i.prototype,s),e&&t(i,e),i}}(),cfg=require("./config.js"),blankChar=cfg.blankChar,CssHandler=require("./CssHandler.js"),_wx$getSystemInfoSync=wx.getSystemInfoSync(),screenWidth=_wx$getSystemInfoSync.screenWidth,system=_wx$getSystemInfoSync.system;try{var emoji=require("./emoji.js")}catch(t){}var MpHtmlParser=function(){function t(i){var s=this,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};_classCallCheck(this,t),this.isClose=function(){return">"==s.data[s.i]||"/"==s.data[s.i]&&">"==s.data[s.i+1]},this.section=function(){return s.data.substring(s.start,s.i)},this.siblings=function(){return s.STACK.length?s.STACK[s.STACK.length-1].children:s.DOM},this.attrs={},this.compress=e.compress,this.CssHandler=new CssHandler(e.tagStyle,screenWidth),this.data=i,this.domain=e.domain,this.DOM=[],this.i=0,this.protocol=this.domain&&this.domain.includes("://")?this.domain.split("://")[0]:"",this.start=0,this.state=this.Text,this.STACK=[],this.audioNum=0,this.imgNum=0,this.videoNum=0,this.useAnchor=e.useAnchor}return _createClass(t,[{key:"parse",value:function(){emoji&&(this.data=emoji.parseEmoji(this.data));for(var t;t=this.data[this.i];this.i++)this.state(t);for(this.state==this.Text&&this.setText();this.STACK.length;)this.popNode(this.STACK.pop());return this.DOM.length&&(this.DOM[0].PoweredBy="Parser",this.title&&(this.DOM[0].title=this.title)),this.DOM}},{key:"setAttr",value:function(){var t=this.attrName.toLowerCase();for(cfg.trustAttrs[t]&&(this.attrVal?this.attrs[t]="src"==t?this.getUrl(this.attrVal):this.attrVal:cfg.boolAttrs[t]&&(this.attrs[t]="T")),this.attrVal="";blankChar[this.data[this.i]];)this.i++;this.isClose()?this.setNode():(this.start=this.i,this.state=this.AttrName)}},{key:"setText",value:function(){var t=this.section();if(t){if(!this.pre){for(var i,s=[],e=t.length;i=t[--e];)(!blankChar[i]||!blankChar[s[0]]&&(i=" "))&&s.unshift(i);if(" "==(t=s.join("")))return}for(var a,r,h,e=t.indexOf("&");-1!=e&&-1!=(a=t.indexOf(";",e+2));)"#"==t[e+1]?(r=parseInt(("x"==t[e+2]?"0":"")+t.substring(e+2,a)),isNaN(r)||(t=t.substring(0,e)+String.fromCharCode(r)+t.substring(a+1))):(r=t.substring(e+1,a),"nbsp"==r?t=t.substring(0,e)+" "+t.substring(a+1):"lt"!=r&&"gt"!=r&&"amp"!=r&&"ensp"!=r&&"emsp"!=r&&(h=!0)),e=t.indexOf("&",e+1);var n,l={type:"text",text:cfg.onText&&cfg.onText(t,function(){return n=!0})||t};if(h&&(l.decode=!0),n){this.data=this.data.substr(0,this.start)+l.text+this.data.substr(this.i);var a=this.start+l.text.length;for(this.i=this.start;this.i<a;this.i++)this.state(this.data[this.i])}else this.siblings().push(l)}}},{key:"setNode",value:function(){var t={name:this.tagName.toLowerCase(),attrs:this.attrs};if(this.attrs={},cfg.ignoreTags[t.name])if(cfg.selfClosingTags[t.name])if("source"==t.name){var i=this.STACK[this.STACK.length-1],s=t.attrs;if(i&&s.src)if("video"==i.name||"audio"==i.name)i.attrs.source.push(s.src);else{var e,a=s.media;"picture"!=i.name||i.attrs.src||s.src.indexOf(".webp")&&system.includes("iOS")||!(!a||a.includes("px")&&(-1!=(e=a.indexOf("min-width"))&&-1!=(e=a.indexOf(":",e+8))&&screenWidth>parseInt(a.substring(e+1))||-1!=(e=a.indexOf("max-width"))&&-1!=(e=a.indexOf(":",e+8))&&screenWidth<parseInt(a.substring(e+1))))||(i.attrs.src=s.src)}}else"base"!=t.name||this.domain||(this.domain=t.attrs.href);else this.remove(t);else this.matchAttr(t),cfg.selfClosingTags[t.name]?cfg.filter&&0==cfg.filter(t,this)||this.siblings().push(t):(t.children=[],"pre"==t.name&&cfg.highlight&&(this.remove(t),this.pre=t.pre=!0),this.siblings().push(t),this.STACK.push(t));"/"==this.data[this.i]&&this.i++,this.start=this.i+1,this.state=this.Text}},{key:"remove",value:function(t){for(var i=this.i;this.i<this.data.length;){for(-1==(this.i=this.data.indexOf("</",this.i+1))&&(this.i=this.data.length),this.start=this.i+=2;!blankChar[this.data[this.i]]&&!this.isClose();)this.i++;if(this.section().toLowerCase()==t.name){if("pre"==t.name)return this.data=this.data.substring(0,i+1)+cfg.highlight(this.data.substring(i+1,this.i-5),t.attrs)+this.data.substring(this.i-5),this.i=i;if("style"==t.name?this.CssHandler.getStyle(this.data.substring(i+1,this.i-7)):"title"==t.name&&(this.title=this.data.substring(i+1,this.i-7)),-1==(this.i=this.data.indexOf(">",this.i))&&(this.i=this.data.length),"svg"==t.name){var s=this.data.substring(i,this.i+1);t.attrs.xmlns||(s=' xmlns="http://www.w3.org/2000/svg"'+s);for(var e=i;"<"!=this.data[i];)i--;s=this.data.substring(i,e)+s,this.siblings().push({name:"img",attrs:{src:"data:image/svg+xml;utf8,"+s.replace(/#/g,"%23"),ignore:"T"}})}return}}}},{key:"matchAttr",value:function(t){var i=t.attrs,s=this.CssHandler.match(t.name,i,t)+(i.style||"");switch(t.name){case"div":case"p":i.align&&(s="text-align:"+i.align+";"+s,i.align=void 0);break;case"img":i["data-src"]&&(i.src=i.src||i["data-src"],i["data-src"]=void 0),i.width&&parseInt(i.width)>screenWidth&&(s+=";height:auto !important"),i.src&&!i.ignore&&(this.bubble()?i.i=(this.imgNum++).toString():i.ignore="T");break;case"a":case"ad":this.bubble();break;case"font":if(i.color&&(s="color:"+i.color+";"+s,i.color=void 0),i.face&&(s="font-family:"+i.face+";"+s,i.face=void 0),i.size){var e=parseInt(i.size);e<1?e=1:e>7&&(e=7);s="font-size:"+["xx-small","x-small","small","medium","large","x-large","xx-large"][e-1]+";"+s,i.size=void 0}break;case"video":case"audio":i.id?this[t.name+"Num"]++:i.id=t.name+ ++this[t.name+"Num"],"video"==t.name&&(i.width&&(s="width:"+(parseFloat(i.width)+i.width.includes("%")?"%":"px")+";"+s,i.width=void 0),i.height&&(s="height:"+(parseFloat(i.height)+i.height.includes("%")?"%":"px")+";"+s,i.height=void 0),this.videoNum>3&&(t.lazyLoad=!0)),i.source=[],i.src&&i.source.push(i.src),i.controls||i.autoplay||console.warn("存在没有 controls 属性的 "+t.name+" 标签，可能导致无法播放",t),this.bubble()}for(var a=s.split(";"),r={},h=0,n=a.length,s="";h<n;h++){var l=a[h].split(":");if(!(l.length<2)){var o=l[0].trim().toLowerCase(),d=l.slice(1).join(":").trim();d.includes("-webkit")||d.includes("-moz")||d.includes("-ms")||d.includes("-o")||d.includes("safe")?s+=";"+o+":"+d:r[o]&&!d.includes("import")&&r[o].includes("import")||(r[o]=d)}}"img"==t.name&&r.width&&parseInt(r.width)>screenWidth&&(r.height="auto !important");for(var o in r){var d=r[o];if(d.includes("url")){var c=d.indexOf("(");if(-1!=c++){for(;'"'==d[c]||"'"==d[c]||blankChar[d[c]];)c++;d=d.substr(0,c)+this.getUrl(d.substr(c,2))+d.substr(c+2)}}else d.includes("rpx")?d=d.replace(/[0-9.\s]*rpx/g,function(t){return parseFloat(t)*screenWidth/750+"px"}):"white-space"==o&&d.includes("pre")&&(this.pre=t.pre=!0);s+=";"+o+":"+d}s=s.substr(1),s&&(i.style=s),i.id&&(1&this.compress?i.id=void 0:this.useAnchor&&this.bubble()),2&this.compress&&i.class&&(i.class=void 0)}},{key:"popNode",value:function(t){if(t.pre){t.pre=this.pre=void 0;for(var i=this.STACK.length;i--;)this.STACK[i].pre&&(this.pre=!0)}if("head"==t.name||cfg.filter&&0==cfg.filter(t,this))return this.siblings().pop();if("picture"==t.name)return t.name="img",!t.attrs.src&&t.children.length&&"img"==t.children[0].name&&(t.attrs.src=t.children[0].attrs.src),t.attrs.src&&!t.attrs.ignore&&(t.attrs.i=(this.imgNum++).toString()),t.children=void 0;if(cfg.blockTags[t.name]?t.name="div":cfg.trustTags[t.name]||(t.name="span"),t.c)if("ul"==t.name){for(var s=1,i=this.STACK.length;i--;)"ul"==this.STACK[i].name&&s++;if(1!=s)for(i=t.children.length;i--;)t.children[i].floor=s}else if("ol"==t.name)for(var e,i=0,a=1;e=t.children[i++];)"li"==e.name&&(e.type="ol",e.num=function(t,i){if("a"==i)return String.fromCharCode(97+(t-1)%26);if("A"==i)return String.fromCharCode(65+(t-1)%26);if("i"==i||"I"==i){t=(t-1)%99+1;var s=["I","II","III","IV","V","VI","VII","VIII","IX"],e=["X","XX","XXX","XL","L","LX","LXX","LXXX","XC"],a=(e[Math.floor(t/10)-1]||"")+(s[t%10-1]||"");return"i"==i?a.toLowerCase():a}return t}(a++,t.attrs.type)+".");if("table"==t.name&&(t.attrs.border&&(t.attrs.style="border:"+t.attrs.border+"px solid gray;"+(t.attrs.style||"")),t.attrs.cellspacing&&(t.attrs.style="border-spacing:"+t.attrs.cellspacing+"px;"+(t.attrs.style||"")),(t.attrs.border||t.attrs.cellpadding)&&function i(s){for(var e,a=0;e=s[a];a++)"th"==e.name||"td"==e.name?(t.attrs.border&&(e.attrs.style="border:"+t.attrs.border+"px solid gray;"+(e.attrs.style||"")),t.attrs.cellpadding&&(e.attrs.style="padding:"+t.attrs.cellpadding+"px;"+(e.attrs.style||""))):i(e.children||[])}(t.children)),this.CssHandler.pop&&this.CssHandler.pop(t),"div"==t.name&&!Object.keys(t.attrs).length){var r=this.siblings();(t.children||[]).length?1==t.children.length&&"div"==t.children[0].name&&(r[r.length-1]=t.children[0]):r.pop()}}},{key:"bubble",value:function(){for(var t=this.STACK.length;t--&&!cfg.richOnlyTags[this.STACK[t].name];)this.STACK[t].c=1;return-1==t}},{key:"getUrl",value:function(t){return this.domain&&("/"==t[0]?t="/"==t[1]?this.protocol+":"+t:this.domain+t:t.includes("://")||(t=this.domain+"/"+t)),t}},{key:"Text",value:function(t){if("<"==t){var i=this.data[this.i+1],s=function(t){return t>="a"&&t<="z"||t>="A"&&t<="Z"};s(i)?(this.setText(),this.start=this.i+1,this.state=this.TagName):"/"==i?(this.setText(),s(this.data[++this.i+1])?(this.start=this.i+1,this.state=this.EndTag):this.Comment()):"!"==i&&(this.setText(),this.Comment())}}},{key:"Comment",value:function(){var t;t="--"==this.data.substring(this.i+2,this.i+4)?"--\x3e":"[CDATA["==this.data.substring(this.i+2,this.i+9)?"]]>":">",-1==(this.i=this.data.indexOf(t,this.i+2))?this.i=this.data.length:this.i+=t.length-1,this.start=this.i+1,this.state=this.Text}},{key:"TagName",value:function(t){if(blankChar[t]){for(this.tagName=this.section();blankChar[this.data[this.i]];)this.i++;this.isClose()?this.setNode():(this.start=this.i,this.state=this.AttrName)}else this.isClose()&&(this.tagName=this.section(),this.setNode())}},{key:"AttrName",value:function(t){var i=blankChar[t];if(i&&(this.attrName=this.section(),t=this.data[this.i]),"="==t){for(i||(this.attrName=this.section());blankChar[this.data[++this.i]];);this.start=this.i--,this.state=this.AttrValue}else i?this.setAttr():this.isClose()&&(this.attrName=this.section(),this.setAttr())}},{key:"AttrValue",value:function(t){if('"'==t||"'"==t){if(this.start++,-1==(this.i=this.data.indexOf(t,this.i+1)))return this.i=this.data.length;this.attrVal=this.section(),this.i++}else{for(;!blankChar[this.data[this.i]]&&!this.isClose();this.i++);this.attrVal=this.section()}for(;this.attrVal.includes("&quot;");)this.attrVal=this.attrVal.replace("&quot;",'"');this.setAttr()}},{key:"EndTag",value:function(t){if(blankChar[t]||">"==t||"/"==t){for(var i=this.section().toLowerCase(),s=this.STACK.length;s--&&this.STACK[s].name!=i;);if(-1!=s){for(var e;(e=this.STACK.pop()).name!=i;);this.popNode(e)}else"p"!=i&&"br"!=i||this.siblings().push({name:i,attrs:{}});this.i=this.data.indexOf(">",this.i),this.start=this.i+1,-1==this.i?this.i=this.data.length:this.state=this.Text}}}]),t}();module.exports=MpHtmlParser;