import Joi from 'joi';
import { deleteCookie } from 'cookies-next';
import { env } from 'process';

export function validationField(errors, setErrors, schema, payload) {
    const err = JSON.parse(JSON.stringify(errors));
    const res = schema.validate(payload, { abortEarly: false });
    setErrors({});
    let errorsList = {};
    if (res.error) {
        res.error.details.forEach((error) => {
            errorsList[error.context.key] = error.message;
        });
        setErrors(errors => ({
            ...errors,
            ...errorsList
        }));
        return false;
    } else {
        return true;
    }

}
export function deleteLoginSession() {
    deleteCookie('token');
    localStorage.removeItem('user');
}