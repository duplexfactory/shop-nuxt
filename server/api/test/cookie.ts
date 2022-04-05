import {useCookie} from 'h3'

export default (req, res) => {
    const token = useCookie(req, 'csrfToken')
    return {token: token || ''}
}
