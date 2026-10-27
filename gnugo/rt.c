typedef unsigned long long u64; typedef __int128 ti;
static u64 mulhi(u64 a,u64 b){u64 al=a&0xffffffffu,ah=a>>32,bl=b&0xffffffffu,bh=b>>32;u64 t=al*bl,w1,w2,k;k=t>>32;t=ah*bl+k;w1=t&0xffffffffu;w2=t>>32;t=al*bh+w1;k=t>>32;return ah*bh+w2+k;}
ti __multi3(ti a,ti b){u64 al=(u64)a,bl=(u64)b,ah=(u64)((unsigned __int128)a>>64),bh=(u64)((unsigned __int128)b>>64);
 u64 lo=al*bl,hi=mulhi(al,bl)+al*bh+ah*bl;return (ti)(((unsigned __int128)hi<<64)|lo);}
