import{c as m,s as d,k,r as o}from"./index-CAsyng-G.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=m("Bookmark",[["path",{d:"m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z",key:"1fy3hk"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=m("ExternalLink",[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"M10 14 21 3",key:"gplh6r"}],["path",{d:"M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",key:"a6xqqp"}]]);/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const S=m("Star",[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]]),h=(t,a)=>{var e;return{user_id:a,rec_id:t.id,rec_type:t.type,title:t.title,location:t.location,city:t.city,external_link:t.externalLink,image_url:((e=t.images)==null?void 0:e[0])||null,data:t}},u={async list(t){const{data:a,error:e}=await d.from("saved_recommendations").select("*").eq("user_id",t).order("created_at",{ascending:!1});if(e)throw e;return a||[]},async isSaved(t,a){const{data:e,error:s}=await d.from("saved_recommendations").select("id").eq("user_id",t).eq("rec_id",a).maybeSingle();if(s&&s.code!=="PGRST116")throw s;return!!e},async save(t,a){const e=h(a,t),{data:s,error:i}=await d.from("saved_recommendations").insert(e).select("*").maybeSingle();if(i&&i.code!=="23505")throw i;return s||null},async remove(t,a){const{error:e}=await d.from("saved_recommendations").delete().eq("user_id",t).eq("rec_id",a);if(e)throw e},async toggle(t,a){return await this.isSaved(t,a.id)?(await this.remove(t,a.id),"removed"):(await this.save(t,a),"saved")},async addToTrip(t,a,e){var i;const{error:s}=await d.from("trip_links").insert({added_by:t,trip_id:String(e),title:a.title,url:a.external_link||(((i=a.data)==null?void 0:i.externalLink)??""),description:a.location||a.city||null,category:typeof a.rec_type=="string"?a.rec_type:"recommendation"});if(s)throw s}},v=()=>{const{user:t}=k(),[a,e]=o.useState([]),[s,i]=o.useState(!1),r=t==null?void 0:t.id,c=o.useCallback(async()=>{if(r){i(!0);try{const n=await u.list(r);e(n)}finally{i(!1)}}},[r]);o.useEffect(()=>{c()},[c]);const y=o.useCallback(async n=>{if(!r)return{status:"unauthenticated"};const l=await u.toggle(r,n);return await c(),{status:l}},[r,c]),f=o.useCallback(async(n,l)=>r?(await u.addToTrip(r,n,l),{status:"ok"}):{status:"unauthenticated"},[r]),p=o.useCallback(n=>a.some(l=>l.rec_id===n),[a]);return{items:a,loading:s,toggleSave:y,isSaved:p,addToTrip:f,refresh:c}};export{w as B,g as E,S,v as u};
