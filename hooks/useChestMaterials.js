import { useEffect, useMemo } from "react";

export default function useChestMaterials(materials) {
    const darkMaterials = useMemo(
        () =>
            Object.fromEntries(
                ["wood", "stone"].map((name) => {
                    // GLTF materials may be shared with other models; tint owned copies only.
                    const material = materials[name].clone();
                    material.color.multiplyScalar(0.45);
                    material.emissive?.multiplyScalar(0.45);
                    return [name, material];
                }),
            ),
        [materials],
    );

    useEffect(
        () => () =>
            Object.values(darkMaterials).forEach((material) =>
                material.dispose(),
            ),
        [darkMaterials],
    );
    return darkMaterials;
}
