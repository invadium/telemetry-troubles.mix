#version 300 es
precision highp float;

in vec2 vTextureCoord;

uniform sampler2D uTextureSampler;

out vec4 fragColor;

void main(void) {
    fragColor = texture(uTextureSampler, vTextureCoord);
}
