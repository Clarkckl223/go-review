# GNU Go → WebAssembly

`gnugo.wasm` is GNU Go (GPL v3, see `COPYING.txt`) built from the official source,
commit `84a32e9cee2a70c0ec6ef58c1be279fed84a9a53` of https://github.com/runningskull/gnugo
(mirror of the official GNU Go git repository). The engine itself is not modified.

Build steps:

1. Native build first (it generates the pattern tables):
   `./configure --without-readline --without-curses CFLAGS="-O2 -fcommon" && make`
2. Apply `wasm.patch` (makes two arrays `extern` so they link without `-fcommon`).
3. Copy `config.h`, remove `#define ENABLE_SOCKET_SUPPORT 1`.
4. Build wasi-libc (https://github.com/WebAssembly/wasi-libc) as a sysroot.
5. Compile every `.c` file of `engine/`, `patterns/`, `sgf/`, `utils/` (the members of the
   native `lib*.a` archives) and `interface/{main,play_ascii,play_gmp,play_gtp,play_solo,play_test,gmp,gtp}.c` with
   `clang --target=wasm32-wasip1 --sysroot=<sysroot> -O2 -D_WASI_EMULATED_SIGNAL -D_WASI_EMULATED_PROCESS_CLOCKS -DHAVE_CONFIG_H`,
   plus `rt.c` (128-bit multiply helper).
6. Link: `-nodefaultlibs -lc -lwasi-emulated-signal -lwasi-emulated-process-clocks -Wl,-z,stack-size=8388608 -Wl,--initial-memory=33554432 -Wl,--max-memory=268435456`.

`gnugo-worker.js` runs it in a Web Worker with a tiny WASI shim; GTP commands go in on standard input.
