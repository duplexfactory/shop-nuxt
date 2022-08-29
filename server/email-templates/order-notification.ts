export default `<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
</head>

<body>

<div style="background-color: #f5f5f5; width: 100%; margin: 0; padding-top: 45px; padding-bottom: 45px;">
    <table  style="width: 600px; margin: 0 auto;">
        <tbody>
        <tr>
            <td style="border: 1px solid #ccc; border-radius: 4px; background-color: white;">
                <div style="padding: 30px;">
                    <table>
                        <tbody>
                        <tr>
                            <td style="padding-bottom: 20px; font-size: 20px;">
                                __t1__
                            </td>
                        </tr>
                        <tr>
                            <td style="color: #1F2937; padding-bottom: 8px;">
                                訂單號碼：__order_id__
                            </td>
                        </tr>
                        <tr>
                            <td style="color: #1F2937; padding-bottom: 8px;">
                                訂單日期：__order_date__
                            </td>
                        </tr>
                        <tr>
                            <td style="color: #1F2937; padding-bottom: 20px;">
                                訂單狀態：__order_status__
                            </td>
                        </tr>
                        <tr>
                            <td style="color: #1F2937; padding-bottom: 20px;">
                                <div style="padding-bottom: 8px;">訂單總計</div>
                                <div style="font-size: 1.25rem; font-weight: 600; line-height: 1.75rem;">HK$ <span style="color: #be185d">__order_total__</span></div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <a href="__link__" target="_blank"
                                   style="border-radius: 0.375rem; font-weight: 600; padding-left: 1.5rem; padding-right: 1.5rem; padding-top: 0.5rem; padding-bottom: 0.5rem;text-decoration: none; color: #ffffff; background: #F472B6; display: inline-block; font-size: 14px; cursor: pointer;">
                                    查看訂單詳情
                                </a>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
</div>
</body>
</html>
`
