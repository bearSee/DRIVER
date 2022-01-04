<template>
  <div class="cropper-image-container">
    <div class="image-container">
      <div class="cropper-box cropper-bg">
        <img
          class="origin-image"
          ref="image"
          :src="imgSRC"
          alt=""
          srcset="">
      </div>
      <div class="operate-box">
        <div class="cropper-preview-box cropper-bg">
          <div id="cropper-preview" />
        </div>
        <div class="upload-container">
          <input
            type="file"
            name="file"
            ref="file"
            id="upload-cover"
            accept="image/jpg,image/jpeg,image/png"
            @change="fileChange">
          <label
            class="upload-btn el-button submit el-button--primary el-button--small"
            for="upload-cover">{{ imgSRC ? '重新上传' : '上传图片' }}</label>
        </div>
        <div class="info-tips">
          <p>建议图片大小不超过3M</p>
          <p>支持jpg、jpeg、png格式的图片</p>
        </div>
      </div>
    </div>
    <div class="button-list">
      <sib-throttle
        :time="1000"
        events="click">
        <el-button
          class="submit"
          type="primary"
          @click.native="handlerSubmit">
          确定
        </el-button>
      </sib-throttle>
      <sib-throttle
        :time="1000"
        events="click">
        <el-button
          class="reset"
          @click.native="$emit('cancel')">
          取消
        </el-button>
      </sib-throttle>
    </div>
  </div>
</template>
<script>
import Cropper from 'cropperjs';

export default {
    name: 'Capture',
    props: {
        src: {
            type: String,
            default: '',
        },
    },
    data() {
        return {
            imgSRC: this.src,
            imageType: '',
            cropper: null,
        };
    },
    methods: {
        getImageDataURL() {
            return this.cropper && this.cropper.getCroppedCanvas().toDataURL(`image/${this.imageType || 'jpeg'}`);
        },
        getImageBlob() {
            return new Promise((resolve) => {
                if (!this.cropper) {
                    resolve();
                    return;
                }
                this.cropper.getCroppedCanvas().toBlob((blob) => {
                    const url = URL.createObjectURL(blob);
                    resolve(blob, url);
                });
            });
        },
        fileChange(e) {
            try {
                const file = e.target.files[0];
                const type = file.type.split('/')[1];
                const size = file.size;
                if (size > 1024 * 1024 * 3) {
                    this.$notification.error({ message: '上传图片大小不能超过3M！' });
                    return;
                }
                if (!/(jpg|png|jpeg)/gi.test(type)) {
                    this.$notification.error({ message: '上传图片只支持jpg、jpeg、png格式！' });
                    return;
                }
                this.imageType = (type || '').toLocaleLowerCase();
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = (event) => {
                    this.imgSRC = event.target.result;
                    this.$nextTick(() => {
                        if (this.cropper) {
                            this.cropper.replace(this.imgSRC);
                        } else {
                            const image = this.$refs.image;
                            this.cropper = new Cropper(image, {
                                preview: '#cropper-preview',
                            });
                        }
                    });
                };
            } catch (error) {
                console.log(error);
            }
        },
        handlerSubmit() {
            this.$emit('submit', this.getImageDataURL());
        },
    },
    mounted() {
        if (!this.imgSRC) return;
        const image = this.$refs.image;
        this.cropper = new Cropper(image, {
            preview: '#cropper-preview',
        });
    },
};
</script>
<style lang="scss">
.cropper-image-container {
    .image-container {
        width: 100%;
        height: 100%;
        padding: 15px 0;
        .cropper-box {
            width: 360px;
            height: 360px;
            display: inline-block;
            vertical-align: top;
            .origin-image {
                width: 360px;
                opacity: 0;
            }
        }
        .operate-box {
            margin-left: 30px;
            width: 270px;
            display: inline-block;
            vertical-align: top;
            .cropper-preview-box {
                width: 270px;
                height: 150px;
                overflow: hidden;
                display: flex;
                #cropper-preview {
                    width: 270px;
                    height: 150px;
                    overflow: hidden;
                    display: inline-block;
                    margin: auto;
                    border: 1px solid #d6d6d6
                }
            }
            .upload-container {
                margin-top: 10px;
                text-align: center;
                #upload-cover {
                    display: none;
                }
                .upload-btn {
                    // display: block;
                    // height: 32px;
                    // line-height: 32px;
                    // border-radius: 2px;
                    // border: 1px solid rgba(0, 0, 0, 0.15);
                    // color: rgba(0, 0, 0, 0.65);
                    // cursor: pointer;
                }
            }
            .info-tips {
                margin-top: 36px;
                text-align: center;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #888888;
                line-height: 1.5;
            }
        }
    }
    .button-list {
        text-align: right;
    }
}

</style>
