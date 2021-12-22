const { getRules } = require("../utils")

const truncate = (input, length) => input.length > length ? `${input.substring(0, length)}...` : input;

module.exports = bannerController = async (request, reply) => {
  if (!request.query.repo || request.query.repo.split("/").length !== 2) {
    reply.badRequest();
  } else {
    const fullName = request.query.repo;
    const rules = await getRules(request.query.repo);
    const percentForOwner = rules[fullName] || 0;
    const rulesNotForOwner = Object.keys(rules).filter(r => r !== fullName).map((repo) => ({ repo, percent: rules[repo] }));

    reply.headers({
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'max-age=3600'
    })

    reply.send(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${rulesNotForOwner.length === 0 ? 290 : 400} ${rulesNotForOwner.length === 0 ? 97 : 100 + ((rulesNotForOwner.length + 1) * 20)}" width="${rulesNotForOwner.length === 0 ? "300px" : "400px"}" height="${`${rulesNotForOwner.length === 0 ? 100 : 105 + ((rulesNotForOwner.length + 1) * 20)}px`}">
        <rect rx="10" ry="10" stroke-linejoin="round" x="0" y="0" width="${rulesNotForOwner.length === 0 ? 285 : 400}" height="${rulesNotForOwner.length === 0 ? 97 : 100 + ((rulesNotForOwner.length + 1) * 20)}" fill="#ddd" />
        <rect rx="10" ry="10" stroke-linejoin="round" x="5" y="5" width="${rulesNotForOwner.length === 0 ? 275 : 390}" height="${rulesNotForOwner.length === 0 ? 87 : 90 + ((rulesNotForOwner.length + 1) * 20)}" fill="#fff" />
        <svg x="15" y="15" width="252" height="67" viewBox="0 0 252 67">
          <path d="M93.5938 32H88.7812L83.5449 23.5781L81.7539 24.8633V32H77.5156V12.0117H81.7539V21.1582L83.4219 18.8066L88.8359 12.0117H93.5391L86.5664 20.8574L93.5938 32ZM95.6035 12.7637C95.6035 11.4056 96.36 10.7266 97.873 10.7266C99.3861 10.7266 100.143 11.4056 100.143 12.7637C100.143 13.4108 99.9512 13.9167 99.5684 14.2812C99.1947 14.6367 98.6296 14.8145 97.873 14.8145C96.36 14.8145 95.6035 14.1309 95.6035 12.7637ZM99.9512 32H95.7812V16.7148H99.9512V32ZM107.977 32L102.152 16.7148H106.514L109.467 25.4238C109.795 26.5267 110 27.5703 110.082 28.5547H110.164C110.21 27.6797 110.415 26.6361 110.779 25.4238L113.719 16.7148H118.08L112.256 32H107.977ZM129.988 32L129.182 29.9219H129.072C128.37 30.806 127.646 31.4212 126.898 31.7676C126.16 32.1048 125.194 32.2734 124 32.2734C122.533 32.2734 121.375 31.8542 120.527 31.0156C119.689 30.1771 119.27 28.9831 119.27 27.4336C119.27 25.8112 119.835 24.6172 120.965 23.8516C122.104 23.0768 123.818 22.6484 126.105 22.5664L128.758 22.4844V21.8145C128.758 20.265 127.965 19.4902 126.379 19.4902C125.158 19.4902 123.722 19.8594 122.072 20.5977L120.691 17.7812C122.451 16.8607 124.401 16.4004 126.543 16.4004C128.594 16.4004 130.166 16.847 131.26 17.7402C132.354 18.6335 132.9 19.9915 132.9 21.8145V32H129.988ZM128.758 24.918L127.145 24.9727C125.932 25.0091 125.03 25.2279 124.438 25.6289C123.845 26.0299 123.549 26.6406 123.549 27.4609C123.549 28.6367 124.223 29.2246 125.572 29.2246C126.538 29.2246 127.309 28.9466 127.883 28.3906C128.466 27.8346 128.758 27.0964 128.758 26.1758V24.918ZM143.414 32.2734C138.656 32.2734 136.277 29.6621 136.277 24.4395C136.277 21.8418 136.924 19.8594 138.219 18.4922C139.513 17.1159 141.368 16.4277 143.783 16.4277C145.551 16.4277 147.137 16.7741 148.541 17.4668L147.311 20.6934C146.654 20.429 146.044 20.2148 145.479 20.0508C144.913 19.8776 144.348 19.791 143.783 19.791C141.614 19.791 140.529 21.3314 140.529 24.4121C140.529 27.4017 141.614 28.8965 143.783 28.8965C144.585 28.8965 145.328 28.7917 146.012 28.582C146.695 28.3633 147.379 28.026 148.062 27.5703V31.1387C147.388 31.5671 146.704 31.8633 146.012 32.0273C145.328 32.1914 144.462 32.2734 143.414 32.2734ZM165.727 32H161.557V23.0723C161.557 20.8665 160.736 19.7637 159.096 19.7637C157.929 19.7637 157.086 20.1602 156.566 20.9531C156.047 21.7461 155.787 23.0312 155.787 24.8086V32H151.617V10.7266H155.787V15.0605C155.787 15.3978 155.755 16.1908 155.691 17.4395L155.596 18.6699H155.814C156.744 17.1751 158.221 16.4277 160.244 16.4277C162.04 16.4277 163.402 16.9108 164.332 17.877C165.262 18.8431 165.727 20.2285 165.727 22.0332V32ZM81.3672 46.0156C80.2943 46.0156 79.4505 46.3958 78.8359 47.1562C78.2214 47.9167 77.9141 48.9661 77.9141 50.3047C77.9141 51.7057 78.2083 52.7656 78.7969 53.4844C79.3906 54.2031 80.2474 54.5625 81.3672 54.5625C81.8516 54.5625 82.3203 54.5156 82.7734 54.4219C83.2266 54.3229 83.6979 54.1979 84.1875 54.0469V55.6484C83.2917 55.987 82.276 56.1562 81.1406 56.1562C79.4688 56.1562 78.1849 55.651 77.2891 54.6406C76.3932 53.625 75.9453 52.1745 75.9453 50.2891C75.9453 49.1016 76.1615 48.0625 76.5938 47.1719C77.0312 46.2812 77.6615 45.599 78.4844 45.125C79.3073 44.651 80.2734 44.4141 81.3828 44.4141C82.5495 44.4141 83.6276 44.6589 84.6172 45.1484L83.9453 46.7031C83.5599 46.5208 83.151 46.362 82.7188 46.2266C82.2917 46.0859 81.8411 46.0156 81.3672 46.0156ZM91.8594 56L91.4922 54.7969H91.4297C91.013 55.3229 90.5938 55.6823 90.1719 55.875C89.75 56.0625 89.2083 56.1562 88.5469 56.1562C87.6979 56.1562 87.0339 55.9271 86.5547 55.4688C86.0807 55.0104 85.8438 54.362 85.8438 53.5234C85.8438 52.6328 86.1745 51.9609 86.8359 51.5078C87.4974 51.0547 88.5052 50.8073 89.8594 50.7656L91.3516 50.7188V50.2578C91.3516 49.7057 91.2214 49.2943 90.9609 49.0234C90.7057 48.7474 90.3073 48.6094 89.7656 48.6094C89.3229 48.6094 88.8984 48.6745 88.4922 48.8047C88.0859 48.9349 87.6953 49.0885 87.3203 49.2656L86.7266 47.9531C87.1953 47.7083 87.7083 47.5234 88.2656 47.3984C88.8229 47.2682 89.349 47.2031 89.8438 47.2031C90.9427 47.2031 91.7708 47.4427 92.3281 47.9219C92.8906 48.401 93.1719 49.1536 93.1719 50.1797V56H91.8594ZM89.125 54.75C89.7917 54.75 90.3255 54.5651 90.7266 54.1953C91.1328 53.8203 91.3359 53.2969 91.3359 52.625V51.875L90.2266 51.9219C89.362 51.9531 88.7318 52.099 88.3359 52.3594C87.9453 52.6146 87.75 53.0078 87.75 53.5391C87.75 53.9245 87.8646 54.224 88.0938 54.4375C88.3229 54.6458 88.6667 54.75 89.125 54.75ZM101.539 53.5391C101.539 54.3828 101.232 55.0312 100.617 55.4844C100.003 55.9323 99.1224 56.1562 97.9766 56.1562C96.8255 56.1562 95.901 55.9818 95.2031 55.6328V54.0469C96.2188 54.5156 97.1641 54.75 98.0391 54.75C99.1693 54.75 99.7344 54.4089 99.7344 53.7266C99.7344 53.5078 99.6719 53.3255 99.5469 53.1797C99.4219 53.0339 99.2161 52.8828 98.9297 52.7266C98.6432 52.5703 98.2448 52.3932 97.7344 52.1953C96.7396 51.8099 96.0651 51.4245 95.7109 51.0391C95.362 50.6536 95.1875 50.1536 95.1875 49.5391C95.1875 48.7995 95.4844 48.2266 96.0781 47.8203C96.6771 47.4089 97.4896 47.2031 98.5156 47.2031C99.5312 47.2031 100.492 47.4089 101.398 47.8203L100.805 49.2031C99.8724 48.8177 99.0885 48.625 98.4531 48.625C97.4844 48.625 97 48.901 97 49.4531C97 49.724 97.125 49.9531 97.375 50.1406C97.6302 50.3281 98.1823 50.5859 99.0312 50.9141C99.7448 51.1901 100.263 51.4427 100.586 51.6719C100.909 51.901 101.148 52.1667 101.305 52.4688C101.461 52.7656 101.539 53.1224 101.539 53.5391ZM107.016 56.1562C105.708 56.1562 104.714 55.776 104.031 55.0156C103.354 54.25 103.016 53.1536 103.016 51.7266C103.016 50.2734 103.37 49.1562 104.078 48.375C104.792 47.5938 105.82 47.2031 107.164 47.2031C108.076 47.2031 108.896 47.3724 109.625 47.7109L109.07 49.1875C108.294 48.8854 107.654 48.7344 107.148 48.7344C105.654 48.7344 104.906 49.7266 104.906 51.7109C104.906 52.6797 105.091 53.4089 105.461 53.8984C105.836 54.3828 106.383 54.625 107.102 54.625C107.919 54.625 108.693 54.4219 109.422 54.0156V55.6172C109.094 55.8099 108.742 55.9479 108.367 56.0312C107.997 56.1146 107.547 56.1562 107.016 56.1562ZM116.859 56L116.492 54.7969H116.43C116.013 55.3229 115.594 55.6823 115.172 55.875C114.75 56.0625 114.208 56.1562 113.547 56.1562C112.698 56.1562 112.034 55.9271 111.555 55.4688C111.081 55.0104 110.844 54.362 110.844 53.5234C110.844 52.6328 111.174 51.9609 111.836 51.5078C112.497 51.0547 113.505 50.8073 114.859 50.7656L116.352 50.7188V50.2578C116.352 49.7057 116.221 49.2943 115.961 49.0234C115.706 48.7474 115.307 48.6094 114.766 48.6094C114.323 48.6094 113.898 48.6745 113.492 48.8047C113.086 48.9349 112.695 49.0885 112.32 49.2656L111.727 47.9531C112.195 47.7083 112.708 47.5234 113.266 47.3984C113.823 47.2682 114.349 47.2031 114.844 47.2031C115.943 47.2031 116.771 47.4427 117.328 47.9219C117.891 48.401 118.172 49.1536 118.172 50.1797V56H116.859ZM114.125 54.75C114.792 54.75 115.326 54.5651 115.727 54.1953C116.133 53.8203 116.336 53.2969 116.336 52.625V51.875L115.227 51.9219C114.362 51.9531 113.732 52.099 113.336 52.3594C112.945 52.6146 112.75 53.0078 112.75 53.5391C112.75 53.9245 112.865 54.224 113.094 54.4375C113.323 54.6458 113.667 54.75 114.125 54.75ZM123.648 56.1562C122.57 56.1562 121.729 55.7656 121.125 54.9844C120.521 54.2031 120.219 53.1068 120.219 51.6953C120.219 50.2786 120.523 49.1771 121.133 48.3906C121.747 47.599 122.596 47.2031 123.68 47.2031C124.815 47.2031 125.68 47.6224 126.273 48.4609H126.367C126.279 47.8411 126.234 47.3516 126.234 46.9922V43.8438H128.078V56H126.641L126.32 54.8672H126.234C125.646 55.7266 124.784 56.1562 123.648 56.1562ZM124.141 54.6719C124.896 54.6719 125.445 54.4609 125.789 54.0391C126.133 53.612 126.31 52.9219 126.32 51.9688V51.7109C126.32 50.6224 126.143 49.849 125.789 49.3906C125.435 48.9323 124.88 48.7031 124.125 48.7031C123.479 48.7031 122.982 48.9661 122.633 49.4922C122.284 50.013 122.109 50.7578 122.109 51.7266C122.109 52.6849 122.279 53.4167 122.617 53.9219C122.956 54.4219 123.464 54.6719 124.141 54.6719ZM132.539 56H130.703V47.3594H132.539V56ZM130.594 45.0703C130.594 44.7422 130.682 44.4896 130.859 44.3125C131.042 44.1354 131.299 44.0469 131.633 44.0469C131.956 44.0469 132.206 44.1354 132.383 44.3125C132.565 44.4896 132.656 44.7422 132.656 45.0703C132.656 45.3828 132.565 45.6302 132.383 45.8125C132.206 45.9896 131.956 46.0781 131.633 46.0781C131.299 46.0781 131.042 45.9896 130.859 45.8125C130.682 45.6302 130.594 45.3828 130.594 45.0703ZM142.773 56H140.93V50.6875C140.93 50.0208 140.794 49.5234 140.523 49.1953C140.258 48.8672 139.833 48.7031 139.25 48.7031C138.474 48.7031 137.906 48.9323 137.547 49.3906C137.188 49.849 137.008 50.6172 137.008 51.6953V56H135.172V47.3594H136.609L136.867 48.4922H136.961C137.221 48.0807 137.591 47.763 138.07 47.5391C138.549 47.3151 139.081 47.2031 139.664 47.2031C141.737 47.2031 142.773 48.2578 142.773 50.3672V56ZM152.625 47.3594V48.3672L151.148 48.6406C151.284 48.8229 151.396 49.0469 151.484 49.3125C151.573 49.5781 151.617 49.8594 151.617 50.1562C151.617 51.0469 151.31 51.7474 150.695 52.2578C150.081 52.7682 149.234 53.0234 148.156 53.0234C147.88 53.0234 147.63 53.0026 147.406 52.9609C147.01 53.2057 146.812 53.4922 146.812 53.8203C146.812 54.0182 146.904 54.1667 147.086 54.2656C147.273 54.3646 147.615 54.4141 148.109 54.4141H149.617C150.57 54.4141 151.294 54.6172 151.789 55.0234C152.284 55.4297 152.531 56.0156 152.531 56.7812C152.531 57.7604 152.128 58.5156 151.32 59.0469C150.513 59.5781 149.346 59.8438 147.82 59.8438C146.643 59.8438 145.745 59.6354 145.125 59.2188C144.505 58.8021 144.195 58.2083 144.195 57.4375C144.195 56.9062 144.362 56.4583 144.695 56.0938C145.034 55.7344 145.505 55.4844 146.109 55.3438C145.865 55.2396 145.661 55.0729 145.5 54.8438C145.344 54.6094 145.266 54.3646 145.266 54.1094C145.266 53.7865 145.357 53.513 145.539 53.2891C145.721 53.0651 145.992 52.8438 146.352 52.625C145.904 52.4323 145.539 52.1198 145.258 51.6875C144.982 51.25 144.844 50.7396 144.844 50.1562C144.844 49.2188 145.138 48.4922 145.727 47.9766C146.32 47.4609 147.164 47.2031 148.258 47.2031C148.503 47.2031 148.758 47.2214 149.023 47.2578C149.294 47.2891 149.497 47.3229 149.633 47.3594H152.625ZM145.836 57.3438C145.836 57.7396 146.013 58.0443 146.367 58.2578C146.727 58.4714 147.229 58.5781 147.875 58.5781C148.875 58.5781 149.62 58.4349 150.109 58.1484C150.599 57.862 150.844 57.4818 150.844 57.0078C150.844 56.6328 150.708 56.3646 150.438 56.2031C150.172 56.0469 149.674 55.9688 148.945 55.9688H147.555C147.029 55.9688 146.609 56.0911 146.297 56.3359C145.99 56.5859 145.836 56.9219 145.836 57.3438ZM146.625 50.1562C146.625 50.6979 146.763 51.1146 147.039 51.4062C147.32 51.6979 147.721 51.8438 148.242 51.8438C149.305 51.8438 149.836 51.276 149.836 50.1406C149.836 49.5781 149.703 49.1458 149.438 48.8438C149.177 48.5365 148.779 48.3828 148.242 48.3828C147.711 48.3828 147.307 48.5339 147.031 48.8359C146.76 49.138 146.625 49.5781 146.625 50.1562ZM161.305 56.1562C160.227 56.1562 159.385 55.7656 158.781 54.9844C158.177 54.2031 157.875 53.1068 157.875 51.6953C157.875 50.2786 158.18 49.1771 158.789 48.3906C159.404 47.599 160.253 47.2031 161.336 47.2031C162.471 47.2031 163.336 47.6224 163.93 48.4609H164.023C163.935 47.8411 163.891 47.3516 163.891 46.9922V43.8438H165.734V56H164.297L163.977 54.8672H163.891C163.302 55.7266 162.44 56.1562 161.305 56.1562ZM161.797 54.6719C162.552 54.6719 163.102 54.4609 163.445 54.0391C163.789 53.612 163.966 52.9219 163.977 51.9688V51.7109C163.977 50.6224 163.799 49.849 163.445 49.3906C163.091 48.9323 162.536 48.7031 161.781 48.7031C161.135 48.7031 160.638 48.9661 160.289 49.4922C159.94 50.013 159.766 50.7578 159.766 51.7266C159.766 52.6849 159.935 53.4167 160.273 53.9219C160.612 54.4219 161.12 54.6719 161.797 54.6719ZM176.023 51.6641C176.023 53.0755 175.661 54.1771 174.938 54.9688C174.214 55.7604 173.206 56.1562 171.914 56.1562C171.107 56.1562 170.393 55.974 169.773 55.6094C169.154 55.2448 168.677 54.7214 168.344 54.0391C168.01 53.3568 167.844 52.5651 167.844 51.6641C167.844 50.263 168.203 49.1693 168.922 48.3828C169.641 47.5964 170.654 47.2031 171.961 47.2031C173.211 47.2031 174.201 47.6068 174.93 48.4141C175.659 49.2161 176.023 50.2995 176.023 51.6641ZM169.734 51.6641C169.734 53.6589 170.471 54.6562 171.945 54.6562C173.404 54.6562 174.133 53.6589 174.133 51.6641C174.133 49.6901 173.398 48.7031 171.93 48.7031C171.159 48.7031 170.599 48.9583 170.25 49.4688C169.906 49.9792 169.734 50.7109 169.734 51.6641ZM185.742 56H183.898V50.6875C183.898 50.0208 183.763 49.5234 183.492 49.1953C183.227 48.8672 182.802 48.7031 182.219 48.7031C181.443 48.7031 180.875 48.9323 180.516 49.3906C180.156 49.849 179.977 50.6172 179.977 51.6953V56H178.141V47.3594H179.578L179.836 48.4922H179.93C180.19 48.0807 180.56 47.763 181.039 47.5391C181.518 47.3151 182.049 47.2031 182.633 47.2031C184.706 47.2031 185.742 48.2578 185.742 50.3672V56ZM193.703 56L193.336 54.7969H193.273C192.857 55.3229 192.438 55.6823 192.016 55.875C191.594 56.0625 191.052 56.1562 190.391 56.1562C189.542 56.1562 188.878 55.9271 188.398 55.4688C187.924 55.0104 187.688 54.362 187.688 53.5234C187.688 52.6328 188.018 51.9609 188.68 51.5078C189.341 51.0547 190.349 50.8073 191.703 50.7656L193.195 50.7188V50.2578C193.195 49.7057 193.065 49.2943 192.805 49.0234C192.549 48.7474 192.151 48.6094 191.609 48.6094C191.167 48.6094 190.742 48.6745 190.336 48.8047C189.93 48.9349 189.539 49.0885 189.164 49.2656L188.57 47.9531C189.039 47.7083 189.552 47.5234 190.109 47.3984C190.667 47.2682 191.193 47.2031 191.688 47.2031C192.786 47.2031 193.615 47.4427 194.172 47.9219C194.734 48.401 195.016 49.1536 195.016 50.1797V56H193.703ZM190.969 54.75C191.635 54.75 192.169 54.5651 192.57 54.1953C192.977 53.8203 193.18 53.2969 193.18 52.625V51.875L192.07 51.9219C191.206 51.9531 190.576 52.099 190.18 52.3594C189.789 52.6146 189.594 53.0078 189.594 53.5391C189.594 53.9245 189.708 54.224 189.938 54.4375C190.167 54.6458 190.51 54.75 190.969 54.75ZM200.797 54.6719C201.245 54.6719 201.693 54.6016 202.141 54.4609V55.8438C201.938 55.9323 201.674 56.0052 201.352 56.0625C201.034 56.125 200.703 56.1562 200.359 56.1562C198.62 56.1562 197.75 55.2396 197.75 53.4062V48.75H196.57V47.9375L197.836 47.2656L198.461 45.4375H199.594V47.3594H202.055V48.75H199.594V53.375C199.594 53.8177 199.703 54.1458 199.922 54.3594C200.146 54.5677 200.438 54.6719 200.797 54.6719ZM205.711 56H203.875V47.3594H205.711V56ZM203.766 45.0703C203.766 44.7422 203.854 44.4896 204.031 44.3125C204.214 44.1354 204.471 44.0469 204.805 44.0469C205.128 44.0469 205.378 44.1354 205.555 44.3125C205.737 44.4896 205.828 44.7422 205.828 45.0703C205.828 45.3828 205.737 45.6302 205.555 45.8125C205.378 45.9896 205.128 46.0781 204.805 46.0781C204.471 46.0781 204.214 45.9896 204.031 45.8125C203.854 45.6302 203.766 45.3828 203.766 45.0703ZM216.008 51.6641C216.008 53.0755 215.646 54.1771 214.922 54.9688C214.198 55.7604 213.19 56.1562 211.898 56.1562C211.091 56.1562 210.378 55.974 209.758 55.6094C209.138 55.2448 208.661 54.7214 208.328 54.0391C207.995 53.3568 207.828 52.5651 207.828 51.6641C207.828 50.263 208.188 49.1693 208.906 48.3828C209.625 47.5964 210.638 47.2031 211.945 47.2031C213.195 47.2031 214.185 47.6068 214.914 48.4141C215.643 49.2161 216.008 50.2995 216.008 51.6641ZM209.719 51.6641C209.719 53.6589 210.456 54.6562 211.93 54.6562C213.388 54.6562 214.117 53.6589 214.117 51.6641C214.117 49.6901 213.383 48.7031 211.914 48.7031C211.143 48.7031 210.583 48.9583 210.234 49.4688C209.891 49.9792 209.719 50.7109 209.719 51.6641ZM225.727 56H223.883V50.6875C223.883 50.0208 223.747 49.5234 223.477 49.1953C223.211 48.8672 222.786 48.7031 222.203 48.7031C221.427 48.7031 220.859 48.9323 220.5 49.3906C220.141 49.849 219.961 50.6172 219.961 51.6953V56H218.125V47.3594H219.562L219.82 48.4922H219.914C220.174 48.0807 220.544 47.763 221.023 47.5391C221.503 47.3151 222.034 47.2031 222.617 47.2031C224.69 47.2031 225.727 48.2578 225.727 50.3672V56ZM234.086 53.5391C234.086 54.3828 233.779 55.0312 233.164 55.4844C232.549 55.9323 231.669 56.1562 230.523 56.1562C229.372 56.1562 228.448 55.9818 227.75 55.6328V54.0469C228.766 54.5156 229.711 54.75 230.586 54.75C231.716 54.75 232.281 54.4089 232.281 53.7266C232.281 53.5078 232.219 53.3255 232.094 53.1797C231.969 53.0339 231.763 52.8828 231.477 52.7266C231.19 52.5703 230.792 52.3932 230.281 52.1953C229.286 51.8099 228.612 51.4245 228.258 51.0391C227.909 50.6536 227.734 50.1536 227.734 49.5391C227.734 48.7995 228.031 48.2266 228.625 47.8203C229.224 47.4089 230.036 47.2031 231.062 47.2031C232.078 47.2031 233.039 47.4089 233.945 47.8203L233.352 49.2031C232.419 48.8177 231.635 48.625 231 48.625C230.031 48.625 229.547 48.901 229.547 49.4531C229.547 49.724 229.672 49.9531 229.922 50.1406C230.177 50.3281 230.729 50.5859 231.578 50.9141C232.292 51.1901 232.81 51.4427 233.133 51.6719C233.456 51.901 233.695 52.1667 233.852 52.4688C234.008 52.7656 234.086 53.1224 234.086 53.5391Z" fill="#2D2C2C"/>
          <path d="M27.0938 0.029835C21.6088 0.576014 16.9024 2.37724 12.7189 5.50325C11.1617 6.66533 8.50051 9.33812 7.35005 10.8837C4.54943 14.6605 2.79468 18.8672 2.09743 23.4923C1.84177 25.2238 1.80691 29.2446 2.03933 30.8134C2.50416 33.9743 3.38735 36.8563 4.67726 39.4593C6.095 42.3181 7.72192 44.5841 10.0112 46.8502C14.2877 51.115 20.0865 53.8808 26.2107 54.578C28.0119 54.7872 32.0792 54.671 33.8339 54.3572C39.4468 53.3578 44.2113 50.9291 48.2903 46.9664C51.5906 43.759 53.7985 40.2495 55.2163 35.9266C56.7037 31.441 56.9943 26.6067 56.0762 21.9816C55.0303 16.729 52.4854 11.9528 48.7202 8.16442C44.3973 3.81823 39.2376 1.19192 33.1367 0.23901C32.0327 0.0763186 28.07 -0.0631316 27.0938 0.029835ZM31.4284 6.71182C34.0199 6.99072 36.1 7.60662 38.4823 8.80356C40.4578 9.77971 41.9104 10.8023 43.4792 12.3014C47.3606 15.9969 49.5221 20.5406 49.9172 25.8165C50.4285 32.4636 47.6743 38.9945 42.596 43.2477C39.9349 45.4789 36.8321 46.978 33.311 47.745C32.2303 47.9774 31.7654 48.0006 29.2437 48.0006C26.722 48.0006 26.2571 47.9774 25.1764 47.745C20.9929 46.8386 17.6926 45.0838 14.7293 42.2135C7.09439 34.7878 6.33904 22.7951 12.9745 14.4281C16.4608 10.0354 21.4345 7.33934 27.3263 6.65371C28.1281 6.56075 30.3825 6.59561 31.4284 6.71182Z" fill="#2D2D2D"/>
          <path d="M3.81163 51.0916C3.0679 51.2194 2.13823 51.7423 1.68502 52.3117C1.3364 52.7417 0 55.031 0 55.1821C0 55.3215 3.10276 57.9943 4.36943 58.9472C7.94865 61.6433 12.597 63.9326 17.164 65.269C23.2417 67.047 29.9004 67.4653 36.257 66.4776C44.3218 65.2225 51.3757 61.8989 57.3953 56.5185L58.7898 55.2751L58.0925 54.02C57.6974 53.3344 57.1396 52.5325 56.8491 52.2304C55.9194 51.2659 54.6528 50.9172 53.328 51.2543C52.5145 51.4634 51.9219 51.8353 50.4344 53.0787C46.6809 56.2164 41.6142 58.587 36.4313 59.6329C32.9799 60.3301 28.6453 60.5161 25.345 60.1093C18.8374 59.3191 12.7945 56.7858 8.19268 52.9393C6.72846 51.7075 6.44956 51.5215 5.81041 51.2891C5.12479 51.0451 4.47402 50.987 3.81163 51.0916Z" fill="#2D2D2D"/>
        </svg>

        ${rulesNotForOwner.length !== 0 && `<g style="user-select: none; -ms-user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; color: #2D2C2C;">
          <line stroke-linecap="round" x1="15" y1="100" x2="80" y2="100" stroke-width="5" stroke="#ddd" />
          <text x="100" font-family="Segoe UI, Ubuntu, Sans-Serif" className="unselectable" y="105">${truncate(fullName, 26)} - ${percentForOwner}%</text>
        </g>`}

        ${rulesNotForOwner.map((r, i) => `<g>
          <line stroke-linecap="round" x1="32" y1="${100 + (i === rulesNotForOwner.length - 1 ? 20 : 22) * i}" x2="32" y2="${125 + (i === rulesNotForOwner.length - 1 ? 20 : 22) * i}" stroke-width="5" stroke="#ddd" />
          <line stroke-linecap="round" x1="32" y1="${120 + 20 * i}" x2="100" y2="${120 + 20 * i}" stroke-width="5" stroke="#ddd" />
          <g style="user-select: none; -ms-user-select: none; -moz-user-select: none; -khtml-user-select: none; -webkit-user-select: none; -webkit-touch-callout: none; color: #2D2C2C;"><text font-family="Segoe UI, Ubuntu, Sans-Serif" font-weight="300" className="unselectable" x="120" y="${125 + 20 * i}">${truncate(r.repo.replace(/(<([^>]+)>)/gi, ""), 24)} - ${r.percent}%</text></g>
        </g>`).join(" ")}
      </svg>
    `)
  }
}

