# -*- coding: utf-8 -*-
"""Saf Python QR kod üreteci (byte mode, sürüm 1-6)."""

EXP=[0]*512; LOG=[0]*256
x=1
for i in range(255):
    EXP[i]=x; LOG[x]=i
    x<<=1
    if x&0x100: x^=0x11D
for i in range(255,512): EXP[i]=EXP[i-255]

def gmul(a,b):
    if a==0 or b==0: return 0
    return EXP[LOG[a]+LOG[b]]

def rs_gen(n):
    g=[1]
    for i in range(n):
        ng=[0]*(len(g)+1)
        for j,c in enumerate(g):
            ng[j]^=gmul(c,EXP[i])
            ng[j+1]^=c
        g=ng
    return g

def rs_ec(data,n):
    g=rs_gen(n)
    res=list(data)+[0]*n
    for i in range(len(data)):
        f=res[i]
        if f:
            for j,c in enumerate(g):
                res[i+j]^=gmul(c,f)
    return res[len(data):]

# sürüm: {seviye: (ec_per_block, [(blok_sayisi, veri_cw), ...])}
BLOCKS={
 1:{'L':(7,[(1,19)]),'M':(10,[(1,16)]),'Q':(13,[(1,13)]),'H':(17,[(1,9)])},
 2:{'L':(10,[(1,34)]),'M':(16,[(1,28)]),'Q':(22,[(1,22)]),'H':(28,[(1,16)])},
 3:{'L':(15,[(1,55)]),'M':(26,[(1,44)]),'Q':(18,[(2,17)]),'H':(22,[(2,13)])},
 4:{'L':(20,[(1,80)]),'M':(18,[(2,32)]),'Q':(26,[(2,24)]),'H':(16,[(4,9)])},
 5:{'L':(26,[(1,108)]),'M':(24,[(2,43)]),'Q':(18,[(2,15),(2,16)]),'H':(22,[(2,11),(2,12)])},
 6:{'L':(18,[(2,68)]),'M':(16,[(4,27)]),'Q':(24,[(4,19)]),'H':(28,[(4,15)])},
}
ALIGN={1:[],2:[6,18],3:[6,22],4:[6,26],5:[6,30],6:[6,34]}
REMAIN={1:0,2:7,3:7,4:7,5:7,6:7}
ECBITS={'L':0b01,'M':0b00,'Q':0b11,'H':0b10}

