#version 300 es

#define PI 3.1415926535897932384626433832795
#define TAU 6.28318530718
precision highp float;

in vec2 vTextureCoord;

uniform float time;
uniform vec4 glitchLevels;
uniform vec4 backgroundColor;
uniform vec4 screenResolution;
uniform vec2 aspectRate;
uniform vec2 curvature;
uniform vec2 scanLineOpacity;
uniform vec3 vignetteOpt;
uniform vec3 hBending;

uniform sampler2D uTextureSampler;


out vec4 fragColor;

// =========================================================================
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
    // First corner
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);

    // Other corners
    vec2 i1;
    //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
    //i1.y = 1.0 - i1.x;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    // x0 = x0 - 0.0 + 0.0 * C.xx ;
    // x1 = x0 - i1 + 1.0 * C.xx ;
    // x2 = x0 - 1.0 + 2.0 * C.xx ;
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    // Permutations
    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;

    // Gradients: 41 points uniformly over a line, mapped onto a diamond.
    // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt( a0*a0 + h*h );
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    // Compute final noise value at P
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;

    return 130.0 * dot(m, g);
}

/*
float rand(vec2 co)
{
   return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
}
*/
// =======================================================================================



vec2 curveUV(vec2 uv) {
    uv = uv * 2.0 - 1.0;
    vec2 offset = abs(uv.yx) / vec2(curvature.x, curvature.y);
    uv = uv + uv * offset * offset;
    uv = uv * 0.5 + 0.5;
    return uv;
}

vec4 scanLineIntensity(float u, float resolution, float opacity) {
     float intensity = sin(u * resolution * TAU);
     intensity = ((0.5 * intensity) + 0.5) * 0.9 + 0.1;
     return vec4(vec3(pow(intensity, opacity)), 1.0);
}

float calcVignetteOpacity(vec2 uv) {
    //float ix = clamp( pow(((uv.x * 1.0-uv.x)), vignetteOpacity.x), 0.0, 1.0);
    //float iy = clamp( pow(((uv.y * 1.0-uv.y)), vignetteOpacity.y), 0.0, 1.0);
    float ix = clamp( pow((uv.x * (1.0 - uv.x)) * vignetteOpt.z * aspectRate.x, vignetteOpt.x), 0.0, 1.0);
    float iy = clamp( pow((uv.y * (1.0 - uv.y)) * vignetteOpt.z * aspectRate.y, vignetteOpt.y), 0.0, 1.0);
    return ix * iy;
}

void main(void) {
    //gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    //fragColor = texture(uTextureSampler, vTextureCoord);

    vec2 uv = curveUV(vTextureCoord);

    vec4 fc;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        //fc = vec4(0.0, 0.0, 0.0, 1.0);
        fc = backgroundColor;
    } else {
        // offset by large incidental noise waves
        float noise = glitchLevels.y * max(0.0, snoise(vec2(time, uv.y * 0.3)) - 0.3) * (1.0 / 0.7);
        // offset by small constant noise waves
        noise = noise + glitchLevels.x * (snoise(vec2(time*20.0, uv.y * 2.4)) - 0.5) * 0.15;

        fc = vec4(
                texture(uTextureSampler, vec2(uv.x + hBending.r + noise, uv.y)).r, 
                texture(uTextureSampler, vec2(uv.x + hBending.g + noise, uv.y)).g, 
                texture(uTextureSampler, vec2(uv.x + hBending.b + noise, uv.y)).b, 
                texture(uTextureSampler, uv).a
                );
        fc *= scanLineIntensity(uv.x, screenResolution.x, scanLineOpacity.x);
        fc *= scanLineIntensity(uv.y, screenResolution.y, scanLineOpacity.y);
    }
    float vignetteFactor = calcVignetteOpacity(uv);
    fc = mix(backgroundColor, fc, vignetteFactor);

    fragColor = fc;
}
