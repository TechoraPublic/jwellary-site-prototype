export const getImageUrl = (image) => {
    if (!image) {
        return "/images/placeholder.jpg";
    }

    if (typeof image === "string") {
        return image;
    }

    return image.url || "/images/placeholder.jpg";
};
