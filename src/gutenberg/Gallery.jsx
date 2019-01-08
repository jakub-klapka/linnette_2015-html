const { registerBlockType } = wp.blocks;
const { MediaUpload, MediaUploadCheck } = wp.editor;
const { Button, Dashicon } = wp.components;
const { withSelect } = wp.data;
const apiFetch = wp.apiFetch;

registerBlockType( 'linnette/gallery', {
    title: 'Linnette Galerie',

    icon: 'format-gallery',

    category: 'layout',

    attributes: {
        loaded: {
            type: 'bool'
        },
        selected_image_ids: {
            type: 'array'
        }
    },

    edit: withSelect( ( select, object ) => {
        const { attributes } = object;

        return {
            images: select( 'core' ).getEntityRecords( 'postType', 'attachment', { include: [ 11200,11195 ] } )
        }
    } )( ( input ) => {
        console.log(input.images);
        const { attributes, setAttributes } = input;
        return(
            <MediaUploadCheck>
                <MediaUpload
                    onSelect={ ( media ) => {
                        setAttributes( {
                            selected_image_ids: media.map( image => { return image.id } )
                        } );
                    } }
                    allowedTypes={ ['image'] }
                    value={ [] }
                    multiple={true}
                    render={ ( { open } ) => (
                        <Button isDefault onClick={ open }>
                            <Dashicon icon="external"/>&nbsp;Zvolit obrázky
                        </Button>
                    ) }
                />
            </MediaUploadCheck>
        );
    } ),

    save() {
        return <p>Hello saved content.</p>;
    },
} );