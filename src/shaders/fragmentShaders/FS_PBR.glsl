// PBR Material properties
uniform vec3 u_albedo;
uniform float u_metallic;
uniform float u_roughness;
uniform float u_ao;
uniform vec3 u_emissive;
uniform float u_opacity;

// Specular controls
uniform vec3 u_specularColor;
uniform float u_specularIntensity;

// Specular logic
vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (vec3(1.0) - F0) * pow(1.0 - cosTheta, 5.0);
}

void main() {
    vec3 albedo = texture2D(u_albedoTexture, v_texCoord).rgb * u_albedo;
    float metallic = texture2D(u_metallicRoughnessTexture, v_texCoord).b * u_metallic;
    float roughness = texture2D(u_metallicRoughnessTexture, v_texCoord).g * u_roughness;
    float ao = texture2D(u_aoTexture, v_texCoord).r * u_ao;
    vec3 emissive = texture2D(u_emissiveTexture, v_texCoord).rgb * u_emissive;

    // Compute light reflection
    vec3 N = normalize(v_normal);
    vec3 V = normalize(u_cameraPos - v_worldPos);
    vec3 L = normalize(-u_lightDir);
    vec3 H = normalize(V + L);
    float NdotL = max(dot(N, L), 0.0);
    float NdotV = max(dot(N, V), 0.0);
    float NdotH = max(dot(N, H), 0.0);

    // Specular reflectance
    vec3 F0 = mix(u_specularColor, albedo, metallic);
    vec3 F = fresnelSchlick(NdotH, F0) * u_specularIntensity;

    // Diffuse and Specular Components
    vec3 kD = (1.0 - F) * (1.0 - metallic);
    vec3 kS = F;

    vec3 diffuse = kD * albedo / 3.14159;
    vec3 specular = kS * pow(NdotH, (1.0 - roughness) * 128.0);

    vec3 finalColor = (diffuse + specular) * NdotL * u_lightColor * ao + emissive;
    
    gl_FragColor = vec4(finalColor, u_opacity);
}
