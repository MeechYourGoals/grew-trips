import{c as o,r as n,s as c}from"./index-CAsyng-G.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=o("ChartColumn",[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=o("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=o("Lock",[["rect",{width:"18",height:"11",x:"3",y:"11",rx:"2",ry:"2",key:"1w4ew1"}],["path",{d:"M7 11V7a5 5 0 0 1 10 0v4",key:"fwvmzm"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=o("Play",[["polygon",{points:"6 3 20 12 6 21 6 3",key:"1oa8hb"}]]),l=["chat","broadcasts","polls","tasks","calendar","media","concierge","search"],m=a=>n.useMemo(()=>{if(a.trip_type==="consumer")return{showChat:!0,showBroadcasts:!0,showPolls:!0,showTasks:!0,showCalendar:!0,showMedia:!0,showConcierge:!0,showSearch:!0,isFeatureEnabled:()=>!0};const e=a.enabled_features||l;return{showChat:e.includes("chat"),showBroadcasts:e.includes("broadcasts"),showPolls:e.includes("polls"),showTasks:e.includes("tasks"),showCalendar:e.includes("calendar"),showMedia:e.includes("media"),showConcierge:e.includes("concierge"),showSearch:e.includes("search"),isFeatureEnabled:t=>e.includes(t)}},[a.enabled_features,a.trip_type]),i=a=>["1","2","3","4","5","6","7","8","9","10","11","12"].includes(a)?"consumer":"pro",g=a=>i(a)==="consumer";class w{static async callProxy(e,t){const{data:r,error:s}=await c.functions.invoke("google-maps-proxy",{body:{endpoint:e,...t},headers:{"Content-Type":"application/json"}});if(s)throw console.error("Google Maps proxy error:",s),new Error(`Google Maps API error: ${s.message}`);if(!r)throw new Error("No response from Google Maps service");return r}static async getEmbedUrl(e){return(await this.callProxy("embed-url",{query:e})).embedUrl}static async getDistanceMatrix(e,t,r="DRIVING"){return await this.callProxy("distance-matrix",{origins:e,destinations:t,mode:r})}static async geocodeAddress(e){var t;try{const r=await this.callProxy("geocode",{address:e});if(r.results&&r.results.length>0){const s=(t=r.results[0].geometry)==null?void 0:t.location;if(s&&s.lat&&s.lng)return{lat:s.lat,lng:s.lng}}return null}catch(r){return console.error("Geocoding error:",r),null}}static async getPlaceAutocomplete(e,t=["establishment","geocode"]){try{return await this.callProxy("autocomplete",{input:e,types:t.join("|")})}catch(r){return console.error("Autocomplete error:",r),{predictions:[]}}}static async getPlaceDetailsById(e){try{return await this.callProxy("place-details",{placeId:e})}catch(t){return console.error("Place details error:",t),null}}static async searchPlacesNearBasecamp(e,t,r=5e3){return await this.callProxy("places-search",{query:e,location:`${t.lat},${t.lng}`,radius:r})}static async getPlaceDetails(e){return await this.callProxy("place-details",{placeId:e})}static generateDirectionsEmbedUrl(e,t){const r=encodeURIComponent(e),s=encodeURIComponent(t);return`https://www.google.com/maps/embed/v1/directions?origin=${r}&destination=${s}&mode=driving`}static generateDirectionsEmbedUrlWithCoords(e,t){const r=encodeURIComponent(t);return`https://www.google.com/maps/embed/v1/directions?origin=${e.lat},${e.lng}&destination=${r}&mode=driving`}}export{u as C,l as D,h as G,p as L,y as P,w as a,i as d,g as i,m as u};
