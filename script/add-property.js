document.addEventListener("DOMContentLoaded", () => {
    const storage = window.AppStorage;
    const form = document.getElementById("addPropertyForm");
    const cancelBtn = document.getElementById("cancelAddProperty");
    const editId = localStorage.getItem("editingPropertyId");
    const currentUser = storage
        ? storage.getCurrentUser()
        : JSON.parse(localStorage.getItem("currentUser") || "null");

    if (!currentUser) {
        alert("❌ You must be logged in to add a property!");
        window.location.href = "login.html";
        return;
    }

     if (editId) {
    const pageTitle = document.getElementById("pageTitle");
    const formTitle = document.getElementById("formTitle");
    const submitBtn = document.getElementById("submitBtn");
    const tit=document.getElementById("tit");
    const P=document.getElementById("par");

    if (pageTitle) pageTitle.textContent = "Edit Property";
    if (formTitle) formTitle.textContent = "Edit Property Details";
    if (submitBtn) submitBtn.textContent = "Update Property";
    if(tit) tit.textContent="Hostera - Edit Property";
    if(P) P.textContent="Make changes to your property."
}

    if (editId) {
        const properties = storage
            ? storage.getLS("properties", [])
            : JSON.parse(localStorage.getItem("properties") || "[]");
        const property = properties.find(p => p.id == editId);

        if (property) {
            document.getElementById("title").value = property.title || "";
            document.getElementById("city").value = property.city || "";
            document.getElementById("country").value = property.country || "";
            document.getElementById("propertyType").value = property.propertyType || "";
            document.getElementById("price").value = property.price || "";
            document.getElementById("guests").value = property.guests || "";
            document.getElementById("bedrooms").value = property.bedrooms || "";
            document.getElementById("bathrooms").value = property.bathrooms || "";
            document.getElementById("description").value = property.description || "";
            document.getElementById("amenities").value = property.amenities ? property.amenities.join(", ") : "";
            document.getElementById("images").value = property.images ? property.images.join(", ") : "";
        }
    }

    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            postPropertyFromPage();
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            const confirmCancel = confirm(
                "Are you sure you want to cancel?\nYour property details will not be saved."
            );

            if (confirmCancel) {
                localStorage.removeItem("editingPropertyId");
                window.location.href = "property.html";
            }
        });
    }
});

async function postPropertyFromPage() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

    if (!currentUser || !currentUser.id) {
        alert("❌ You must be logged in to post properties!");
        window.location.href = "login.html";
        return;
    }

    const title = document.getElementById("title").value.trim();
    const city = document.getElementById("city").value.trim();
    const country = document.getElementById("country").value.trim();
    const propertyType = document.getElementById("propertyType").value;
    const price = Number(document.getElementById("price").value);
    const guests = Number(document.getElementById("guests").value);
    const bedrooms = Number(document.getElementById("bedrooms").value);
    const bathrooms = Number(document.getElementById("bathrooms").value);
    const description = document.getElementById("description").value.trim();

    const imagesText = document.getElementById("images").value.trim();
    const images = imagesText
        ? imagesText.split(",").map(img => img.trim()).filter(Boolean)
        : [];

    if (!title || !city || !country || !propertyType || !price || !guests || !bedrooms || !bathrooms || !description) {
        alert("❌ Please fill in all required fields.");
        return;
    }

    try {
        const result = await apiRequest("/Properties/create", "POST", {
            ownerId: currentUser.id,
            title,
            city,
            country,
            propertyType,
            price,
            guests,
            bedrooms,
            bathrooms,
            description,
            images
        });

        alert(result.message);
        window.location.href = "property.html";
    } catch (error) {
        alert("❌ " + error.message);
    }
}