def make(data, ver, lvl):
    ecn, groups = BLOCKS[ver][lvl]
    total_data = sum(nb*dc for nb,dc in groups)
    bits=[]
    def put(v,n):
        for i in range(n-1,-1,-1): bits.append((v>>i)&1)
    put(0b0100,4); put(len(data),8)
    for b in data: put(b,8)
    cap=total_data*8
    for _ in range(min(4,cap-len(bits))): bits.append(0)
    while len(bits)%8: bits.append(0)
    pads=[0xEC,0x11]; k=0
    while len(bits)<cap:
        put(pads[k%2],8); k+=1
    cw=[int(''.join(map(str,bits[i:i+8])),2) for i in range(0,len(bits),8)]

    blocks=[]; pos=0
    for nb,dc in groups:
        for _ in range(nb):
            blocks.append(cw[pos:pos+dc]); pos+=dc
    ecs=[rs_ec(b,ecn) for b in blocks]
    out=[]
    for i in range(max(len(b) for b in blocks)):
        for b in blocks:
            if i<len(b): out.append(b[i])
    for i in range(ecn):
        for e in ecs: out.append(e[i])

    size=17+4*ver
    m=[[None]*size for _ in range(size)]
    def finder(r,c):
        for dr in range(-1,8):
            for dc in range(-1,8):
                rr,cc=r+dr,c+dc
                if 0<=rr<size and 0<=cc<size:
                    v=0
                    if 0<=dr<=6 and 0<=dc<=6:
                        v=1 if (dr in(0,6) or dc in(0,6) or (2<=dr<=4 and 2<=dc<=4)) else 0
                    m[rr][cc]=v
    finder(0,0); finder(0,size-7); finder(size-7,0)
    for i in range(8,size-8):
        b=1 if i%2==0 else 0
        if m[6][i] is None: m[6][i]=b
        if m[i][6] is None: m[i][6]=b
    for r in ALIGN[ver]:
        for c in ALIGN[ver]:
            if (r<9 and c<9) or (r<9 and c>size-10) or (r>size-10 and c<9): continue
            for dr in range(-2,3):
                for dc in range(-2,3):
                    m[r+dr][c+dc]=1 if (abs(dr)==2 or abs(dc)==2 or (dr==0 and dc==0)) else 0
    m[size-8][8]=1
    func=[[m[r][c] is not None for c in range(size)] for r in range(size)]
    fmt=[]
    for i in range(6): fmt.append((8,i))
    fmt+=[(8,7),(8,8),(7,8)]
    for i in range(5,-1,-1): fmt.append((i,8))
    fmt2=[]
    for i in range(7): fmt2.append((size-1-i,8))
    for i in range(8): fmt2.append((8,size-8+i))
    for (r,c) in fmt+fmt2:
        if m[r][c] is None: m[r][c]='F'
        func[r][c]=True

    stream=[]
    for b in out:
        for i in range(7,-1,-1): stream.append((b>>i)&1)
    stream+=[0]*REMAIN[ver]

    idx=0; col=size-1; up=True
    while col>0:
        if col==6: col-=1
        rng=range(size-1,-1,-1) if up else range(size)
        for r in rng:
            for c in (col,col-1):
                if m[r][c] is None:
                    m[r][c]=stream[idx] if idx<len(stream) else 0; idx+=1
        up=not up; col-=2

    def maskfn(k,r,c):
        return [ (r+c)%2==0, r%2==0, c%3==0, (r+c)%3==0,
                 (r//2+c//3)%2==0, (r*c)%2+(r*c)%3==0,
                 ((r*c)%2+(r*c)%3)%2==0, ((r+c)%2+(r*c)%3)%2==0 ][k]

    def penalty(g):
        p=0; n=len(g)
        for line in list(g)+[list(col) for col in zip(*g)]:
            run=1
            for i in range(1,n):
                if line[i]==line[i-1]: run+=1
                else:
                    if run>=5: p+=3+run-5
                    run=1
            if run>=5: p+=3+run-5
            s=''.join(map(str,line))
            p+=40*(s.count('1011101' + '0000')+s.count('0000'+'1011101'))
        for r in range(n-1):
            for c in range(n-1):
                if g[r][c]==g[r][c+1]==g[r+1][c]==g[r+1][c+1]: p+=3
        dark=sum(sum(r) for r in g); pct=dark*100.0/(n*n)
        p+=10*int(abs(pct-50)//5)
        return p

    best=None
    for k in range(8):
        g=[[0]*size for _ in range(size)]
        for r in range(size):
            for c in range(size):
                v=m[r][c]
                if func[r][c]:
                    g[r][c]=0 if v=='F' else v
                else:
                    g[r][c]=v^(1 if maskfn(k,r,c) else 0)
        f=(ECBITS[lvl]<<3)|k
        rem=f<<10
        for _ in range(4,-1,-1):
            while rem.bit_length()>10: rem^=0b10100110111<<(rem.bit_length()-11)
        bitsf=((f<<10)|rem)^0b101010000010010
        for i,(r,c) in enumerate(fmt):
            g[r][c]=(bitsf>>(14-i))&1
        for i,(r,c) in enumerate(fmt2):
            g[r][c]=(bitsf>>(14-i))&1
        g[size-8][8]=1
        s=penalty(g)
        if best is None or s<best[0]: best=(s,g)
    return best[1]

def qr(text, ver=5, lvl='Q'):
    return make(text.encode('utf-8'), ver, lvl)
