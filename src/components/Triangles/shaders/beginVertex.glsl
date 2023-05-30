float scale = 0.6 + sin(uTime * aRandom) * 0.3;

transformed = mix(aCentroid, transformed, scale);

transformed.xz = rotate2d(uTime * 0.5) * transformed.xz;