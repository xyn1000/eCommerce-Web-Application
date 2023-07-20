import request from '@/network/request'
const qs = require('qs');

export function createList(title,brand,image,stock,price,disabled) {
    const regData = qs.stringify({
        'title': title,
        'brand': brand,
        'image': image,
        'stock': stock,
        'price': price,
        'disabled': disabled
    });
    return request({
        url: '/api/listings',
        method: 'post',
        data: regData
    })
}

export function getLists(){
    return request({
        url: '/api/listings',
        method: 'get',
    })
}

export function getListByUid(_id){
    return request({
        url: '/api/listings',
        method: 'get',
        params: {
            'seller':_id,
            'showDisabled': true
        }
    })
}

export function deleteListByLid(Lid){
    return request({
        url: '/api/listings/'+Lid,
        method: 'delete'
        // params: {'listingID':Lid}
    })
}

export function updateList(Lid,title,brand,image,stock,price,disabled){
    const regData = qs.stringify({
        'title': title,
        'brand': brand,
        'image': image,
        'stock': stock,
        'price': price,
        'disabled': disabled
    });
    return request({
        url: '/api/listings/'+Lid,
        method: 'put',
        data: regData,
        params: {'listingID':Lid}
    })
}


//Reviews
export function createReview(rating,comment,listId) {
    const regData = qs.stringify({
        'rating': rating,
        'comment': comment
    });
    return request({
        url: '/api/listings/'+listId+'/reviews',
        method: 'post',
        data: regData
    })
}

export function getTop5Rating(){
    return request({
        url: '/api/listings',
        method: 'get',
        params: {
            'topFiveRating': true
            // 'showDisabled': true
        }
    })
}

export function getLast5Stock(){
    return request({
        url: '/api/listings',
        method: 'get',
        params: {
            'lastFiveStock': true
        }
    })
}

export function getUserNameByID(userID) {
    const requestPromise = request({
        url: `/api/users/${userID}`,
        method: 'get'
    });

    return requestPromise;
}

export function injectReviewUserNames(reviews) {
    const returnPromise = new Promise((onResolve, onReject) => {
        let promises = [];

        // Fill array with promises to inject first/last name for EACH review
        reviews.forEach(review => {
            const requestPromise = getUserNameByID(review.reviewer);

            const injectPromise = new Promise((onResolve, onReject) => {
                requestPromise
                    .then(result => {
                        const injectedReview = { firstName: result.data.firstName, lastName: result.data.lastName, ...review }
                        onResolve(injectedReview);
                    })
                    .catch(error => {
                        onReject(error);
                    });
            });

            promises.push(injectPromise);
        });

        // Call all of them at once, in parallel
        Promise.allSettled(promises)
            .then((results) => {
                let injectedReviews = [];

                results.forEach((result) => {
                    if (result.status == "fulfilled") {
                        injectedReviews.push(result.value);
                    } else if (result.status == "rejected") {
                        console.log(result.reason);
                    }
                });

                onResolve(injectedReviews);
            })
            .catch(error => {
                onReject(error);
            });
    });

    return returnPromise;
}

// export function searchByTerm(keyword,brand,minPrice,maxPrice){
//     const regData = qs.stringify({
//         'keyword': keyword,
//         'brand': brand,
//         'minPrice': minPrice,
//         'maxPrice': maxPrice
//     });
//     return request({
//         url: '/api/listings',
//         method: 'get',
//         data: regData
//     })
// }

export function searchByTerm(keyword,brand,minPrice,maxPrice){
    if (brand==null||brand==="All"||brand===0||brand.length===0){
        return request({
            url: '/api/listings?',
            method: 'get',
            params: {
                'keyword':keyword,
                'minPrice': minPrice,
                'maxPrice': maxPrice
            }
        })
    }

    return request({
        url: '/api/listings?',
        method: 'get',
        params: {
            'keyword':keyword,
            'brand': brand,
            'minPrice': minPrice,
            'maxPrice': maxPrice
        }
    })
}

export function getReviewsByListingID(listId) {
    return request({
        url: '/api/listings/'+listId+'/reviews',
        method: 'get'
    })
}