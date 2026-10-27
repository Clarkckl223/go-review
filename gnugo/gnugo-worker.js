/* GNU Go 3.9（GPL v3）编译成 WebAssembly，在背景执行。
   源码：https://github.com/runningskull/gnugo（GNU Go 官方 git 的镜像），编译方法见 README。
   每次收到 {id, args, input}：开一个新的 GNU Go，把 GTP 指令当作标准输入，回传标准输出。 */
let modP=null;
function getMod(){return modP||(modP=WebAssembly.compileStreaming?WebAssembly.compileStreaming(fetch('gnugo.wasm')).catch(()=>fetch('gnugo.wasm').then(r=>r.arrayBuffer()).then(b=>WebAssembly.compile(b))):fetch('gnugo.wasm').then(r=>r.arrayBuffer()).then(b=>WebAssembly.compile(b)))}
class Exit{constructor(c){this.code=c}}
async function run(args,input){
  const mod=await getMod();let mem;const enc=new TextEncoder(),dec=new TextDecoder();
  const inp=enc.encode(input);let ip=0;const out=[];
  const dv=()=>new DataView(mem.buffer),u8=()=>new Uint8Array(mem.buffer);
  const argv=args.map(a=>enc.encode(a+'\0'));
  const W={
    args_sizes_get(c,s){dv().setUint32(c,argv.length,true);dv().setUint32(s,argv.reduce((a,b)=>a+b.length,0),true);return 0},
    args_get(pp,buf){let o=buf;argv.forEach((a,i)=>{dv().setUint32(pp+i*4,o,true);u8().set(a,o);o+=a.length});return 0},
    environ_sizes_get(c,s){dv().setUint32(c,0,true);dv().setUint32(s,0,true);return 0},
    environ_get(){return 0},
    clock_time_get(id,prec,p){dv().setBigUint64(p,BigInt(Math.round(performance.now()*1e6)),true);return 0},
    fd_close(){return 0},fd_fdstat_set_flags(){return 0},fd_seek(){return 70},
    fd_fdstat_get(fd,p){if(fd>2)return 8;const d=dv();d.setUint8(p,2);d.setUint16(p+2,0,true);d.setBigUint64(p+8,0n,true);d.setBigUint64(p+16,0n,true);return 0},
    fd_prestat_get(){return 8},fd_prestat_dir_name(){return 8},path_open(){return 44},poll_oneoff(){return 52},
    fd_read(fd,iovs,n,nread){if(fd!==0)return 8;let t=0;const d=dv();for(let i=0;i<n;i++){const b=d.getUint32(iovs+i*8,true),l=d.getUint32(iovs+i*8+4,true);const k=Math.min(l,inp.length-ip);u8().set(inp.subarray(ip,ip+k),b);ip+=k;t+=k;if(k<l)break}d.setUint32(nread,t,true);return 0},
    fd_write(fd,iovs,n,nw){let t=0;const d=dv();for(let i=0;i<n;i++){const b=d.getUint32(iovs+i*8,true),l=d.getUint32(iovs+i*8+4,true);if(fd===1)out.push(u8().slice(b,b+l));t+=l}d.setUint32(nw,t,true);return 0},
    proc_exit(c){throw new Exit(c)}
  };
  const inst=await WebAssembly.instantiate(mod,{wasi_snapshot_preview1:W});mem=inst.exports.memory;
  try{inst.exports._start()}catch(e){if(!(e instanceof Exit))throw e}
  let len=0;out.forEach(a=>len+=a.length);const all=new Uint8Array(len);let o=0;out.forEach(a=>{all.set(a,o);o+=a.length});
  return dec.decode(all);
}
onmessage=async e=>{const{id,args,input}=e.data;try{postMessage({id,out:await run(['gnugo',...args],input)})}catch(err){postMessage({id,error:String(err&&err.message||err)})}};
