# from https://www.bilibili.com/read/cv26265179/

.text
.globl  mat4x4_inverse
#   float mat4x4_inverse(float(*src)[4], float(*dst)[4]);
.p2align    2

mat4x4_inverse:
  .cfi_startproc
  .cfi_def_cfa_offset 16
  li              a5, 4
  vsetvli         a5, a5, e32
  vid.v           v0
  vslide1down.vx  v9, v0, x0
  vslide1up.vx    v10,v0, x0
  vmerge.vvm      v11,v9, v10, v0
  vslidedown.vi   v10,v0, 2
  vslideup.vi     v10,v0, 2
  li              a5, 16
  vlse.v          v0, (a0), a5
  add             a0, a0, 4
  vlse.v          v9, (a0), a5
  vrgather.vv     v1, v9, v10
  add             a0, a0, 4
  vlse.v          v2, (a0), a5
  add             a0, a0, 4
  vlse.v          v9, (a0), a5
  vrgather.vv     v3, v9, v10
  vfmul.vv        v8, v2, v3
  vrgather.vv     v9, v8, v11
  vfmul.vv        v4, v1, v9
  vrgather.vv     v8, v9, v10
  vfmul.vv        v9, v0, v9
  vfmsac.vv       v4, v1, v8
  vfmsac.vv       v9, v0, v8
  vrgather.vv     v5, v9, v10
  vfmul.vv        v8, v1, v2
  vrgather.vv     v9, v8, v11
  vfmacc.vv       v4, v3, v9
  vrgather.vv     v8, v9, v10
  vfmul.vv        v9, v0, v9
  vfnmsac.vv      v4, v3, v8
  vfnmsac.vv      v9, v0, v8
  vrgather.vv     v7, v9, v10
  vrgather.vv     v8, v1, v10
  vfmul.vv        v8, v8, v3
  vrgather.vv     v9, v8, v11
  vmv.v.v         v8, v2
  vrgather.vv     v2, v8, v10
  vfmacc.vv       v4, v2, v9
  vrgather.vv     v8, v9, v10
  vfmul.vv        v9, v0, v9
  vfnmsac.vv      v4, v2, v8
  vfnmsac.vv      v9, v0, v8
  vrgather.vv     v6, v9, v10
  vfmul.vv        v8, v0, v1
  vrgather.vv     v9, v8, v11
  vfnmsac.vv      v6, v3, v9
  vfmacc.vv       v7, v2, v9
  vrgather.vv     v8, v9, v10
  vfmacc.vv       v6, v3, v8
  vfnmsac.vv      v7, v2, v8
  vfmul.vv        v8, v0, v3
  vrgather.vv     v9, v8, v11
  vfnmsac.vv      v5, v2, v9
  vfmacc.vv       v6, v1, v9
  vrgather.vv     v8, v9, v10
  vfmacc.vv       v5, v2, v8
  vfnmsac.vv      v6, v1, v8
  vfmul.vv        v8, v0, v2
  vrgather.vv     v9, v8, v11
  vfmacc.vv       v5, v3, v9
  vfnmsac.vv      v7, v1, v9
  vrgather.vv     v8, v9, v10
  vfnmsac.vv      v5, v3, v8
  vfmacc.vv       v7, v1, v8
  vfmul.vv        v9, v0, v4
  vslidedown.vi   v8, v9, 2
  vfadd.vv        v9, v9, v8
  vslide1down.vx  v8, v9, x0
  vfadd.vv        v8, v8, v9
  vfmv.f.s        fa0, v8
  fsub.s          fa1, fa0, fa0
  feq.s           a0,  fa0, fa1
  bne             a0, zero, .L0
  vfdiv.vf        v4, v4, fa0
  vfdiv.vf        v5, v5, fa0
  vfdiv.vf        v6, v6, fa0
  vfdiv.vf        v7, v7, fa0
  vse.v           v4, (a1)
  add             a1, a1, 16
  vse.v           v5, (a1)
  add             a1, a1, 16
  vse.v           v6, (a1)
  add             a1, a1, 16
  vse.v           v7, (a1)
.L0:
  ret
.cfi_endproc
