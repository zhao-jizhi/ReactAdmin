import React from 'react'
import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {reqDeleteImg} from "../../api";
import {BASE_IMG_URL} from '../../utils/constents'


export default class PicturesWall extends React.Component {
    state = {
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [
            /*{
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            }*/
        ],
    };

    constructor (props) {
        super (props)
        let fileList = []
        const {imgs} = this.props
        if (imgs && imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img,
            }))
        }
        this.state = {
            previewVisible: false,
            previewImage: '',
            previewTitle: '',
            fileList: fileList
        }
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = file => {
        console.log(file)
        this.setState({
            //file.thumbUrl是图片的64位编码格式
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
            //substring() 方法用于提取字符串中介于两个指定下标之间的字符
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = async ({ file, fileList }) => {
        console.log('handleChange()', file.status, fileList.length, file===fileList[fileList.length-1])
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                message.success('图片上传成功')
                const {name, url} = result.data
                file = fileList[fileList.length-1]
                file.name = name
                file.url = BASE_IMG_URL + name
            } else {
                message.error('图片上传失败')
            }
        } else if (file.status === 'remove') {
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
        }

        this.setState({ fileList })
    };

    getImgs = () => {
        return this.state.fileList.map(file =>  file.name)
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <div>
                <Upload
                    action="/manage/img/upload"
                    listType="picture-card"
                    accept='image/*'
                    name='image'
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img alt="img" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}
