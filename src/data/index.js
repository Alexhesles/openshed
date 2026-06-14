import { Wrench, Hammer, Leaf, Zap, Droplets, Scissors, Shield, Activity, Truck } from 'lucide-react'

export const TOOLS = [
  { id:1, name:"Orbital Sander",   brand:"Bosch",   icon:Wrench,   color:"#007AFF", health:88, price:"Free",    dist:"0.1 mi", extra:"+$8 discs",      lender:"Carlos M.", ls:82, badge:"HOA Group" },
  { id:2, name:"Pressure Washer",  brand:"Sun Joe", icon:Droplets, color:"#0099CC", health:72, price:"Free",    dist:"0.3 mi", extra:"+$8 soap",        lender:"Ana G.",    ls:91, badge:"HOA Group" },
  { id:3, name:"Paint Sprayer",    brand:"Wagner",  icon:Zap,      color:"#AF52DE", health:96, price:"Free",    dist:"0.2 mi", extra:null,              lender:"Pete V.",   ls:67, badge:"Kit", swap:true },
  { id:4, name:"Power Drill",      brand:"DeWalt",  icon:Hammer,   color:"#FF9500", health:48, price:"$15/day", dist:"0.5 mi", extra:null,              lender:"Luis R.",   ls:78 },
  { id:5, name:"Lawn Mower",       brand:"Honda",   icon:Leaf,     color:"#34C759", health:91, price:"Free",    dist:"0.6 mi", extra:null,              lender:"Maria H.",  ls:95, swap:true },
  { id:6, name:"Ace Hardware",     brand:"Hardware",icon:Hammer,   color:"#FF9500", price:"Shop now", dist:"1.2 mi", extra:"Free delivery $50+", sponsored:true },
]

export const CONSUMABLES = [
  { id:1, icon:Droplets, color:"#007AFF", name:"Concentrated Detergent", unit:"1 Qt",   price:8,  store:"Ace Hardware", popular:true },
  { id:2, icon:Scissors, color:"#FF9500", name:"Sanding Discs 80-grit",  unit:"10-pk",  price:12, store:"Home Depot" },
  { id:3, icon:Shield,   color:"#34C759", name:"Work Gloves",             unit:"pair",   price:15, store:"Ace Hardware" },
  { id:4, icon:Activity, color:"#AF52DE", name:"Dust Mask",               unit:"each",   price:6,  store:"Home Depot" },
]

export const PLANS = [
  {
    id:"starter", name:"Starter", price:"Free", period:"",
    color:"#8E8E93",
    features:["List up to 3 tools","Borrow 5×/month","0.5-mi radius","Basic search"],
  },
  {
    id:"neighbor", name:"Neighbor", price:"$4.99", period:"/mo",
    color:"#007AFF", popular:true,
    features:["List up to 15 tools","Unlimited borrows","3-mi radius","All filters & alerts","0% fee on free rentals"],
  },
  {
    id:"pro", name:"Pro", price:"$9.99", period:"/mo",
    color:"#FF9500",
    features:["Unlimited listings","5-mi radius","Analytics dashboard","Create co-ops","Rental insurance","Priority support"],
  },
]

export const MY_TOOLS = [
  { icon:Hammer,   name:"Demolition Hammer",   badge:"Public",      h:78, hrs:34, max:50,  loans:8,  color:"#FF9500", maint:false },
  { icon:Wrench,   name:"Socket Set 40-pc",    badge:"HOA Group",   h:94, hrs:12, max:30,  loans:15, color:"#007AFF", maint:false },
  { icon:Zap,      name:"Generator 3500W",     badge:"Private Link", h:88, hrs:8,  max:100, loans:3,  color:"#FFCC00", maint:false, ghost:true },
  { icon:Droplets, name:"Pressure Washer Kit", badge:"HOA Group",   h:38, hrs:46, max:50,  loans:12, color:"#0099CC", maint:true },
]

export const ACTIVITY_FEED = [
  { icon:Wrench,   color:"#007AFF", msg:"Sarah G. returned the orbital sander — Excellent condition",  t:"2 min ago" },
  { icon:Droplets, color:"#FF9500", msg:"Pressure washer flagged as needing oil by Pete V.",            t:"18 min ago" },
  { icon:Hammer,   color:"#34C759", msg:"Carlos M. completed preventive maintenance on his drill set",  t:"1 hr ago" },
  { icon:Leaf,     color:"#34C759", msg:"Maria H. added a zero-turn mower to Maple Street group",       t:"3 hrs ago" },
]
